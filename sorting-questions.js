// The Sorting Hat's question pool. w = house weights, each letter +1: G S R H. Empty = neutral.
// o: [ua, en, w, reaction only after this option]; r: reactions [ua, en] for any other option
const SortingQuestions = (() => {
const q = (id, cat, ua, en, o, r) => ({ id, cat, ua, en, o: o.map(([u, e, w, r]) => r ? { u, e, w, r } : { u, e, w }), r });
return { POOL: [
// 1. Tastes and small things
q('t1', 1, 'Яке морозиво?', 'Which ice cream?', [
  ['Солона карамель', 'Salted caramel', 'SR'], ['Фісташкове', 'Pistachio', 'RH'], ['Лимонний сорбет, що щипає язик', 'Lemon sorbet that bites back', 'G'], ['Три кульки різних, щоб спробувати всі', 'Three different scoops, to try them all', 'HG']],
  [['Записав у справу.', 'Noted in your file.'], ['Морозиво багато що пояснює.', 'Ice cream explains a lot.']]),
q('t2', 1, 'Що в тебе в кишені?', 'What’s in your pocket?', [
  ['Чек, який давно треба викинути', 'A receipt you should’ve thrown out ages ago', 'H'], ['Ручка: раптом щось спаде на думку', 'A pen, in case a thought turns up', 'R'], ['Нічого, руки мають бути вільні', 'Nothing. Hands stay free', 'G'], ['Краще не питай', 'Better not ask', 'S']],
  [['Я ж на твоїй голові. Бачу.', 'I’m on your head. I can see.'], ['Капелюхи в кишенях не тямлять.', 'Hats know nothing about pockets.']]),
q('t3', 1, 'Який звук тебе заспокоює?', 'Which sound calms you?', [
  ['Дощ по підвіконню', 'Rain on the windowsill', 'R'], ['Чайник, що закипає', 'A kettle coming to the boil', 'H'], ['Вогонь, що потріскує', 'A crackling fire', 'G'], ['Тиша, у якій нікому нічого від тебе не треба', 'Silence where nobody needs anything from you', 'S']],
  [['Тут такого не почуєш.', 'You won’t hear that in here.'], ['Гм. Тиша тут рідкість.', 'Hmm. Quiet is rare here.']]),
q('t4', 1, 'Телефон на трьох відсотках?', 'Phone on three percent?', [
  ['Зарядка завжди зі мною', 'I always carry a charger', 'RH'], ['Знаходжу, в кого позичити', 'I find someone to borrow one from', 'S'], ['Хай сідає, подивимось, що буде', 'Let it die. Let’s see what happens', 'G'], ['Пишу своїм, що зникаю', 'I text my people that I’m vanishing', 'H']],
  [['Не знаю, що таке телефон. Але промовисто.', 'I don’t know phones. Still telling.'], ['Три відсотки. Драматично.', 'Three percent. Dramatic.']]),
q('t5', 1, 'Останній шматок піци.', 'Last slice of pizza.', [
  ['Ділю навпіл', 'I split it', 'H'], ['Він уже в мене в руці', 'It’s already in my hand', 'G'], ['Рахую, хто з’їв менше', 'I work out who’s had the least', 'R'], ['Чекаю, поки всім стане незручно', 'I wait until everyone gets awkward', 'S']],
  [['У Гоґвортсі завжди є ще.', 'At Hogwarts, there’s always more.'], ['Бачив це тисячу разів. Без піци.', 'Seen it a thousand times. Minus pizza.']]),
q('t6', 1, 'Ідеальний сніданок?', 'Perfect breakfast?', [
  ['Те, що лишилось із вечора', 'Whatever’s left from last night', 'G'], ['Кава, і поки що все', 'Coffee, and that’s it for now', 'SR'], ['Велика сковорода на всіх', 'A huge pan for everyone', 'H'], ['Те, чого ще ніколи не пробували', 'Something I’ve never tried', 'GR']],
  [['Я не їм. Але заздрю.', 'I don’t eat. I do envy.'], ['Кухня про це дізнається.', 'The kitchens will hear of it.']]),
q('t7', 1, 'Твоє місце в поїзді?', 'Your seat on the train?', [
  ['Біля вікна', 'By the window', 'R'], ['Біля проходу, щоб вийти раніше за всіх', 'The aisle, to get off first', 'S'], ['Поруч із кимось цікавим', 'Next to someone interesting', 'GH'], ['Яке лишиться, мені все одно', 'Whichever’s free, I don’t mind', '']],
  [['Їхати довго. Встигнеш передумати.', 'Long ride. Time to change your mind.'], ['У тому поїзді багато що вирішується.', 'Much gets decided on that train.']]),
q('t8', 1, 'Що в навушниках?', 'What’s in your headphones?', [
  ['Те саме, що й учора, і це добре', 'Same as yesterday, and that’s fine', 'H'], ['Те, чого ніхто не знає', 'Something nobody’s heard of', 'RS'], ['Щось дуже голосне', 'Something very loud', 'G'], ['Нічого. Вони для того, щоб не чіпали', 'Nothing. They’re so people leave me alone', 'S']],
  [['Я теж співаю. Раз на рік.', 'I sing too. Once a year.'], ['Моя пісня краща.', 'My song is better.']]),
q('t9', 1, 'Ідеальна погода?', 'Perfect weather?', [
  ['Гроза, коли ти під дахом', 'A storm, from indoors', 'R'], ['Сонце, і нікуди не треба', 'Sunshine and nowhere to be', 'H'], ['Вітер, що збиває з ніг', 'Wind that knocks you off your feet', 'G'], ['Туман', 'Fog', 'S']],
  [['Глянь угору. Стеля теж має настрій.', 'Look up. Our ceiling has moods.'], ['Шотландія може розчарувати.', 'Scotland may disappoint you.']]),
q('t10', 1, 'Скільки непрочитаних?', 'Unread messages?', [
  ['Нуль. Завжди', 'Zero. Always', 'RH'], ['Три тисячі, і я спокійно сплю', 'Three thousand, and I sleep fine', 'G'], ['Прочитані всі, відповім, коли буде що сказати', 'I’ve read them all. I’ll reply when I’ve something to say', 'S'], ['Не знаю, я туди не заглядаю', 'No idea, I never look', '']],
  [['Сови обурені.', 'The owls are outraged.'], ['Мені ніхто не пише.', 'Nobody writes to me.']]),
q('t11', 1, 'Яке печиво з банки?', 'Which biscuit from the jar?', [
  ['Найбільше', 'The biggest', 'G'], ['Те, якого ніхто не помітить', 'The one nobody will miss', 'S'], ['Те, що спекла бабуся', 'The one Grandma made', 'H'], ['Те, що має дивний присмак: треба розгадати', 'The one that tastes odd. I need to work it out', 'R']],
  [['Банка бачила. І я теж.', 'The jar saw that. So did I.'], ['У цьому вся людина.', 'That’s the whole person, right there.']]),
q('t12', 1, 'Яка твоя кружка?', 'What’s your mug like?', [
  ['Улюблена, зі сколом', 'A favourite, with a chip in it', 'H'], ['Будь-яка чиста', 'Any clean one', 'G'], ['Та, яку не чіпає ніхто інший', 'The one nobody else dares touch', 'S'], ['З формулою, якої я вже не розумію', 'With a formula I no longer understand', 'R']],
  [['Посуд багато каже.', 'Crockery says a lot.'], ['Гарний вибір. Мабуть.', 'A fine choice. Probably.']]),
q('t13', 1, 'Довга черга. Поспішати нікуди.', 'A long queue. No rush.', [
  ['Розмовляю із сусідом', 'I chat to whoever’s next to me', 'HG'], ['Читаю все, що написано на стінах', 'I read everything on the walls', 'R'], ['Шукаю, де коротша', 'I look for a shorter one', 'S'], ['Іду геть. Не сьогодні', 'I leave. Not today', 'G']],
  [['Ти вже в черзі. До мене.', 'You’re already queuing. For me.'], ['Першокурсники стоять гірше.', 'First-years do worse.']]),

// 2. Situations with no right answer
q('s1', 2, 'Вечірка. Ти нікого не знаєш.', 'A party. You know nobody.', [
  ['Знайомлюсь із господарем', 'I go and meet the host', 'S'], ['Шукаю найцікавішу книжку на полиці', 'I look for the best book on the shelf', 'R'], ['Допомагаю на кухні', 'I help in the kitchen', 'H'], ['Пропоную всім гру', 'I get everyone playing a game', 'G']],
  [['Пів Зали почувається так само.', 'Half this Hall feels the same.'], ['Цікаво, хто пішов першим.', 'Who left first, I wonder?']]),
q('s2', 2, 'Друг просить збрехати за нього.', 'A friend asks you to lie.', [
  ['Брешу, але потім усе йому скажу', 'I lie, then tell them what I think', 'HG'], ['Брешу, і красиво', 'I lie, and beautifully', 'S'], ['Відмовляюсь, зате придумаю кращий план', 'I say no, and come up with a better plan', 'R']],
  [['Я не суджу. Я розподіляю.', 'I don’t judge. I sort.'], ['Тут таких друзів повно.', 'This castle is full of such friends.']]),
q('s3', 2, 'На тротуарі гаманець.', 'A wallet on the pavement.', [
  ['Шукаю власника, хоч би й цілий день', 'I look for the owner, even if it takes all day', 'H'], ['Дивлюсь, що в ньому можна дізнатись', 'I see what I can learn from it', 'RS'], ['Кричу на всю вулицю: «Чий?»', 'I shout down the street: “Whose is this?”', 'G'], ['Проходжу повз: раптом це пастка', 'I walk past. Could be a trap', '']],
  [['А всередині, звісно, порожньо.', 'Nothing inside, of course.'], ['Я про це мовчатиму.', 'I’ll keep that to myself.']]),
q('s4', 2, 'Усі помиляються. Крім тебе.', 'Everyone’s wrong. Except you.', [
  ['Кажу вголос', 'I say so', 'G'], ['Показую, де це написано', 'I show them where it’s written', 'R'], ['Мовчу, поки це мені вигідно', 'I keep quiet while it suits me', 'S'], ['Тихо кажу одній людині, щоб не ніяковіла', 'I quietly tell one person, to spare them', 'H']],
  [['А як помиляєшся ти?', 'And if it’s you who’s wrong?'], ['Знайоме відчуття.', 'I know the feeling.']]),
q('s5', 2, 'Ти запізнюєшся. Комусь потрібна допомога.', 'You’re late. Someone needs help.', [
  ['Допомагаю. Запізнюсь, то й що', 'I help. So I’m late', 'HG'], ['Швидко кажу, кого покликати', 'I tell them who to call, fast', 'R'], ['Обіцяю повернутись', 'I promise to come back', 'S', ['І ти таки повернешся?', 'And will you come back?']]],
  [['Тут за запізнення знімають бали. Просто кажу.', 'Lateness costs points here. Just saying.'], ['З часом у цьому замку все складно.', 'Time is tricky in this castle.']]),
q('s6', 2, 'Команда сперечається годину.', 'The team’s argued for an hour.', [
  ['Вирішую, а далі якось буде', 'I decide, and we’ll sort it out later', 'GS'], ['Малюю схему', 'I draw a diagram', 'R'], ['Приношу всім чай', 'I bring everyone tea', 'H'], ['Чекаю, хто втомиться першим', 'I wait to see who tires first', 'S']],
  [['Засновники теж так починали.', 'The founders started the same way.'], ['Годину? Я чув суперечки на тисячу років.', 'An hour? I’ve heard thousand-year arguments.']]),
q('s7', 2, 'Ти випадково чуєш секрет.', 'You overhear a secret.', [
  ['Забуваю', 'I forget it', 'H', ['Забудеш? Ну-ну.', 'You’ll forget? Sure.']], ['Запам’ятовую, раптом знадобиться', 'I keep it, just in case', 'S'], ['Кажу людині, що я це чую', 'I tell them I heard', 'G'], ['Перевіряю, чи це взагалі правда', 'I check whether it’s even true', 'R']],
  [['Я знаю їх сотні. Ніхто не питає.', 'I know hundreds. Nobody asks.'], ['Стіни тут теж слухають.', 'The walls here listen too.']]),
q('s8', 2, 'Правила явно дурні.', 'The rules are plainly silly.', [
  ['Граю. Правила є правила', 'I play. Rules are rules', 'H'], ['Знаходжу в них шпарину', 'I find the loophole', 'SR'], ['Кажу всім, що вони дурні', 'I tell everyone they’re stupid', 'G'], ['Пропоную кращі', 'I suggest better ones', 'R']],
  [['Почекай, ще статут школи прочитаєш.', 'Wait till you read the school rules.'], ['Старі правила, дивні люди.', 'Old rules, odd people.']]),
q('s9', 2, 'Завтра екзамен. Сьогодні пригода.', 'Exam tomorrow. Adventure tonight.', [
  ['Іду. Екзамен якось буде', 'I go. The exam will sort itself out', 'G'], ['Беру конспект із собою', 'I bring my notes along', 'RH'], ['Вчу, а пригоду переношу на вихідні', 'I study, and move the adventure to the weekend', 'H'], ['Дізнаюсь, хто перевіряє екзамен', 'I find out who’s marking the exam', 'S']],
  [['Викладачі можуть почути. Жартую.', 'Teachers might hear this. Kidding.'], ['Такі є щороку.', 'There’s one every year.']]),
q('s10', 2, 'Хтось привласнив твою ідею.', 'Someone steals your idea.', [
  ['Кажу про це при всіх', 'I call it out in front of everyone', 'G'], ['Придумую кращу', 'I come up with a better one', 'R'], ['Хай. Ідей вистачить', 'Fine. I’ve got more', 'H'], ['Я запам’ятаю. Надовго', 'I’ll remember. For a long time', 'S', ['«Надовго» в людей буває різним.', 'People’s “long time” varies.']]],
  [['Буває і з найкращими.', 'It happens to the best.'], ['Мої пісні теж цитують без дозволу.', 'People quote my songs too.']]),
q('s11', 2, 'Перший день у новому місці.', 'First day somewhere new.', [
  ['Вивчаю карту й розклад', 'I learn the map and timetable', 'RH'], ['Шукаю, хто тут усе вирішує', 'I find out who really runs the place', 'S'], ['Допомагаю тому, хто ще більш розгублений', 'I help whoever looks even more lost', 'H'], ['Іду туди, куди не можна. Просто подивитись', 'I go where I shouldn’t. Just to look', 'G']],
  [['Як-от сьогодні.', 'Like today, then.'], ['Обережно, сходи тут рухаються.', 'Mind the stairs. They move.']]),
q('s12', 2, 'Один факт про твоє майбутнє?', 'One fact about your future?', [
  ['Так, і нікому не скажу', 'Yes, and I’ll tell no one', 'S'], ['Так, а потім перевірю', 'Yes, and then I’ll check it', 'R'], ['Тільки якщо там із близькими все гаразд', 'Only if it’s that my people are all right', 'H'], ['Ні, так нецікаво', 'No, that’s no fun', 'G']],
  [['Я знаю один. Скоро почуєш.', 'I know one. You’ll hear it soon.'], ['Віщування тебе полюбить.', 'Divination would love you.']]),

// 3. Choices in the magical world
q('w1', 3, 'Обери одне зілля.', 'Pick one potion.', [
  ['Удачі на один день', 'One day of luck', 'SG'], ['Розуміти будь-яку мову', 'Understanding any language', 'R'], ['Повернути один втрачений день', 'One lost day back', 'H'], ['Дякую, ні: я не п’ю, що дають незнайомці', 'No thanks. I don’t drink what strangers hand me', '']],
  [['Попереджаю: від нього болить голова.', 'Fair warning: it gives headaches.'], ['Я б теж обрав. Але я капелюх.', 'I’d pick that too. But I’m a hat.']]),
q('w2', 3, 'Четверо дверей. Обирай.', 'Four doors. Choose.', [
  ['Ті, за якими щось гуде', 'The one that’s humming', 'G'], ['Ті, що спершу ставлять запитання', 'The one that asks you a question first', 'R'], ['Ті, з-під яких пахне випічкою', 'The one that smells of baking', 'H'], ['Ті, що без ручки', 'The one with no handle', 'S']],
  [['Одні ведуть на кухню. Більше не скажу.', 'One leads to the kitchens. That’s all.'], ['Наступного тижня їх може бути п\'ятеро.', 'Next week, there may be five.']]),
q('w3', 3, 'Хто поїде з тобою до школи?', 'Who’s coming to school with you?', [
  ['Кіт, який усе вирішує сам', 'A cat with its own plans', 'SR'], ['Сова з поганим характером', 'A bad-tempered owl', 'G'], ['Жаба, яка постійно губиться', 'A toad that keeps getting lost', 'H'], ['Щур із сумнівною репутацією', 'A rat of doubtful reputation', 'GS', ['Тільки перевір, чи це справді щур.', 'Do check it’s really a rat.']]],
  [['Улюбленці багато кажуть про людей.', 'Pets say a lot about people.'], ['У спальнях тісно. Гаразд.', 'Crowded dormitories. Fine.']]),
q('w4', 3, 'Ліс кличе тебе на ім\'я.', 'The forest calls your name.', [
  ['Іду подивитись', 'I go and see', 'G'], ['Питаю, звідки воно знає', 'I ask how it knows', 'R'], ['Кличу когось із собою', 'I fetch someone to come with me', 'H'], ['Відгукуюсь чужим ім’ям', 'I answer to someone else’s name', 'S']],
  [['Туди не можна. Хіба це когось спиняло?', 'Forbidden. Not that it stops anyone.'], ['Ліс такого не чекав.', 'The forest didn’t expect that.']]),
q('w5', 3, 'Залиш собі одне вміння.', 'Keep one ability.', [
  ['Невидимість', 'Turning invisible', 'S'], ['Читати будь-яку думку', 'Reading any thought', 'RS'], ['Літати без мітли', 'Flying without a broom', 'G'], ['Лікувати дотиком', 'Healing with a touch', 'H']],
  [['Сила личить не кожній голові.', 'Power suits some heads.'], ['Гм. Цікавий вибір.', 'Hmm. Interesting choice.']]),
q('w6', 3, 'Портрет просить про послугу.', 'A portrait asks a favour.', [
  ['Роблю', 'I do it', 'H'], ['А що я з цього матиму?', 'What’s in it for me?', 'S'], ['А хто ви взагалі такий?', 'And who are you, exactly?', 'R'], ['Спершу розказую йому жарт', 'I tell it a joke first', 'G']],
  [['Вони всі балакучі. Попереджаю.', 'They all talk. Fair warning.'], ['Увесь поверх дізнається.', 'The whole floor will know.']]),
q('w7', 3, 'На мапі зайва кімната.', 'The map shows a room too many.', [
  ['Іду туди сьогодні вночі', 'I go tonight', 'G'], ['Порівнюю зі старими картами', 'I compare it with older maps', 'R'], ['Ховаю карту, нікому ні слова', 'I hide the map and say nothing', 'S'], ['Кличу друзів', 'I call my friends', 'H']],
  [['Лише одна? Тобі пощастило.', 'Only one? Lucky you.'], ['Я нічого не чув. Офіційно.', 'I’ve heard nothing. Officially.']]),
q('w8', 3, 'Який урок не прогуляєш?', 'Which class won’t you skip?', [
  ['Рослини, що кусаються', 'The plants that bite', 'H'], ['Зілля', 'Potions', 'SR'], ['Астрономію, опівночі', 'Astronomy at midnight', 'R'], ['Польоти', 'Flying', 'G']],
  [['Розклад тебе ще здивує.', 'The timetable will surprise you.'], ['Хтось хоче на урок. Рідкість.', 'Someone wants a lesson. Rare.']]),
q('w9', 3, 'Твій десерт зник.', 'Your pudding vanished.', [
  ['Іду на кухню', 'I go to the kitchens', 'H'], ['Підозрюю сусіда', 'I suspect my neighbour', 'S'], ['Згадую, хто виходив із Зали', 'I work out who left the Hall', 'R'], ['Беру з сусіднього столу', 'I take one from the next table', 'G']],
  [['Зазвичай винен полтергейст.', 'Usually it’s the poltergeist.'], ['Десерти повертаються. Зазвичай.', 'Puddings come back. Usually.']]),
q('w10', 3, 'Привид усоте розповідає, як загинув.', 'A ghost tells you, again, how they died.', [
  ['Слухаю, як уперше', 'I listen as if it’s the first time', 'H'], ['Знаходжу нестиковку', 'I spot an inconsistency', 'R'], ['Питаю, де тут таємний хід', 'I ask where the secret passage is', 'S'], ['Прошу показати, де це сталось', 'I ask to see where it happened', 'G']],
  [['Глянь, вони вже слухають.', 'Look, they’re listening.'], ['Я чув її шістсот разів.', 'I’ve heard it six hundred times.']]),
q('w11', 3, 'Дзеркало покаже щось одне.', 'A mirror shows you one thing.', [
  ['Дім', 'Home', 'H'], ['Те, чого я ще не знаю', 'What I don’t know yet', 'R'], ['Себе на вершині', 'Me, at the top', 'S'], ['Те, чого я боюсь', 'What I’m afraid of', 'G']],
  [['Не затримуйся біля нього.', 'Don’t linger by it.'], ['Дзеркала брешуть рідше за людей.', 'Mirrors lie less than people.']]),
],
WISH: {
  yes: { ua: 'І останнє. Куди хочеш?', en: 'Last thing. A house you want?', skip: ['Хай вирішує Капелюх', 'Let the Hat decide'], go: ['Готово, вирішуй', 'Done, decide'] },
  no: { ua: 'А куди точно не хочу', en: 'A house I don’t want', hint: ['А куди точно ні?', 'Anywhere you’d rather not?'], back: ['Назад до бажання', 'Back to my wish'] },
  houses: { G: ['Ґрифіндор', 'Gryffindor'], S: ['Слизерин', 'Slytherin'], R: ['Рейвенклов', 'Ravenclaw'], H: ['Гафелпаф', 'Hufflepuff'] },
  got: [['Я почув. Хай буде так.', 'I heard you. Granted.'], ['Ти просиш. І це в тобі є.', 'You asked. And it’s in you.']],
  denied: [['Я почув. Але ні.', 'I heard you… but no.'], ['Я капелюх, а не офіціант.', 'I’m a hat, not a waiter.'], ['Не те, що хочеш. Те, що треба.', 'Not what you want. What you need.']],
  avoided: [['Добре. Не туди.', 'Fine. Not there.']],
  overruled: [['Знаю. Саме тому.', 'I know. That’s the point.']],
  build: [['Так… я знаю куди.', 'Yes… I know where.'], ['Жодних сумнівів.', 'No doubt about it.']],
  decide: [['Нарешті довіра професіоналу.', 'Trusting a professional. Finally.']],
  wand: [['Твоя паличка вже дещо розповіла.', 'Your wand’s told me plenty.'], ['Я бачив твій змах. Промовисто.', 'I saw how you wave. Telling.']],
},
SHARED: [['Гм.', 'Hmm.'], ['Так я й думав.', 'As I thought.'], ['Не очікував.', 'Didn’t see that coming.'], ['Цікава голова.', 'Interesting head.'], ['Ну що ж.', 'Well then.'], ['Не поспішай. Я вже вирішив.', 'No rush. I’ve decided anyway.'], ['Ще одне.', 'One more.'], ['Тепліше…', 'Getting warmer…']],
};
})();
if (typeof module !== 'undefined') module.exports = SortingQuestions;
