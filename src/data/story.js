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
  displayInstances: "15",
  concept: "15 фотографий, 15 сцен-переходов, 730 дней одной истории",
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
  { id: "date-mark", label: "маленькая дата", text: "Одна дата, которую хочется помнить без календаря." },
  { id: "petal", label: "лепесток", text: "Маленькая деталь, которую не хочется терять среди больших событий." },
  { id: "note", label: "рукописная отметка", text: "Несколько слов, к которым хочется возвращаться." },
  { id: "place", label: "точка на карте", text: "Место, которое осталось частью вашей истории." },
  { id: "frame", label: "край фотографии", text: "У каждого кадра есть второй слой." },
  { id: "flower", label: "бутон", text: "Некоторые вещи замечаешь не сразу." },
  { id: "message", label: "сообщение", text: "Несколько слов, которые остались между вами." },
  { id: "object", label: "предмет", text: "Маленькие вещи иногда помнят больше больших дат." },
];

export const LETTER_MOMENTS = [
  { id: "before-us", number: "01", title: "До того, как появилось «мы»", text: "Две отдельные линии, которые ещё не знали друг о друге." },
  { id: "first-day", number: "02", title: "В тот самый день", text: "Одна дата, после которой всё стало ближе." },
  { id: "month", number: "03", title: "Первые тридцать дней", text: "Маленькая деталь, которую помнишь до сих пор." },
  { id: "everyday", number: "04", title: "Самые обычные дни", text: "Письмо без пафоса: про смешное, сонное, случайное и настоящее." },
  { id: "half-year", number: "05", title: "Когда стало привычно быть рядом", text: "Близость, которая постепенно стала ощущаться домом." },
  { id: "you", number: "06", title: "Про тебя", text: "Спокойно, честно, без лишних слов." },
  { id: "voice", number: "07", title: "Перед тем, как сказать вслух", text: "Последняя короткая записка перед голосом." },
];

export const SCENES = [
  { id: "prologue", index: "00", kind: "prologue", kicker: "Для Миланы", title: "MILANA", subtitle: "TWO YEARS", copy: "Пятнадцать кадров. Семьсот тридцать дней.", stage: 0.03 },
  { id: "before-us", index: "01", kind: "before", chapter: "ГЛАВА I", kicker: "До нас", title: "Два человека.", accent: "Одна будущая история.", copy: "Две отдельные жизни до того, как появилась общая линия.", slots: [P.beforeA, P.beforeB], stage: 0.1 },
  { id: "first-day", index: "02", kind: "date", chapter: "Тот самый день", title: "18.11.24", copy: "Дата, с которой эти пятнадцать кадров стали одной историей.", slots: [P.start], stage: 0.17 },
  { id: "beginning", index: "03", kind: "tunnel", chapter: "Первые недели", title: "Всё было", accent: "впервые.", copy: "Первые фотографии, первые привычки и первые дни рядом.", slots: [P.beginningA, P.beginningB], stage: 0.24 },
  { id: "month", index: "04", kind: "month", kicker: "Первый месяц", title: "30", accent: "дней вместе", copy: "Один кадр, который держит начало.", slots: [P.monthA], stage: 0.31 },
  { id: "everyday", index: "05", kind: "gallery", kicker: "Обычные дни", title: "Самые", accent: "настоящие моменты.", copy: "Сонные, смешные, случайные — жизнь не обязана быть постановочной.", slots: [P.everydayA, P.everydayB, P.everydayC], stage: 0.4 },
  { id: "places", index: "06", kind: "places", kicker: "Наши места", title: "Где мы", accent: "становились нами.", copy: "Одна точка на карте иногда хранит целую эпоху.", slots: [P.place], stage: 0.49 },
  { id: "half-year", index: "07", kind: "number", number: "182", kicker: "Полгода", title: "Первое", accent: "раскрытие.", copy: "Время, когда быть рядом стало естественным.", slots: [P.halfYear], stage: 0.59 },
  { id: "first-year", index: "08", kind: "gallery-stage", kicker: "Первый год", title: "365", accent: "дней.", copy: "Один год не помещается в одну дату — но помещается в один сильный кадр.", slots: [P.year], stage: 0.69 },
  { id: "you", index: "09", kind: "silk", kicker: "Глава «Ты»", title: "В тебе", accent: "целая вселенная.", copy: "Один портрет без коллекции одинаковых карточек. Просто ты.", slots: [P.milana], stage: 0.78 },
  { id: "universe", index: "10", kind: "universe", kicker: "Наш мир", title: "Один кадр", accent: "и всё вокруг него.", copy: "То, что хочется оставить в центре памяти.", slots: [P.us], stage: 0.85 },
  { id: "then-now", index: "11", kind: "compare", kicker: "Тогда / сейчас", title: "730 дней", accent: "между двумя кадрами.", copy: "Сравнение начала и финала — без лишнего шума.", stage: 0.91 },
  { id: "voice", index: "12", kind: "voice", kicker: "Перед финалом", title: "Теперь просто", accent: "послушай меня.", copy: "Пятнадцать фотографий замолкают. Остаётся голос.", stage: 0.95 },
  { id: "letter", index: "13", kind: "letter", kicker: "Письмо", title: "Милана,", copy: "После визуальной истории остаются слова, которые нельзя заменить эффектом.", stage: 0.98 },
  { id: "finale", index: "14", kind: "finale", kicker: "Финал", title: "Я люблю тебя.", accent: "И это только первые два года.", copy: "Последний из пятнадцати кадров возвращает нас к началу.", slots: [P.final], stage: 1 },
];

export const MESSAGE_SLOTS = [
  "фрагмент 01",
  "фрагмент 02",
  "фрагмент 03",
  "фрагмент 04",
  "фрагмент 05",
  "фрагмент 06",
];

export const PLACE_SLOTS = [
  "место №1 — первая прогулка",
  "место №2 — важный день",
  "место №3 — ваш маршрут",
  "место №4 — маленький мир",
  "место №5 — однажды потом",
];
