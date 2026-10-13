export const RELATIONSHIP = {
  startDate: "18.11.2024",
  anniversaryDate: "18.11.2026",
  days: 730,
  title: "MILANA — TWO YEARS",
  musicSrc: null, // Example: "./assets/audio/relationship.mp3" after adding the file
  voiceSrc: null, // Example: "./assets/audio/voice-note.mp3"
};

export const PHOTO_PIPELINE = {
  sourceTarget: "200–250",
  finalTarget: "110–150",
  categories: {
    "before-us": 8,
    beginning: 20,
    "one-month": 15,
    "three-months": 15,
    "half-year": 20,
    everyday: 40,
    places: 20,
    "first-year": 24,
    "second-year": 40,
    milana: 20,
    us: 40,
    "then-now": 4,
    finale: 10,
  },
};

const slot = (label, category, ratio = "4 / 5") => ({ label, category, ratio });

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

export const SCENES = [
  { id: "prologue", index: "00", kind: "prologue", kicker: "Для Миланы", title: "MILANA", subtitle: "TWO YEARS", copy: "История, которую можно пройти заново.", stage: 0.05 },
  { id: "before-us", index: "01", kind: "before", chapter: "ГЛАВА I", kicker: "До нас", title: "Два человека.", accent: "Одна будущая история.", copy: "Две разные жизни, которые ещё не знали, что однажды начнут звучать вместе.", slots: [slot("твоя фотография", "before-us"), slot("фотография Миланы", "before-us")] , stage: 0.1 },
  { id: "first-day", index: "02", kind: "date", chapter: "Тот самый день", title: "18.11.24", copy: "День, с которого «я» и «ты» начали понемногу превращаться в «мы»." , stage: 0.12 },
  { id: "beginning", index: "03", kind: "tunnel", chapter: "ГЛАВА II", kicker: "Первые недели", title: "Всё было", accent: "впервые.", copy: "Первые прогулки. Первые привычки. Первые фотографии, которые хотелось сохранять даже без причины.", slots: Array.from({ length: 8 }, (_, i) => slot(`кадр начала ${String(i + 1).padStart(2, "0")}`, "beginning")), stage: 0.17 },
  { id: "film", index: "04", kind: "film", kicker: "Первые месяцы", title: "Мы учились", accent: "быть рядом.", copy: "Кадр за кадром. Настоящие первые месяцы — без выдуманных подписей.", slots: Array.from({ length: 8 }, (_, i) => slot(`кадр плёнки ${i + 1}`, "beginning", "3 / 4")), stage: 0.21 },
  { id: "month", index: "05", kind: "month", kicker: "Первый месяц", title: "30", accent: "дней вместе", copy: "Первая дата, которую хотелось отметить.", slots: Array.from({ length: 4 }, (_, i) => slot(`фото первого месяца ${i + 1}`, "one-month")), stage: 0.27 },
  { id: "three-months", index: "06", kind: "glass", kicker: "Три месяца", title: "3 MONTHS", accent: "стало привычно быть рядом.", copy: "Большая фотография, стекло и спокойный свет. Личные факты добавим после архива.", slots: Array.from({ length: 4 }, (_, i) => slot(`фото трёх месяцев ${i + 1}`, "three-months")), stage: 0.34 },
  { id: "desk", index: "07", kind: "desk", kicker: "Архив вещей", title: "У каждой", accent: "свой вес.", copy: "Фотографии, записки, билет, конверт и маленькие предметы, которые хранят больше, чем кажется.", stage: 0.38 },
  { id: "everyday", index: "08", kind: "gallery", kicker: "Галерея случайных моментов", title: "Самые", accent: "обычные дни.", copy: "Сонные, кривые, смешные. Из них и складывается настоящая жизнь.", slots: Array.from({ length: 10 }, (_, i) => slot(`случайный момент ${i + 1}`, "everyday", i % 3 === 0 ? "16 / 10" : "4 / 5")), stage: 0.43 },
  { id: "timeline", index: "09", kind: "timeline", kicker: "Цветочная временная линия", title: "Каждая дата", accent: "оставляет лист.", copy: "Ветка растёт вместе с историей.", stage: 0.48 },
  { id: "half-year", index: "10", kind: "number", number: "182", kicker: "Полгода", title: "Бутон", accent: "раскрылся.", copy: "Первый большой bloom. Здесь будет главное фото этого периода.", slots: [slot("главная фотография полугода", "half-year", "4 / 5"), ...Array.from({ length: 4 }, (_, i) => slot(`фото полугода ${i + 1}`, "half-year"))], stage: 0.56 },
  { id: "places", index: "11", kind: "places", kicker: "Наши места", title: "Где мы", accent: "становились нами.", copy: "Стилизованная карта вместо чужого Google Maps iframe.", stage: 0.61 },
  { id: "messages", index: "12", kind: "messages", kicker: "Наши сообщения", title: "То, что", accent: "остаётся между строк.", copy: "Сюда попадут только реальные фрагменты вашей переписки.", stage: 0.65 },
  { id: "year", index: "13", kind: "number", number: "365", kicker: "Первый год", title: "Первый", accent: "настоящий пик.", copy: "Большая сцена года, фотографии между цифрами и больше раскрытых цветов.", slots: Array.from({ length: 6 }, (_, i) => slot(`фото первого года ${i + 1}`, "first-year")), stage: 0.7 },
  { id: "first-year", index: "14", kind: "gallery-stage", kicker: "Первый год в фотографиях", title: "Один год", accent: "не помещается в сетку.", copy: "Крупный кадр, коллаж, видео и тишина между ними.", slots: Array.from({ length: 6 }, (_, i) => slot(`сцена первого года ${i + 1}`, "first-year")), stage: 0.75 },
  { id: "second-year", index: "15", kind: "glass", kicker: "Второй год", title: "YEAR", accent: "TWO.", copy: "Меньше scrapbook. Больше пространства, чистых фотографий, ткани и света.", slots: Array.from({ length: 5 }, (_, i) => slot(`фото второго года ${i + 1}`, "second-year")), stage: 0.79 },
  { id: "events", index: "16", kind: "events", kicker: "Самые важные дни", title: "Несколько дней", accent: "которые остались.", copy: "6–10 событий получат собственные сцены, даты и настоящие рассказы.", slots: Array.from({ length: 4 }, (_, i) => slot(`важное событие ${i + 1}`, "second-year")), stage: 0.82 },
  { id: "you", index: "17", kind: "silk", kicker: "Глава «Ты»", title: "В тебе", accent: "целая вселенная.", copy: "Каждый портрет Миланы получит собственную композицию — цветы, ткань, стекло, свет.", slots: Array.from({ length: 6 }, (_, i) => slot(`портрет Миланы ${i + 1}`, "milana")), stage: 0.86 },
  { id: "love", index: "18", kind: "love", kicker: "Я люблю…", title: "Твой смех.", accent: "Твой взгляд.", copy: "10–15 настоящих мыслей, собранных из твоих слов.", statements: ["ТВОЙ СМЕХ", "ТВОЙ ВЗГЛЯД", "ТО, КАК ТЫ…", "ТВОЯ НЕПОХОЖЕСТЬ", "ТО, ЧТО ТЫ ОСТАЁШЬСЯ СОБОЙ"], stage: 0.88 },
  { id: "universe", index: "19", kind: "universe", kicker: "Наш мир", title: "Десятки кадров", accent: "в одном пространстве.", copy: "Большая галерея отношений: вертикальный corridor на телефоне, зал на desktop.", slots: Array.from({ length: 10 }, (_, i) => slot(`кадр нашего мира ${i + 1}`, "us")), stage: 0.91 },
  { id: "then-now", index: "20", kind: "compare", kicker: "Then / Now", title: "730 дней", accent: "между двумя кадрами.", copy: "Самая ранняя совместная фотография и одна из последних.", stage: 0.94 },
  { id: "voice", index: "21", kind: "voice", kicker: "Перед финалом", title: "Теперь просто", accent: "послушай меня.", copy: "Здесь появится настоящее голосовое сообщение. Визуальный шум уходит.", stage: 0.96 },
  { id: "days", index: "22", kind: "number", number: "730", kicker: "Два года", title: "дней", accent: "с тобой.", copy: "Полное цветение. Свет теплеет. Фотографии проходят между цветами.", slots: [slot("свежая совместная фотография", "finale", "4 / 5")], stage: 1 },
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
