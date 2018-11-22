'use strict';

(function () {
  var generateRandomNumber = window.util.generateRandomNumber;
  var generateString = window.util.generateString;

  var GOOD = {
    NUMBER: 6,
    NAMES: [
      'Чесночные сливки',
      'Огуречный педант',
      'Молочная хрюша',
      'Грибной шейк',
      'Баклажановое безумие',
      'Паприколу итальяно',
      'Нинзя-удар васаби',
      'Хитрый баклажан',
      'Горчичный вызов',
      'Кедровая липучка',
      'Корманный портвейн',
      'Чилийский задира',
      'Беконовый взрыв',
      'Арахис vs виноград',
      'Сельдерейная душа',
      'Початок в бутылке',
      'Чернющий мистер чеснок',
      'Раша федераша',
      'Кислая мина',
      'Кукурузное утро',
      'Икорный фуршет',
      'Новогоднее настроение',
      'С пивком потянет',
      'Мисс креветка',
      'Бесконечный взрыв',
      'Невинные винные',
      'Бельгийское пенное',
      'Острый язычок'
    ],
    PHOTO: [
      'gum-cedar.jpg',
      'gum-chile.jpg',
      'gum-eggplant.jpg',
      'gum-mustard.jpg',
      'gum-portwine.jpg',
      'gum-wasabi.jpg',
      'ice-cucumber.jpg',
      'ice-eggplant.jpg',
      'ice-garlic.jpg',
      'ice-italian.jpg',
      'ice-mushroom.jpg',
      'ice-pig.jpg',
      'marmalade-beer.jpg',
      'marmalade-caviar.jpg',
      'marmalade-corn.jpg',
      'marmalade-new-year.jpg',
      'marmalade-sour.jpg',
      'marshmallow-bacon.jpg',
      'marshmallow-beer.jpg',
      'marshmallow-shrimp.jpg',
      'marshmallow-spicy.jpg',
      'marshmallow-wine.jpg',
      'soda-bacon.jpg',
      'soda-celery.jpg',
      'soda-cob.jpg',
      'soda-garlic.jpg',
      'soda-peanut-grapes.jpg',
      'soda-russian.jpg'
    ],
    INGREDIENTS: [
      'молоко',
      'сливки',
      'вода',
      'пищевой краситель',
      'патока',
      'ароматизатор бекона',
      'ароматизатор свинца',
      'ароматизатор дуба, идентичный натуральному',
      'ароматизатор картофеля',
      'лимонная кислота',
      'загуститель',
      'эмульгатор',
      'консервант: сорбат калия',
      'посолочная смесь: соль, нитрит натрия',
      'ксилит',
      'карбамид',
      'вилларибо',
      'виллабаджо'
    ]
  };

  var generatesData = function (count) {
    var goods = [];

    for (var i = 0; i < count; i++) {
      var good = {
        id: i,
        name: GOOD.NAMES[generateRandomNumber(0, GOOD.NAMES.length - 1)],
        picture: 'img/cards/' + GOOD.PHOTO[generateRandomNumber(0, GOOD.PHOTO.length - 1)],
        amount: generateRandomNumber(0, 20),
        price: generateRandomNumber(100, 1500),
        weight: generateRandomNumber(30, 300),
        rating: {
          value: generateRandomNumber(1, 5),
          number: generateRandomNumber(10, 900)
        },
        nutritionFacts: {
          sugar: Boolean(generateRandomNumber(0, 1)),
          energy: generateRandomNumber(70, 500),
          ingredients: generateString(GOOD.INGREDIENTS)
        }
      };

      goods.push(good);
    }

    return goods;
  };

  window.data = generatesData(GOOD.NUMBER);
})();
