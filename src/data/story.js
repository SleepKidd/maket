export const RELATIONSHIP = {
  startDate: "18.11.2024",
  anniversaryDate: "18.11.2026",
  days: 730,
  title: "MILANA — TWO YEARS",
};

export const PHOTO_PIPELINE = {
  sourceTarget: "ровно 15",
  finalTarget: "15",
  uniquePhotos: 15,
  displayInstances: "35–45",
  categories: {
    "before-us": 2,
    beginning: 3,
    "one-month": 1,
    everyday: 3,
    places: 1,
    "half-year": 1,
    "first-year": 1,
    milana: 1,
    us: 1,
    finale: 1,
  },
};

const photo = (id, label, category, ratio = "4 / 5") => ({
  id,
  label,
  category,
  ratio,
  src: `./assets/photos/${id}.webp`,
});

const P = {
  beforeA: photo("before-01", "твоя фотография", "before-us"),
  beforeB: photo("before-02", "портрет Миланы", "before-us"),
  start: photo("beginning-01", "самый важный кадр начала", "beginning", "4 / 5"),
  beginningA: photo("beginning-02", "кадр начала 01", "beginning", "3 / 4"),
  beginningB: photo("beginning-03", "кадр начала 02", "beginning", "4 / 5"),
  monthA: photo("month-01", "фото первого месяца 01", "one-month"),
  everydayA: photo("everyday-01", "случайный момент 01", "everyday", "16 / 10"),
  everydayB: photo("everyday-02", "случайный момент 02", "everyday"),
  everydayC: photo("everyday-03", "случайный момент 03", "everyday", "3 / 4"),
  place: photo("places-01", "фотография нашего места", "places", "16 / 10"),
  halfYear: photo("half-year-01", "главная фотография полугода", "half-year", "4 / 5"),
  year: photo("first-year-01", "главный кадр первого года", "first-year", "4 / 5"),
  milana: photo("milana-01", "портрет Миланы", "milana", "3 / 4"),
  us: photo("us-01", "один из ваших главных кадров", "us", "4 / 5"),
  final: photo("finale-01", "свежая совместная фотография", "finale", "4 / 5"),
};

export const PHOTO_LIBRARY = Object.values(P);

export const SECRETS = [
  { id: "date-mark", label: "маленькая дата", text: "Здесь будет дата, которую вы узнаете сразу. Одно короткое воспоминание — без лишних слов." },
  { id: "petal", label: "лепесток", text: "Этот лепесток хранит маленькую деталь, которую нельзя потерять среди больших событий." },
  { id: "note", label: "рукописная отметка", text: "Здесь появится фраза, написанная от руки. Та самая, которую хочется перечитывать." },
  { id: "place", label: "точка на карте", text: "Одно место, одна дата и история, которую нельзя заменить красивым шаблонным текстом." },
  { id: "frame", label: "край фотографии", text: "Поверни кадр — за ним спрятан второй слой этой истории." },
  { id: "flower", label: "бутон", text: "Он раскроется только здесь. Не потому что это игра, а потому что некоторые вещи замечаешь не сразу." },
  { id: "message", label: "сообщение", text: "Сюда попадёт фрагмент переписки, который важен именно вам двоим." },
  { id: "object", label: "предмет", text: "Маленькая вещь из вашей жизни. Такие детали иногда помнят больше, чем большие даты." },
];

export const LETTER_MOMENTS = [
  { id: "before-us", number: "01", title: "До того, как появилось «мы»", text: "Короткий фрагмент письма о двух отдельных жизнях — добавится из твоих настоящих слов." },
  { id: "first-day", number: "02", title: "В тот самый день", text: "Здесь будет одна честная мысль, которую хочется оставить рядом с датой." },
  { id: "month", number: "03", title: "Первые тридцать дней", text: "Не длинное признание — маленькая деталь, которую помнишь до сих пор." },
  { id: "everyday", number: "04", title: "Самые обычные дни", text: "Письмо без пафоса: про смешное, сонное, случайное и настоящее." },
  { id: "half-year", number: "05", title: "Когда стало привычно быть рядом", text: "Здесь появится фрагмент о моменте, когда отношения начали ощущаться домом." },
  { id: "you", number: "06", title: "Про тебя", text: "Несколько строк, которые не должны звучать как шаблон. Только твои формулировки." },
  { id: "voice", number: "07", title: "Перед тем, как сказать вслух", text: "Последняя короткая записка перед голосовым — без декора ради декора." },
];

