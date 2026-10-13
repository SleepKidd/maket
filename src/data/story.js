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
  { id: "prologue", index: "00", kind: "prologue", kicker: "Для Миланы", title: "MILANA", subtitle: "TWO YEARS", copy: "Два года. Тысячи мгновений. Одна история — наша.", stage: 0.05 },
  { id: "before-us", index: "01", kind: "before", chapter: "ГЛАВА I", kicker: "До нас", title: "Два человека.", accent: "Одна будущая история.", copy: "Когда-то были просто ты и я. А потом появилась история, которую хочется беречь.", slots: [slot("твоя фотография", "before-us"), slot("фотография Миланы", "before-us")] , stage: 0.1 },
  { id: "first-day", index: "02", kind: "date", chapter: "Тот самый день", title: "18.11.24", copy: "18 ноября — дата, с которой началась наша история." , stage: 0.12 },
  { id: "beginning", index: "03", kind: "tunnel", chapter: "ГЛАВА II", kicker: "Первые недели", title: "Всё было", accent: "впервые.", copy: "Как много всего было впервые. И как быстро обычные моменты стали дорогими.", slots: Array.from({ length: 8 }, (_, i) => slot(`кадр начала ${String(i + 1).padStart(2, "0")}`, "beginning")), stage: 0.17 },
  { id: "film", index: "04", kind: "film", kicker: "Первые месяцы", title: "Мы учились", accent: "быть рядом.", copy: "Каждая фотография может вернуть нас в мгновение, которое уже не повторится — и останется с нами.", slots: Array.from({ length: 8 }, (_, i) => slot(`кадр плёнки ${i + 1}`, "beginning", "3 / 4")), stage: 0.21 },
  { id: "month", index: "05", kind: "month", kicker: "Первый месяц", title: "30", accent: "дней вместе", copy: "Первый маленький праздник нашей большой истории.", slots: Array.from({ length: 4 }, (_, i) => slot(`фото первого месяца ${i + 1}`, "one-month")), stage: 0.27 },
  { id: "three-months", index: "06", kind: "glass", kicker: "Три месяца", title: "3 MONTHS", accent: "стало привычно быть рядом.", copy: "Время шло, а воспоминаний становилось всё больше. И всё больше было нас.", slots: Array.from({ length: 4 }, (_, i) => slot(`фото трёх месяцев ${i + 1}`, "three-months")), stage: 0.34 },
  { id: "desk", index: "07", kind: "desk", kicker: "Архив вещей", title: "У каждой", accent: "свой вес.", copy: "Маленькие вещи иногда хранят целые истории.", stage: 0.38 },
  { id: "everyday", index: "08", kind: "gallery", kicker: "Галерея случайных моментов", title: "Самые", accent: "обычные дни.", copy: "Не только красивые кадры. Самое ценное часто скрыто в обычном дне.", slots: Array.from({ length: 10 }, (_, i) => slot(`случайный момент ${i + 1}`, "everyday", i % 3 === 0 ? "16 / 10" : "4 / 5")), stage: 0.43 },
  { id: "timeline", index: "09", kind: "timeline", kicker: "Цветочная временная линия", title: "Каждая дата", accent: "оставляет лист.", copy: "Месяц за месяцем наша история становилась длиннее. И прекраснее.", stage: 0.48 },
  { id: "half-year", index: "10", kind: "number", number: "181", kicker: "Полгода", title: "Полгода", accent: "рядом.", copy: "Полгода рядом. И ещё столько всего впереди.", slots: [slot("главная фотография полугода", "half-year", "4 / 5"), ...Array.from({ length: 4 }, (_, i) => slot(`фото полугода ${i + 1}`, "half-year"))], stage: 0.56 },
  { id: "places", index: "11", kind: "places", kicker: "Наши места", title: "Где мы", accent: "становились нами.", copy: "У важных мест всегда есть своя история. Особенно когда в ней есть ты.", stage: 0.61 },
  { id: "messages", index: "12", kind: "messages", kicker: "Наши сообщения", title: "То, что", accent: "остаётся между строк.", copy: "Некоторые слова хочется хранить отдельно от остальных.", stage: 0.65 },
  { id: "year", index: "13", kind: "number", number: "365", kicker: "Первый год", title: "Первый", accent: "настоящий пик.", copy: "Целый год. Целый мир воспоминаний, который не уместить в одну фотографию.", slots: Array.from({ length: 6 }, (_, i) => slot(`фото первого года ${i + 1}`, "first-year")), stage: 0.7 },
  { id: "first-year", index: "14", kind: "gallery-stage", kicker: "Первый год в фотографиях", title: "Один год", accent: "не уместить в кадр.", copy: "Можно пересматривать фотографии тысячу раз — и каждый раз улыбаться.", slots: Array.from({ length: 6 }, (_, i) => slot(`сцена первого года ${i + 1}`, "first-year")), stage: 0.75 },
  { id: "second-year", index: "15", kind: "glass", kicker: "Второй год", title: "YEAR", accent: "TWO.", copy: "Время шло, а наша история не переставала меняться и расти.", slots: Array.from({ length: 5 }, (_, i) => slot(`фото второго года ${i + 1}`, "second-year")), stage: 0.79 },
  { id: "events", index: "16", kind: "events", kicker: "Самые важные дни", title: "Несколько дней", accent: "которые остались.", copy: "Есть дни, к которым хочется мысленно возвращаться снова и снова.", slots: Array.from({ length: 4 }, (_, i) => slot(`важное событие ${i + 1}`, "second-year")), stage: 0.82 },
  { id: "you", index: "17", kind: "silk", kicker: "Глава «Ты»", title: "В тебе", accent: "целая вселенная.", copy: "Сколько бы ни было фотографий, мне никогда не надоест смотреть на тебя.", slots: Array.from({ length: 6 }, (_, i) => slot(`портрет Миланы ${i + 1}`, "milana")), stage: 0.86 },
  { id: "love", index: "18", kind: "love", kicker: "Я люблю…", title: "Твой смех.", accent: "Твой взгляд.", copy: "Есть много разных причин. А главная — просто ты.", statements: ["ТВОЙ СМЕХ", "ТВОЙ ВЗГЛЯД", "ТО, КАК ТЫ…", "ТВОЯ НЕПОХОЖЕСТЬ", "ТО, ЧТО ТЫ ОСТАЁШЬСЯ СОБОЙ"], stage: 0.88 },
  { id: "universe", index: "19", kind: "universe", kicker: "Наш мир", title: "Десятки кадров", accent: "в одном пространстве.", copy: "Наш мир состоит из мгновений, которые хочется сохранить навсегда.", slots: Array.from({ length: 10 }, (_, i) => slot(`кадр нашего мира ${i + 1}`, "us")), stage: 0.91 },
  { id: "then-now", index: "20", kind: "compare", kicker: "Then / Now", title: "730 дней", accent: "между двумя кадрами.", copy: "Мы тогда. Мы сейчас. И всё, что между этими двумя кадрами.", stage: 0.94 },
  { id: "voice", index: "21", kind: "voice", kicker: "Перед финалом", title: "Теперь просто", accent: "послушай меня.", copy: "Иногда самое важное не прочитать, а услышать.", stage: 0.96 },
  { id: "days", index: "22", kind: "number", number: "730", kicker: "Два года", title: "дней", accent: "с тобой.", copy: "Два года с тобой. И столько прекрасного ещё впереди.", slots: [slot("свежая совместная фотография", "finale", "4 / 5")], stage: 1 },
  { id: "letter", index: "23", kind: "letter", kicker: "Письмо", title: "Милана,", copy: "Есть слова, которые я хочу сказать только тебе.", stage: 1 },
  { id: "finale", index: "24", kind: "finale", kicker: "Финал", title: "Я люблю тебя.", accent: "И это только первые два года.", copy: "С нашими двумя годами, Милана.", stage: 1 },
  { id: "secret", index: "25", kind: "secret", kicker: "ONE MORE THING", title: "Непоказанное", accent: "останется здесь.", copy: "Есть воспоминания, которые мы храним особенно бережно.", stage: 1 },
];


