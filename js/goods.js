'use strict';

var ENTER_KEYCODE = 13;

var NUMBER_OF_GOODS_IN_CATALOG = 5;
var NUMBER_OF_GOODS_IN_BASKET = 3;

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

var PHOTO = [
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

var INGREDIENTS = [
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

var ratingMap = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five'
};

var catalogCardsListElement = document.querySelector('.catalog__cards');
catalogCardsListElement.classList.remove('catalog__cards--load');

var loaderElement = catalogCardsListElement.querySelector('.catalog__load');
var emptyCartElement = document.querySelector('.goods__card-empty');
loaderElement.classList.add('visually-hidden');
emptyCartElement.classList.add('visually-hidden');

var basketCardsListElement = document.querySelector('.goods__cards');
basketCardsListElement.classList.remove('goods__cards--empty');

// Шаблоны
var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
var basketCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

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
 * Генерирует массив объектов
 * @param  {number} count - количество объектов в массиве
 * @return {array}        - массив с объектами
 */
var generatesData = function (count) {
  var data = [];

  for (var i = 0; i < count; i++) {
    var good = {
      name: NAMES[generateRandomNumber(0, NAMES.length - 1)],
      picture: 'img/cards/' + PHOTO[generateRandomNumber(0, PHOTO.length - 1)],
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
        ingredients: generateString(INGREDIENTS)
      }
    };

    data.push(good);
  }

  return data;
};

/**
 * Возвращает класс, соответствующий рейтингу товара
 * @param  {number} value - значение рейтинга
 * @return {string}       - класс, соответствующий рейтингу
 */
var getRatingClassName = function (value) {
  return 'stars__rating--' + ratingMap[value];
};

/**
 * Отрисовывает карточку товара в каталоге
 * @param  {object} good - описание товара
 * @return {DOM}         - DOM-элемент товара
 */
var renderCatalogCard = function (good) {
  var catalogCardElement = catalogCardTemplate.cloneNode(true);

  catalogCardElement.querySelector('.card__title').textContent = good.name;
  catalogCardElement.querySelector('.card__img').src = good.picture;
  catalogCardElement.querySelector('.card__img').alt = good.name;
  catalogCardElement.querySelector('.card__price').firstChild.textContent = good.price;
  catalogCardElement.querySelector('.card__weight').textContent = '/ ' + good.weight + ' Г';
  catalogCardElement.querySelector('.stars__rating').classList.add(getRatingClassName(good.rating.value));
  catalogCardElement.querySelector('.star__count').textContent = good.rating.number;
  catalogCardElement.querySelector('.card__characteristic').textContent = good.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
  catalogCardElement.querySelector('.card__composition-list').textContent = good.nutritionFacts.ingredients;

  return catalogCardElement;
};

/**
 * Отрисовывает товар в корзине
 * @param  {object} good - описание товара
 * @return {DOM}         - DOM-элемент товара
 */
var renderBasketCard = function (good) {
  var basketCardElement = basketCardTemplate.cloneNode(true);

  basketCardElement.querySelector('.card-order__title').textContent = good.name;
  basketCardElement.querySelector('.card-order__img').src = good.picture;
  basketCardElement.querySelector('.card-order__img').alt = good.name;
  basketCardElement.querySelector('.card-order__price').textContent = good.price + ' ₽';

  return basketCardElement;
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

      if (numberOfGoods > 5) {
        catalogCardTemplate.classList.add('card--in-stock');
      } else if (numberOfGoods >= 1 && numberOfGoods <= 5) {
        catalogCardTemplate.classList.add('card--little');
      } else {
        catalogCardTemplate.classList.add('card--soon');
      }

      fragment.appendChild(renderCatalogCard(good));
    } else if (parentElement.className === 'goods__cards') {
      fragment.appendChild(renderBasketCard(good));
    }
  });

  parentElement.appendChild(fragment);
};

insertElements(catalogCardsListElement, NUMBER_OF_GOODS_IN_CATALOG);
insertElements(basketCardsListElement, NUMBER_OF_GOODS_IN_BASKET);


var addCardToFavorites = function (evt) {
  evt.preventDefault();
  var target = evt.target;

  if (target.classList.contains('card__btn-favorite')) {
    target.classList.toggle('card__btn-favorite--selected');
  }
};

catalogCardsListElement.addEventListener('click', addCardToFavorites);
catalogCardsListElement.addEventListener('keydown', function (evt) {
  if (evt.which === ENTER_KEYCODE) {
    addCardToFavorites(evt);
  }
});