export const SCENES = [
  { id: "prologue", index: "00", kind: "prologue", kicker: "Для Миланы", title: "MILANA", subtitle: "TWO YEARS", copy: "История, которую можно пройти заново.", stage: 0.05 },
  { id: "before-us", index: "01", kind: "before", chapter: "ГЛАВА I", kicker: "До нас", title: "Два человека.", accent: "Одна будущая история.", copy: "Две разные жизни, которые ещё не знали, что однажды начнут звучать вместе.", slots: [P.beforeA, P.beforeB], stage: 0.1 },
  { id: "first-day", index: "02", kind: "date", chapter: "Тот самый день", title: "18.11.24", copy: "День, с которого «я» и «ты» начали понемногу превращаться в «мы»." , stage: 0.12 },
  { id: "beginning", index: "03", kind: "tunnel", chapter: "ГЛАВА II", kicker: "Первые недели", title: "Всё было", accent: "впервые.", copy: "Первые прогулки. Первые привычки. Первые фотографии, которые хотелось сохранять даже без причины.", slots: [P.start, P.beginningA, P.beginningB], stage: 0.17 },
  { id: "film", index: "04", kind: "film", kicker: "Первые месяцы", title: "Мы учились", accent: "быть рядом.", copy: "Кадр за кадром. Те же фотографии получают другой ритм — как память, которая возвращается фрагментами.", slots: [P.beginningA, P.beginningB, P.start, P.beginningA], stage: 0.21 },
  { id: "month", index: "05", kind: "month", kicker: "Первый месяц", title: "30", accent: "дней вместе", copy: "Первая дата, которую хотелось отметить.", slots: [P.monthA, P.beginningB, P.beginningA], stage: 0.27 },
  { id: "three-months", index: "06", kind: "glass", kicker: "Три месяца", title: "3 MONTHS", accent: "стало привычно быть рядом.", copy: "Большая фотография, стекло и спокойный свет. Личные факты добавим после архива.", slots: [P.monthA, P.beginningB, P.beginningA], stage: 0.34 },
  { id: "desk", index: "07", kind: "desk", kicker: "Архив вещей", title: "У каждой", accent: "свой вес.", copy: "Фотографии, записки, билет, конверт и маленькие предметы, которые хранят больше, чем кажется.", stage: 0.38 },
  { id: "everyday", index: "08", kind: "gallery", kicker: "Галерея случайных моментов", title: "Самые", accent: "обычные дни.", copy: "Сонные, кривые, смешные. Из них и складывается настоящая жизнь.", slots: [P.everydayA, P.everydayB, P.everydayC], stage: 0.43 },
  { id: "timeline", index: "09", kind: "timeline", kicker: "Цветочная временная линия", title: "Каждая дата", accent: "оставляет лист.", copy: "Ветка растёт вместе с историей.", stage: 0.48 },
  { id: "half-year", index: "10", kind: "number", number: "182", kicker: "Полгода", title: "Бутон", accent: "раскрылся.", copy: "Первый большой bloom. Здесь будет главное фото этого периода.", slots: [P.halfYear, P.monthA], stage: 0.56 },
  { id: "places", index: "11", kind: "places", kicker: "Наши места", title: "Где мы", accent: "становились нами.", copy: "Стилизованная карта вместо чужого Google Maps iframe.", stage: 0.61 },
  { id: "messages", index: "12", kind: "messages", kicker: "Наши сообщения", title: "То, что", accent: "остаётся между строк.", copy: "Сюда попадут только реальные фрагменты вашей переписки.", stage: 0.65 },
  { id: "year", index: "13", kind: "number", number: "365", kicker: "Первый год", title: "Первый", accent: "настоящий пик.", copy: "Большая сцена года, фотографии между цифрами и больше раскрытых цветов.", slots: [P.year, P.us], stage: 0.7 },
  { id: "first-year", index: "14", kind: "gallery-stage", kicker: "Первый год в фотографиях", title: "Один год", accent: "не помещается в сетку.", copy: "Крупный кадр, коллаж, видео и тишина между ними.", slots: [P.year, P.everydayA, P.us, P.final], stage: 0.75 },
  { id: "second-year", index: "15", kind: "glass", kicker: "Второй год", title: "YEAR", accent: "TWO.", copy: "Меньше scrapbook. Больше пространства, чистых фотографий, ткани и света.", slots: [P.us, P.final, P.halfYear], stage: 0.79 },
  { id: "events", index: "16", kind: "events", kicker: "Самые важные дни", title: "Несколько дней", accent: "которые остались.", copy: "Несколько событий получат собственные даты и настоящие рассказы.", slots: [P.place, P.everydayB, P.final], stage: 0.82 },
  { id: "you", index: "17", kind: "silk", kicker: "Глава «Ты»", title: "В тебе", accent: "целая вселенная.", copy: "Один сильный портрет получает несколько разных световых композиций — цветы, ткань, стекло, отражение.", slots: [P.milana, P.milana, P.milana], stage: 0.86 },
  { id: "love", index: "18", kind: "love", kicker: "Я люблю…", title: "Твой смех.", accent: "Твой взгляд.", copy: "10–15 настоящих мыслей, собранных из твоих слов.", statements: ["ТВОЙ СМЕХ", "ТВОЙ ВЗГЛЯД", "ТО, КАК ТЫ…", "ТВОЯ НЕПОХОЖЕСТЬ", "ТО, ЧТО ТЫ ОСТАЁШЬСЯ СОБОЙ"], stage: 0.88 },
  { id: "universe", index: "19", kind: "universe", kicker: "Наш мир", title: "Десятки кадров", accent: "в одном пространстве.", copy: "Большая галерея отношений: четыре настоящих кадра повторяются на разных глубинах, как память, а не как каталог.", slots: [P.us, P.beforeA, P.beginningB, P.final], stage: 0.91 },
  { id: "then-now", index: "20", kind: "compare", kicker: "Then / Now", title: "730 дней", accent: "между двумя кадрами.", copy: "Самая ранняя совместная фотография и одна из последних.", stage: 0.94 },
  { id: "voice", index: "21", kind: "voice", kicker: "Перед финалом", title: "Теперь просто", accent: "послушай меня.", copy: "Здесь появится настоящее голосовое сообщение. Визуальный шум уходит.", stage: 0.96 },
  { id: "days", index: "22", kind: "number", number: "730", kicker: "Два года", title: "дней", accent: "с тобой.", copy: "Полное цветение. Свет теплеет. Один свежий кадр становится центром всей композиции.", slots: [P.final], stage: 1 },
  { id: "letter", index: "23", kind: "letter", kicker: "Письмо", title: "Милана,", copy: "Здесь будет настоящее письмо на 700–1500 слов — только из ваших фактов, голосов и деталей.", stage: 1 },
  { id: "finale", index: "24", kind: "finale", kicker: "Финал", title: "Я люблю тебя.", accent: "И это только первые два года.", copy: "Композиция из начала возвращается полностью раскрытой.", stage: 1 },
  { id: "secret", index: "25", kind: "secret", kicker: "ONE MORE THING", title: "Непоказанное", accent: "останется здесь.", copy: "Секретный эпилог откроется, когда будут найдены все скрытые детали.", stage: 1 },
];

export const MESSAGE_SLOTS = [
  "реальный фрагмент переписки 01",
  "реальный фрагмент переписки 02",
  "реальный фрагмент переписки 03",
  "реальный фрагмент переписки 04",
  "реальный фрагмент переписки 05",
  "реальный фрагмент переписки 06",
];

export const PLACE_SLOTS = [
  "место №1 — первая прогулка",
  "место №2 — важный день",
  "место №3 — ваш маршрут",
  "место №4 — маленький мир",
  "место №5 — однажды потом",
];