/* Extra editorial chapters: separate content, never invent personal memories. */
const insertAfter = (target, scene) => {
  const at = SCENES.findIndex(item => item.id === target);
  if (at < 0) throw new Error("Missing chapter: " + target);
  SCENES.splice(at + 1, 0, scene);
};
insertAfter("month", {
  id:"letters", kind:"letters", kicker:"Семь писем",
  title:"Для тебя,",
  accent:"моя девочка.",
  copy:"Семь конвертов. Семь разных моментов. И одно неизменное чувство. Коснись любого письма — я оставил в нём слова для тебя.",
  stage:.29
});
insertAfter("year", {
  id:"day-night", kind:"daynight", kicker:"От рассвета до звёзд",
  title:"И утром,",
  accent:"и перед сном.",
  copy:"Для тебя найдётся нежное слово в любое время суток.",
  stage:.71
});
insertAfter("love", {
  id:"tenderness", kind:"tender", kicker:"Мои ласковые слова",
  title:"Как бы я",
  accent:"тебя ни называл…",
  copy:"Каждое имя — маленькое признание. Выбери любое и открой послание, которое я хотел оставить тебе.",
  stage:.895
});
insertAfter("voice", {
  id:"promises", kind:"vows", kicker:"То, что важнее красивых слов",
  title:"Я хочу",
  accent:"беречь нас.",
  copy:"Не обещания безупречной сказки. Небольшие вещи, которые я действительно хочу делать для тебя и для нас.",
  stage:.975
});
SCENES.forEach((scene, index) => { scene.index = String(index).padStart(2, "0"); });

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
