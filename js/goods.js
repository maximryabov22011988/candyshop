'use strict';

var NUMBER_OF_GOODS = 5;
var NUMBER_OF_GOODS_IN_CART = 3;

var NAMES = [
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
];

var IMAGES = [
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
];

var CONTENTS = [
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
];


/**
 * Генерирует случайное число в диапазоне от min до max (включительно)
 * @param  {number} min - минимальное число
 * @param  {number} max - максимальное число
 * @return {number}     - случайное число
 */
var generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

/**
 * Генерирует строку случайной длины из элементов массива
 * @param  {array} array - массив с данными
 * @return {string}      - сгенерированная строка
 */
var generateString = function (array) {
  array.length = generateRandomNumber(3, array.length - 1);
  return array.join(', ');
};

/**
 * Генерирует данные
 * @param  {number} count - количество объектов в массиве
 * @return {array}        - массив с объектами
 */
var generatesData = function (count) {
  var data = [];

  for (var i = 0; i < count; i++) {
    var product = {
      name: NAMES[generateRandomNumber(0, NAMES.length - 1)],
      picture: 'img/cards/' + IMAGES[generateRandomNumber(0, IMAGES.length - 1)],
      amount: generateRandomNumber(0, 20),
      price: generateRandomNumber(100, 1500),
      weight: generateRandomNumber(30, 300),
      rating: {
        value: generateRandomNumber(1, 5),
        number: generateRandomNumber(10, 900)
      },
      nutritionFacts: {
        sugar: !!generateRandomNumber(0, 1),
        energy: generateRandomNumber(70, 500),
        contents: generateString(CONTENTS)
      }
    };

    data.push(product);
  }

  return data;
};


var goodListElement = document.querySelector('.catalog__cards');
goodListElement.classList.remove('catalog__cards--load');

var loaderElement = goodListElement.querySelector('.catalog__load');
loaderElement.classList.add('visually-hidden');

var catalogCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.catalog__card');

/**
 * Отрисовывает карточку товара в каталоге
 * @param  {object} good - описание товара
 * @return {DOM}         - DOM-элемент товара
 */
var renderCatalogCard = function (good) {
  var goodElement = catalogCardTemplate.cloneNode(true);
  var goodRatingElement = goodElement.querySelector('.stars__rating');

  goodElement.querySelector('.card__title').textContent = good.name;
  goodElement.querySelector('.card__img').src = good.picture;
  goodElement.querySelector('.card__img').alt = good.name;
  goodElement.querySelector('.card__price').innerHTML = `${good.price} <span class="card__currency">₽</span><span class="card__weight">/ ${good.weight} Г</span>`;
  goodElement.querySelector('.star__count').textContent = good.rating.number;
  goodElement.querySelector('.card__characteristic').textContent = good.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
  goodElement.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents;

  switch (good.rating.value) {
    case 1:
      goodRatingElement.classList.add('stars__rating--one');
      break;
    case 2:
      goodRatingElement.classList.add('stars__rating--two');
      break;
    case 3:
      goodRatingElement.classList.add('stars__rating--three');
      break;
    case 4:
      goodRatingElement.classList.add('stars__rating--four');
      break;
    case 5:
      goodRatingElement.classList.add('stars__rating--five');
      break;
    default:
      goodRatingElement.classList.add('stars__rating--five');
      break;
  }

  return goodElement;
};

var goodsCardsListElement = document.querySelector('.goods__cards');
goodsCardsListElement.classList.remove('goods__cards--empty');

var emptyCartElement = document.querySelector('.goods__card-empty');
emptyCartElement.classList.add('visually-hidden');

var goodCardTemplate = document.querySelector('#card-order')
  .content
  .querySelector('.goods_card');

/**
 * Отрисовывает товар в корзине
 * @param  {object} good - описание товара
 * @return {DOM}         - DOM-элемент товара
 */
var renderGoodInCart = function (good) {
  var goodInCartElement = goodCardTemplate.cloneNode(true);

  goodInCartElement.querySelector('.card-order__title').textContent = good.name;
  goodInCartElement.querySelector('.card-order__img').src = good.picture;
  goodInCartElement.querySelector('.card-order__img').alt = good.name;
  goodInCartElement.querySelector('.card-order__price').textContent = `${good.price} ₽`;

  return goodInCartElement;
};

/**
 * Вставляет DOM-элементы товаров в нужное место в DOM
 * @param  {DOM} parentElement    - контейнер для вставки товаров
 * @param  {number} numberOfGoods - количество товаров
 */
var insertElements = function (parentElement, numberOfGoods) {
  var fragment = document.createDocumentFragment();
  var goods = generatesData(numberOfGoods);

  goods.forEach(function (good) {
    if (parentElement.className === 'catalog__cards') {

      if (numberOfGoods === 0) {
        catalogCardTemplate.classList.add('card--soon');
      } else if (numberOfGoods >= 1 && numberOfGoods <= 5) {
        catalogCardTemplate.classList.add('card--little');
      } else {
        catalogCardTemplate.classList.add('card--in-stock');
      }

      fragment.appendChild(renderGood(good));
    } else if (parentElement.className === 'goods__cards') {
      fragment.appendChild(renderGoodInCart(good));
    }
  });

  parentElement.appendChild(fragment);
};

insertElements(goodListElement, NUMBER_OF_GOODS);
insertElements(goodsCardsListElement, NUMBER_OF_GOODS_IN_CART);
