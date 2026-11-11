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
