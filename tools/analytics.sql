-- Queries for the anonymous result tables (Supabase SQL editor). Rows from before play_no existed have play_no NULL and are left out.
-- play_no is a per-browser counter per game, not an ID: a cleared or private browser starts again at 1.

-- 1. Browsers by number of plays, per game. A browser that stopped after n plays sent play_no = n but never n + 1.
with c as (
  select 'wand' as game, play_no as n, count(*) as k from public.wand_results where play_no is not null group by 2
  union all
  select 'sorting', play_no, count(*) from public.sorting_results where play_no is not null group by 2
)
select a.game, case when a.n >= 10 then '10+' else a.n::text end as plays,
       a.k - case when a.n < 10 then coalesce(b.k, 0) else 0 end as browsers
from c a left join c b on b.game = a.game and b.n = a.n + 1
where a.n <= 10
order by a.game, a.n;

-- 2a. Wand distribution on a first game only.
select wand_id, count(*) as games, round(100.0 * count(*) / sum(count(*)) over (), 1) as pct
from public.wand_results where play_no = 1 group by 1 order by 2 desc;

-- 2b. House distribution on a first sorting only.
select house, count(*) as games, round(100.0 * count(*) / sum(count(*)) over (), 1) as pct
from public.sorting_results where play_no = 1 group by 1 order by 2 desc;

-- 3. Share of repeat rows (play_no > 1), per game.
select 'wand' as game, count(*) as games, count(*) filter (where play_no > 1) as repeats,
       round(100.0 * count(*) filter (where play_no > 1) / nullif(count(*), 0), 1) as repeat_pct
from public.wand_results where play_no is not null
union all
select 'sorting', count(*), count(*) filter (where play_no > 1),
       round(100.0 * count(*) filter (where play_no > 1) / nullif(count(*), 0), 1)
from public.sorting_results where play_no is not null;

-- 4. Share of sortings answered in head mode, overall and by device.
select coalesce(device_type, 'all') as device, count(*) as games, count(*) filter (where input_mode = 'head') as head,
       round(100.0 * count(*) filter (where input_mode = 'head') / nullif(count(*), 0), 1) as head_pct
from public.sorting_results where input_mode is not null
group by rollup (device_type) order by 2 desc;

-- 5. Where players came from, per game. NULL is a direct visit or unknown; Telegram is rarely seen without the ?s=tg tag.
select 'wand' as game, coalesce(source, 'direct / unknown') as source, count(*) as games,
       round(100.0 * count(*) / sum(count(*)) over (), 1) as pct
from public.wand_results where play_no is not null group by 2
union all
select 'sorting', coalesce(source, 'direct / unknown'), count(*),
       round(100.0 * count(*) / sum(count(*)) over (), 1)
from public.sorting_results where play_no is not null group by 2
order by 1, 3 desc;

-- 6. Where players leave, per game: how many reached each step and how many went no further.
-- Steps are sent once per page load and rows are not linked. 'open' also counts bots and stray opens, so read the funnel from 'enter'.
-- 'again' and 'to_sorting' are not part of the path: they are counted at the end.
with path(game, step, ord) as (values
  ('wand', 'open', 1), ('wand', 'enter', 2), ('wand', 'input', 3), ('wand', 'warmup', 4), ('wand', 'attempt', 5), ('wand', 'result', 6),
  ('sorting', 'open', 1), ('sorting', 'enter', 2), ('sorting', 'hat', 3), ('sorting', 'start', 4), ('sorting', 'q1', 5), ('sorting', 'q2', 6), ('sorting', 'q3', 7), ('sorting', 'wish', 8), ('sorting', 'result', 9)),
c as (select p.game, p.step, p.ord, count(s.id) as reached from path p left join public.game_steps s on s.game = p.game and s.step = p.step group by 1, 2, 3)
select a.game, a.ord, a.step, a.reached,
       case when b.step is null then null else a.reached - b.reached end as left_here,
       case when b.step is null or a.reached = 0 then null else round(100.0 * (a.reached - b.reached) / a.reached, 1) end as left_pct
from c a left join c b on b.game = a.game and b.ord = a.ord + 1
order by a.game, a.ord;

-- 6b. The same path cut by device, language or source: add the column to both selects in "c" and to the join, or filter, for example:
--     ... left join public.game_steps s on s.game = p.game and s.step = p.step and s.device_type = 'phone' ...

-- 7. Side steps: Try again, and the signpost to Hogwarts.
select game, step, count(*) as times from public.game_steps where step in ('again', 'to_sorting') group by 1, 2 order by 1, 2;
