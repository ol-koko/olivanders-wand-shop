// The Sorting Hat's question pool. w = house weights, each letter +1: G S R H. Empty = neutral.
// o: [ua, en, w]; r: reactions [ua, en]
const SortingQuestions = (() => {
const q = (id, cat, ua, en, o, r) => ({ id, cat, ua, en, o: o.map(([u, e, w]) => ({ u, e, w })), r });
return { POOL: [
// 1. Tastes and small things
q('t1', 1, 'Яке морозиво ти візьмеш?', 'Which ice cream are you getting?', [
  ['Солона карамель', 'Salted caramel', 'SR'], ['Фісташкове', 'Pistachio', 'RH'], ['Лимонний сорбет, що щипає язик', 'Lemon sorbet that bites back', 'G'], ['Три кульки різних, щоб спробувати всі', 'Three different scoops, to try them all', 'HG']],
  [['Запишу це в особисту справу.', 'That goes in your file.'], ['Морозиво багато що пояснює.', 'Ice cream explains a lot.']]),
q('t2', 1, 'Що зараз лежить у тебе в кишені?', 'What’s in your pocket right now?', [
  ['Чек, який давно треба викинути', 'A receipt you should’ve thrown out ages ago', 'H'], ['Ручка: раптом щось спаде на думку', 'A pen, in case a thought turns up', 'R'], ['Нічого, руки мають бути вільні', 'Nothing. Hands stay free', 'G'], ['Краще не питай', 'Better not ask', 'S']],
  [['Я й так бачу. Я ж на твоїй голові.', 'I can see it anyway. I’m on your head.'], ['Цікаво. Хоча шапки в кишенях не розбираються.', 'Interesting. Not that hats know much about pockets.']]),
q('t3', 1, 'Який звук тебе заспокоює?', 'What sound calms you down?', [
  ['Дощ по підвіконню', 'Rain on the windowsill', 'R'], ['Чайник, що закипає', 'A kettle coming to the boil', 'H'], ['Вогонь, що потріскує', 'A crackling fire', 'G'], ['Тиша, у якій нікому нічого від тебе не треба', 'Silence where nobody needs anything from you', 'S']],
  [['Тут, у Залі, такого не почуєш.', 'You won’t get that in this Hall.'], ['Гм. Я тисячу років слухаю лише дитячі думки.', 'Hm. I’ve had a thousand years of children’s thoughts.']]),
q('t4', 1, 'Телефон на 3%. Що робиш?', 'Your phone’s on 3%. Now what?', [
  ['Зарядка завжди зі мною', 'I always carry a charger', 'RH'], ['Знаходжу, в кого позичити', 'I find someone to borrow one from', 'S'], ['Хай сідає, подивимось, що буде', 'Let it die. Let’s see what happens', 'G'], ['Пишу своїм, що зникаю', 'I text my people that I’m vanishing', 'H']],
  [['Не знаю, що таке телефон, але відповідь промовиста.', 'I don’t know what a phone is, but that told me plenty.'], ['Три відсотки. Драматично.', 'Three percent. Dramatic.']]),
q('t5', 1, 'Лишився останній шматок піци.', 'One slice of pizza left.', [
  ['Ділю навпіл', 'I split it', 'H'], ['Він уже в мене в руці', 'It’s already in my hand', 'G'], ['Рахую, хто з’їв менше', 'I work out who’s had the least', 'R'], ['Чекаю, поки всім стане незручно', 'I wait until everyone gets awkward', 'S']],
  [['У Гоґвортсі такої проблеми немає. Там завжди є ще.', 'No such problem at Hogwarts. There’s always more.'], ['Я стільки разів бачив цю сцену. Без піци, звісно.', 'I’ve seen this scene many times. Without the pizza.']]),
q('t6', 1, 'Сніданок ідеального дня?', 'Breakfast on a perfect day?', [
  ['Те, що лишилось із вечора', 'Whatever’s left from last night', 'G'], ['Кава, і поки що все', 'Coffee, and that’s it for now', 'SR'], ['Велика сковорода на всіх', 'A huge pan for everyone', 'H'], ['Те, чого ще ніколи не пробували', 'Something I’ve never tried', 'GR']],
  [['Я не їм, але заздрю.', 'I don’t eat, but I do envy.'], ['Записано. Домовики будуть у курсі.', 'Noted. The kitchens will hear of it.']]),
q('t7', 1, 'Яке місце в поїзді?', 'Which seat on the train?', [
  ['Біля вікна', 'By the window', 'R'], ['Біля проходу, щоб вийти раніше за всіх', 'The aisle, to get off first', 'S'], ['Поруч із кимось цікавим', 'Next to someone interesting', 'GH'], ['Яке лишиться, мені все одно', 'Whichever’s free, I don’t mind', '']],
  [['Експрес їде довго. Встигнеш передумати.', 'It’s a long ride. You’ve got time to change your mind.'], ['Дивно, скільки всього вирішується в цьому купе.', 'You’d be surprised what gets decided in that carriage.']]),
q('t8', 1, 'Що грає у твоїх навушниках?', 'What’s playing in your headphones?', [
  ['Те саме, що й учора, і це добре', 'Same as yesterday, and that’s fine', 'H'], ['Те, чого ніхто не знає', 'Something nobody’s heard of', 'RS'], ['Щось дуже голосне', 'Something very loud', 'G'], ['Нічого. Вони для того, щоб не чіпали', 'Nothing. They’re so people leave me alone', 'S']],
  [['Я теж співаю. Раз на рік. Перед усіма.', 'I sing too. Once a year. In front of everyone.'], ['Гаразд, але моя пісня краща.', 'Fine, but my song is better.']]),
q('t9', 1, 'Ідеальна погода?', 'Perfect weather?', [
  ['Гроза, коли ти під дахом', 'A storm, from indoors', 'R'], ['Сонце, і нікуди не треба', 'Sunshine and nowhere to be', 'H'], ['Вітер, що збиває з ніг', 'Wind that knocks you off your feet', 'G'], ['Туман', 'Fog', 'S']],
  [['Глянь угору. Стеля в нас теж має настрій.', 'Look up. Our ceiling has moods too.'], ['Шотландія тебе розчарує. Або ні.', 'Scotland will disappoint you. Or won’t.']]),
q('t10', 1, 'Скільки у тебе непрочитаних повідомлень?', 'How many unread messages do you have?', [
  ['Нуль. Завжди', 'Zero. Always', 'RH'], ['Три тисячі, і я спокійно сплю', 'Three thousand, and I sleep fine', 'G'], ['Прочитані всі, відповім, коли буде що сказати', 'I’ve read them all. I’ll reply when I’ve something to say', 'S'], ['Не знаю, я туди не заглядаю', 'No idea, I never look', '']],
  [['Сови обурені.', 'The owls are outraged.'], ['Зручно. Мені ніхто не пише.', 'Must be nice. Nobody writes to me.']]),
q('t11', 1, 'Яке печиво забереш із банки?', 'Which biscuit are you taking from the jar?', [
  ['Найбільше', 'The biggest', 'G'], ['Те, якого ніхто не помітить', 'The one nobody will miss', 'S'], ['Те, що лишилось від бабусі', 'The one Grandma made', 'H'], ['Те, що має дивний присмак: треба розгадати', 'The one that tastes odd. I need to work it out', 'R']],
  [['Банка все бачить. І я теж.', 'The jar sees everything. So do I.'], ['Кажуть, у цьому вся людина.', 'They say that’s the whole person, right there.']]),
q('t12', 1, 'Яка твоя кружка?', 'What’s your mug like?', [
  ['Улюблена, зі сколом', 'A favourite, with a chip in it', 'H'], ['Будь-яка чиста', 'Any clean one', 'G'], ['Та, яку не чіпає ніхто інший', 'The one nobody else dares touch', 'S'], ['З формулою, якої я вже не розумію', 'With a formula I no longer understand', 'R']],
  [['Я теж старий і з латками. Розумію.', 'I’m old and patched too. I get it.'], ['Про людей багато каже посуд.', 'Crockery says a lot about people.']]),
q('t13', 1, 'Довга черга, поспішати нікуди.', 'A long queue, and no rush.', [
  ['Розмовляю із сусідом', 'I chat to whoever’s next to me', 'HG'], ['Читаю все, що написано на стінах', 'I read everything on the walls', 'R'], ['Шукаю, де коротша', 'I look for a shorter one', 'S'], ['Іду геть. Не сьогодні', 'I leave. Not today', 'G']],
  [['Ти вже стоїш у черзі. До мене.', 'You’ve already queued. For me.'], ['Перші курси стояли гірше.', 'I’ve seen first-years do worse.']]),

// 2. Situations with no right answer
q('s1', 2, 'Ти на вечірці, де нікого не знаєш.', 'You’re at a party where you know nobody.', [
  ['Знайомлюсь із господарем', 'I go and meet the host', 'S'], ['Шукаю найцікавішу книжку на полиці', 'I look for the best book on the shelf', 'R'], ['Допомагаю на кухні', 'I help in the kitchen', 'H'], ['Пропоную всім гру', 'I get everyone playing a game', 'G']],
  [['За столами сьогодні те саме.', 'The tables tonight are much the same.'], ['Цікаво, хто в цій історії вийшов першим.', 'I wonder who left first in this story.']]),
q('s2', 2, 'Друг просить збрехати заради нього.', 'A friend asks you to lie for them.', [
  ['Брешу, але потім усе йому скажу', 'I lie, then tell them what I think', 'HG'], ['Брешу, і красиво', 'I lie, and beautifully', 'S'], ['Відмовляюсь, зате придумаю кращий план', 'I say no, and come up with a better plan', 'R']],
  [['Я не суджу. Я лише сортую.', 'I don’t judge. I just sort.'], ['У цьому замку таких друзів повно.', 'This castle is full of friends like that.']]),
q('s3', 2, 'На вулиці лежить гаманець.', 'There’s a wallet on the pavement.', [
  ['Шукаю власника, хоч би й цілий день', 'I look for the owner, even if it takes all day', 'H'], ['Дивлюсь, що в ньому можна дізнатись', 'I see what I can learn from it', 'RS'], ['Кричу на всю вулицю: «Чий?»', 'I shout down the street: “Whose is this?”', 'G'], ['Проходжу повз: раптом це пастка', 'I walk past. Could be a trap', '']],
  [['А всередині, звісно, нічого цікавого.', 'And nothing interesting inside, of course.'], ['Я мовчатиму про це.', 'I’ll keep that to myself.']]),
q('s4', 2, 'Усі в кімнаті помиляються. Крім тебе.', 'Everyone in the room is wrong. Except you.', [
  ['Кажу вголос', 'I say so', 'G'], ['Показую, де це написано', 'I show them where it’s written', 'R'], ['Мовчу, поки це мені вигідно', 'I keep quiet while it suits me', 'S'], ['Тихо кажу одній людині, щоб не ніяковіла', 'I quietly tell one person, to spare them', 'H']],
  [['А якщо помиляєшся саме ти?', 'And if you’re the one who’s wrong?'], ['Знайоме відчуття. Я ж завжди маю рацію.', 'I know the feeling. I’m always right.']]),
q('s5', 2, 'Ти запізнюєшся, а хтось просить допомоги.', 'You’re running late and someone asks for help.', [
  ['Допомагаю. Запізнюсь, то й що', 'I help. So I’m late', 'HG'], ['Швидко кажу, кого покликати', 'I tell them who to call, fast', 'R'], ['Обіцяю повернутись', 'I promise to come back', 'S']],
  [['І ти таки повернешся?', 'And will you come back?'], ['Запізнення в Гоґвортсі коштують балів. Просто кажу.', 'Being late costs points here. Just saying.']]),
q('s6', 2, 'Команда сперечається вже годину.', 'The team’s been arguing for an hour.', [
  ['Вирішую, а далі якось буде', 'I decide, and we’ll sort it out later', 'GS'], ['Малюю схему', 'I draw a diagram', 'R'], ['Приношу всім чай', 'I bring everyone tea', 'H'], ['Чекаю, хто втомиться першим', 'I wait to see who tires first', 'S']],
  [['Чотири засновники теж так починали.', 'The four founders started the same way.'], ['Одна година? Шановна людино, я чув тисячолітні суперечки.', 'An hour? I’ve heard arguments last a thousand years.']]),
q('s7', 2, 'Ти випадково чуєш чужий секрет.', 'You overhear someone’s secret by accident.', [
  ['Забуваю', 'I forget it', 'H'], ['Запам’ятовую, раптом знадобиться', 'I keep it, just in case', 'S'], ['Кажу людині, що я це чую', 'I tell them I heard', 'G'], ['Перевіряю, чи це взагалі правда', 'I check whether it’s even true', 'R']],
  [['Я знаю їх сотні. Ніхто не питає.', 'I know hundreds. Nobody asks.'], ['Забудеш? Ну-ну.', 'You’ll forget? Sure.']]),
q('s8', 2, 'Правила гри явно дурні.', 'The rules of the game are plainly stupid.', [
  ['Граю. Правила є правила', 'I play. Rules are rules', 'H'], ['Знаходжу в них шпарину', 'I find the loophole', 'SR'], ['Кажу всім, що вони дурні', 'I tell everyone they’re stupid', 'G'], ['Пропоную кращі', 'I suggest better ones', 'R']],
  [['Спробуй-но почитати статут школи.', 'Wait till you read the school rules.'], ['Правила тут писали дуже давно. І дуже дивні люди.', 'These rules were written long ago, by very odd people.']]),
q('s9', 2, 'Завтра екзамен, а сьогодні кличуть на пригоду.', 'Exam tomorrow, and tonight someone invites you on an adventure.', [
  ['Іду. Екзамен якось буде', 'I go. The exam will sort itself out', 'G'], ['Беру конспект із собою', 'I bring my notes along', 'RH'], ['Вчу, а пригоду переношу на вихідні', 'I study, and move the adventure to the weekend', 'H'], ['Дізнаюсь, хто перевіряє екзамен', 'I find out who’s marking the exam', 'S']],
  [['Деякі викладачі це прочитають. Жартую. Мабуть.', 'Some teachers will read this. Kidding. Probably.'], ['І такі знаходились щороку.', 'There’s one every year.']]),
q('s10', 2, 'Хтось видав твою ідею за свою.', 'Someone passes off your idea as theirs.', [
  ['Кажу про це при всіх', 'I call it out in front of everyone', 'G'], ['Придумую кращу', 'I come up with a better one', 'R'], ['Хай. Ідей вистачить', 'Fine. I’ve got more', 'H'], ['Я запам’ятаю. Надовго', 'I’ll remember. For a long time', 'S']],
  [['Оце «надовго» в людей буває різним.', 'People’s “long time” varies a lot.'], ['Мої пісні теж цитують без дозволу.', 'People quote my songs without asking, too.']]),
q('s11', 2, 'Перший день у новому місці.', 'First day somewhere new.', [
  ['Вивчаю карту й розклад', 'I learn the map and timetable', 'RH'], ['Шукаю, хто тут усе вирішує', 'I find out who really runs the place', 'S'], ['Допомагаю тому, хто ще більш розгублений', 'I help whoever looks even more lost', 'H'], ['Іду туди, куди не можна. Просто подивитись', 'I go where I shouldn’t. Just to look', 'G']],
  [['Так, це якраз твій перший день.', 'Yes, this happens to be your first day.'], ['Сходи тут теж не сидять на місці. Удачі.', 'The stairs here won’t stay put either. Good luck.']]),
q('s12', 2, 'Можна дізнатись один факт про своє майбутнє.', 'You can learn one fact about your future.', [
  ['Так, і нікому не скажу', 'Yes, and I’ll tell no one', 'S'], ['Так, а потім перевірю', 'Yes, and then I’ll check it', 'R'], ['Тільки якщо там із близькими все гаразд', 'Only if it’s that my people are all right', 'H'], ['Ні, так нецікаво', 'No, that’s no fun', 'G']],
  [['Я знаю один факт. Зараз скажу.', 'I know one fact. I’m about to tell you.'], ['Викладачка віщування зраділа б.', 'The Divination teacher would be thrilled.']]),

// 3. Choices in the magical world
q('w1', 3, 'Тобі дають одне зілля.', 'You’re handed one potion.', [
  ['Удачі на один день', 'One day of luck', 'SG'], ['Розуміти будь-яку мову', 'Understanding any language', 'R'], ['Повернути один втрачений день', 'One lost day back', 'H'], ['Дякую, ні: я не п’ю, що дають незнайомці', 'No thanks. I don’t drink what strangers hand me', '']],
  [['Обережно, після нього болить голова. Моя теж.', 'Careful, it gives you a headache. Mine too.'], ['Я б теж обрав. Але я капелюх.', 'I’d pick that too. But I’m a hat.']]),
q('w2', 3, 'У кінці коридору четверо дверей.', 'Four doors at the end of the corridor.', [
  ['Ті, за якими щось гуде', 'The one that’s humming', 'G'], ['Ті, що спершу ставлять запитання', 'The one that asks you a question first', 'R'], ['Ті, з-під яких пахне випічкою', 'The one that smells of baking', 'H'], ['Ті, що без ручки', 'The one with no handle', 'S']],
  [['Одні з них ведуть на кухню. Кажу лише це.', 'One of them leads to the kitchens. That’s all I’ll say.'], ['Цього тижня їх могло бути й п’ятеро.', 'There might be five this week.']]),
q('w3', 3, 'Хто поїде з тобою до школи?', 'Who’s coming to school with you?', [
  ['Кіт, який усе вирішує сам', 'A cat with its own plans', 'SR'], ['Сова з поганим характером', 'A bad-tempered owl', 'G'], ['Жаба, яка постійно губиться', 'A toad that keeps getting lost', 'H'], ['Щур із сумнівною репутацією', 'A rat of doubtful reputation', 'GS']],
  [['Тільки перевір, чи це справді щур.', 'Do check that it’s really a rat.'], ['У спальнях уже тісно, але гаразд.', 'The dormitories are crowded, but fine.']]),
q('w4', 3, 'У лісі щось кличе тебе на ім’я.', 'Something in the forest is calling your name.', [
  ['Іду подивитись', 'I go and see', 'G'], ['Питаю, звідки воно знає', 'I ask how it knows', 'R'], ['Кличу когось із собою', 'I fetch someone to come with me', 'H'], ['Відгукуюсь чужим ім’ям', 'I answer to someone else’s name', 'S']],
  [['Тобі туди не можна. Але хіба це когось спиняло?', 'You’re not allowed in there. Not that it’s stopped anyone.'], ['Відповідь, яку лісу ще не давали.', 'The forest hasn’t heard that one before.']]),
q('w5', 3, 'Яке одне вміння залишиш собі?', 'Which one ability do you keep?', [
  ['Невидимість', 'Turning invisible', 'S'], ['Читати будь-яку думку', 'Reading any thought', 'RS'], ['Літати без мітли', 'Flying without a broom', 'G'], ['Лікувати дотиком', 'Healing with a touch', 'H']],
  [['Думки читати не так весело, повір мені.', 'Reading thoughts is less fun than it sounds. Trust me.'], ['Гм. Більшість обирає те саме й шкодує.', 'Hm. Most pick the same and regret it.']]),
q('w6', 3, 'Портрет у коридорі просить про послугу.', 'A portrait in the corridor asks you for a favour.', [
  ['Роблю', 'I do it', 'H'], ['А що я з цього матиму?', 'What’s in it for me?', 'S'], ['А хто ви взагалі такий?', 'And who are you, exactly?', 'R'], ['Спершу розказую йому жарт', 'I tell it a joke first', 'G']],
  [['Вони всі балакучі. Попереджаю.', 'They all talk. Fair warning.'], ['Цей портрет розкаже про це всьому поверху.', 'That portrait will tell the whole floor.']]),
q('w7', 3, 'На карті замку є зайва кімната.', 'The castle map shows one room too many.', [
  ['Іду туди сьогодні вночі', 'I go tonight', 'G'], ['Порівнюю зі старими картами', 'I compare it with older maps', 'R'], ['Ховаю карту, нікому ні слова', 'I hide the map and say nothing', 'S'], ['Кличу друзів', 'I call my friends', 'H']],
  [['Лише одна зайва? Тобі пощастило.', 'Only one? Lucky you.'], ['Я нічого про це не чув. Офіційно.', 'I’ve heard nothing of the sort. Officially.']]),
q('w8', 3, 'Який урок не пропустиш?', 'Which class won’t you skip?', [
  ['Рослини, що кусаються', 'The plants that bite', 'H'], ['Зілля', 'Potions', 'SR'], ['Астрономію, опівночі', 'Astronomy at midnight', 'R'], ['Польоти', 'Flying', 'G']],
  [['Розклад тебе ще здивує.', 'The timetable will surprise you.'], ['Рідкісний випадок: хтось хоче на урок.', 'A rare thing: someone wanting a lesson.']]),
q('w9', 3, 'На бенкеті зник твій десерт.', 'Your pudding has vanished at the feast.', [
  ['Іду на кухню', 'I go to the kitchens', 'H'], ['Підозрюю сусіда', 'I suspect my neighbour', 'S'], ['Згадую, хто виходив із Зали', 'I work out who left the Hall', 'R'], ['Беру з сусіднього столу', 'I take one from the next table', 'G']],
  [['У цьому замку винним зазвичай є полтергейст.', 'In this castle, it’s usually the poltergeist.'], ['Десерти тут вертаються. Зазвичай.', 'Puddings come back here. Usually.']]),
q('w10', 3, 'Привид усоте розказує, як загинув.', 'A ghost tells you, for the hundredth time, how they died.', [
  ['Слухаю, як уперше', 'I listen as if it’s the first time', 'H'], ['Знаходжу нестиковку', 'I spot an inconsistency', 'R'], ['Питаю, де тут таємний хід', 'I ask where the secret passage is', 'S'], ['Прошу показати, де це сталось', 'I ask to see where it happened', 'G']],
  [['Глянь, вони вже слухають.', 'Look, they’re listening already.'], ['Він і мені це розказував. Шістсот разів.', 'They’ve told me too. Six hundred times.']]),
q('w11', 3, 'Старе дзеркало покаже щось одне.', 'An old mirror will show you one thing.', [
  ['Дім', 'Home', 'H'], ['Те, чого я ще не знаю', 'What I don’t know yet', 'R'], ['Себе на вершині', 'Me, at the top', 'S'], ['Те, чого я боюсь', 'What I’m afraid of', 'G']],
  [['Не засиджуйся біля нього.', 'Don’t stay by it too long.'], ['Дзеркала брешуть рідше, ніж люди. І частіше, ніж я.', 'Mirrors lie less than people. And more than me.']]),
],
WISH: {
  yes: { ua: 'І останнє. Чи є факультет, куди ти дуже хочеш?', en: 'One last thing. Is there a house you really want?', skip: ['Хай вирішує Капелюх', 'Let the Hat decide'], go: ['Готово, вирішуй', 'Done, decide'] },
  no: { ua: 'А куди точно не хочу', en: 'A house I don’t want', hint: ['Торкнися факультету, куди не хочеш. Можна пропустити.', 'Tap the house you don’t want. You can skip this.'], back: ['Назад до бажання', 'Back to my wish'] },
  houses: { G: ['Ґрифіндор', 'Gryffindor'], S: ['Слизерин', 'Slytherin'], R: ['Рейвенклов', 'Ravenclaw'], H: ['Гафелпаф', 'Hufflepuff'] },
  got: [['Я тебе почув. І не сперечатимусь.', 'I heard you. And I won’t argue.'], ['Гаразд. Ти просиш, і воно справді в тобі є.', 'All right. You asked, and it really is in you.']],
  denied: [['Я тебе почув. Але ні.', 'I heard you… but no.'], ['Гарна спроба. Я капелюх, а не офіціант.', 'Nice try. I’m a hat, not a waiter.'], ['Ти цього хочеш. Але потрібне тобі інше.', 'It’s what you want. It’s not what you need.']],
  avoided: [['Добре, туди не піде. Цього разу.', 'Fine, not there. This time.']],
  overruled: [['Знаю, ти цього не просиш. Але саме тому.', 'I know you didn’t want this. That’s rather the point.']],
  decide: [['Нарешті хтось довіряє професіоналу.', 'At last, someone who trusts a professional.']],
  wand: [['Твоя паличка вже дещо мені розповіла.', 'Your wand’s already told me a thing or two.'], ['Я бачив, як ти махаєш. Це багато що пояснює.', 'I’ve seen how you wave it. That explains a lot.']],
},
SHARED: [
  ['Гм.', 'Hm.'], ['Так я й думав.', 'As I thought.'], ['Цього я не очікував.', 'Didn’t see that coming.'], ['Цікава голова.', 'An interesting head.'],
  ['Нічого собі. Гаразд.', 'Well then. All right.'], ['Не поспішай. Я вже вирішив, але не поспішай.', 'No rush. I’ve decided, but no rush.'], ['Ще одне запитання, і подивимось.', 'One more, and we’ll see.'], ['Тепле, тепле…', 'Getting warmer…'],
],
};
})();
if (typeof module !== 'undefined') module.exports = SortingQuestions;
