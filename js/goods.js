'use strict';

var KEYCODE_ENTER = 13;
var KEYCODE_BACKSPACE = 8;
var KEYCODE_0 = 48;
var KEYCODE_9 = 57;
var NUMBER_OF_GOODS_IN_CATALOG = 6;

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
loaderElement.classList.add('visually-hidden');
var emptyBasketElement = document.querySelector('.goods__card-empty');

var basketCardsListElement = document.querySelector('.goods__cards');
basketCardsListElement.classList.remove('goods__cards--empty');

var orderForm = document.querySelector('.order');

/**
 * Шаблоны
 */
var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
var basketCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

/**
 * Возвращает слово с корректным окончанием
 * @param  {number} number - количество товара в корзине
 * @return {string}        - слово с корректным окончанием
 */
var getCorrectWord = function (number) {
  var word = 'товар';
  var wordEnds = ['а', 'ов'];

  if (number === 1 || (number !== 11 && number % 10 === 1)) {
    return word;
  } else if ((number >= 2 && number <= 4) || (number > 20 && number % 10 >= 2 && number % 10 <= 4)) {
    return word + wordEnds[0];
  } else if ((number >= 5 && number <= 11) || (number % 10 === 0 || number % 10 >= 2 && number % 10 <= 4) ||
             (number % 10 >= 5 && number % 10 <= 9)) {
    return word + wordEnds[1];
  }
};

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
 * Делает глубокую копию объекта
 * @param  {object} object - исходный объект
 * @return {object}        - клон объекта
 */
var deepCopy = function (object) {
  var clone = Object.create(Object.getPrototypeOf(object));
  var properties = Object.getOwnPropertyNames(object);

  for (var propertyIndex = 0; propertyIndex < properties.length; propertyIndex++) {
    var property = properties[propertyIndex];
    var descriptor = Object.getOwnPropertyDescriptor(object, property);

    if (descriptor.value && typeof descriptor.value === 'object') {
      descriptor.value = deepCopy(descriptor.value);
    }

    Object.defineProperty(clone, property, descriptor);
  }

  return clone;
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
      id: i,
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
  catalogCardElement.querySelector('.card__btn').setAttribute('data-card-id', good.id);

  if (good.amount === 0) catalogCardElement.querySelector('.card__btn').classList.add('card__btn--disabled');

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

  basketCardElement.setAttribute('data-card-id', good.id);
  basketCardElement.querySelector('.card-order__close').setAttribute('data-card-id', good.id);
  basketCardElement.querySelector('.card-order__price').setAttribute('data-card-id', good.id);
  basketCardElement.querySelector('.card-order__count').setAttribute('data-card-id', good.id);
  basketCardElement.querySelector('.card-order__btn--decrease').setAttribute('data-card-id', good.id);
  basketCardElement.querySelector('.card-order__btn--increase').setAttribute('data-card-id', good.id);

  return basketCardElement;
};

/**
 * Блокирует поля в форме заказа, если в корзине нет товаров
 * @param  {Boolean} boolean - по умолчанию блокирует поля / при false разблокирует поля
 */
var blockOrderFields = function (boolean) {
  var fields = orderForm.querySelectorAll('input');

  for (var i = 0; i < fields.length; i++) {
    fields[i].disabled = boolean;
  }
};

/**
 * Вставляет DOM-элементы товаров в каталог
 */
var addCatalogCards = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < goodsInCatalog.length; i++) {
    if (goodsInCatalog.length > 5) {
      catalogCardTemplate.classList.add('card--in-stock');
    } else if (goodsInCatalog.length >= 1 && goodsInCatalog.length <= 5) {
      catalogCardTemplate.classList.add('card--little');
    } else {
      catalogCardTemplate.classList.add('card--soon');
    }

    fragment.appendChild(renderCatalogCard(goodsInCatalog[i]));
  }

  catalogCardsListElement.appendChild(fragment);
};

var goodsInCatalog = generatesData(NUMBER_OF_GOODS_IN_CATALOG); // формирует данные для каталога
addCatalogCards(); // заполняем каталог товарами
blockOrderFields(true); // пока корзина пуста, блокирует поля формы заказа

var goodsInBasket = {};

var getGoodAmountInBasket = function () {
  return Object.keys(goodsInBasket).length;
};

var searchGoodInBasket = function (id) {
  var isFound = false;

  for (var goodId in goodsInBasket) {
    if (Number(goodId) === id) {
      isFound = true;
      break;
    }
  }

  return isFound;
};

var changeDataValue = function (data, id, change, property) {
  for (var key in data) {
    if (Number(key) === id) {
      if (change === 'increase') {
        data[key][property] += 1;
        break;
      } else if (change === 'decrease') {
        data[key][property] -= 1;
        break;
      }
    }
  }
};

var cloneGood = function (selectedGood) {
  var goodClone = deepCopy(selectedGood);
  goodClone.orderedAmount = 0;

  return goodClone;
};

var getBasketCardElement = function (className, id) {
  return basketCardsListElement.querySelector('.' + className + '[data-card-id="' + id + '"]');
};

var getCatalogCardElement = function (className, id) {
  return catalogCardsListElement.querySelector('.' + className + '[data-card-id="' + id + '"]');
};

var addBasketCard = function (good) {
  basketCardsListElement.appendChild(renderBasketCard(good));
};

var deleteBasketCard = function (id) {
  basketCardsListElement.removeChild(getBasketCardElement('card-order', id));
  delete goodsInBasket[id];
};

var blockAddGoodButtonInBasket = function (id, disabled) {
  if (getCatalogCardElement('card__btn', id).classList.contains('card__btn--disabled')) {
    getCatalogCardElement('card__btn', id).classList.remove('card__btn--disabled');
  }

  if (disabled) {
    getCatalogCardElement('card__btn', id).classList.add('card__btn--disabled');
  }
};

var hideTextBasket = function (hide) {
  if (emptyBasketElement.classList.contains('visually-hidden')) {
    emptyBasketElement.classList.remove('visually-hidden');
  }

  if (hide) {
    emptyBasketElement.classList.add('visually-hidden');
  }
};

var checkNumericField = function (evt) {
  if (evt.which >= KEYCODE_0 && evt.which <= KEYCODE_9) {
    return;
  } else if (evt.which === KEYCODE_BACKSPACE) {
    return;
  }

  return evt.preventDefault();
};

var checkGoodAmount = function (id) {
  if (getGoodAmountInBasket() < 1) return;

  if (goodsInBasket[id]['amount'] <= 0) blockAddGoodButtonInBasket(id, true);
};

var calcGoodPrice = function (id) {
  if (goodsInBasket[id] === undefined) return;
  getBasketCardElement('card-order__price', id).textContent = goodsInBasket[id]['price'] * goodsInBasket[id]['orderedAmount'] + ' ₽';
};

var calcTotalBasketInfo = function () {
  var totalBasketInfo = document.querySelector('.goods__total');
  totalBasketInfo.classList.add('visually-hidden');
  var totalPrice = totalBasketInfo.querySelector('.goods__price');
  var totalAmount = totalBasketInfo.querySelector('.goods__total-count');

  var totalHeaderBasketInfo = document.querySelector('.main-header__basket');
  totalHeaderBasketInfo.textContent = 'В корзине ничего нет';

  if (getGoodAmountInBasket() > 0) {
    totalBasketInfo.classList.remove('visually-hidden');
    totalBasketInfo.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');

    var goodOrderedAmount = 0;
    var goodPrice;
    var goodTotalPrice = 0;

    for (var id in goodsInBasket) {
      var good = goodsInBasket[id];

      if (good['orderedAmount'] !== 0) {
        goodOrderedAmount += good['orderedAmount'];
        goodPrice = good['price'] * good['orderedAmount'];
        goodTotalPrice += goodPrice;
      }
    }

    totalAmount.textContent = ('Итого за ' + goodOrderedAmount + ' ' + getCorrectWord(goodOrderedAmount) + ': ').toUpperCase();
    totalPrice.textContent = goodTotalPrice + ' ₽';
    totalAmount.appendChild(totalPrice);

    totalHeaderBasketInfo.textContent = 'В корзине ' + goodOrderedAmount + ' ' + getCorrectWord(goodOrderedAmount) + ' на ' + goodTotalPrice + ' ₽';
  }
};

var increaseGoodOrderedAmount = function (id) {
  if (goodsInBasket[id].amount <= 0) return;

  getBasketCardElement('card-order__count', id)
    .setAttribute('value', Number(getBasketCardElement('card-order__count', id).value) + 1);

  changeDataValue(goodsInBasket, id, 'increase', 'orderedAmount');
  changeDataValue(goodsInBasket, id, 'decrease', 'amount');

  if (goodsInBasket[id].amount <= 0) blockAddGoodButtonInBasket(id, true);
  calcTotalBasketInfo();
};

var decreaseGoodOrderedAmount = function (id) {
  if (goodsInBasket[id].orderedAmount <= 0) return;

  if (goodsInBasket[id].orderedAmount > 0) blockAddGoodButtonInBasket(id, false);

  getBasketCardElement('card-order__count', id)
    .setAttribute('value', Number(getBasketCardElement('card-order__count', id).value) - 1);

  changeDataValue(goodsInBasket, id, 'decrease', 'orderedAmount');
  changeDataValue(goodsInBasket, id, 'increase', 'amount');

  if (goodsInBasket[id].orderedAmount < 1) deleteBasketCard(id);
  calcTotalBasketInfo();
};

var addGoodToBasket = function (evt) {
  var target = evt.target;
  var classNames = target.classList;
  var id = Number(target.dataset.cardId);

  if (!classNames.contains('card__btn')) return;
  evt.preventDefault();

  if (goodsInCatalog[id]['amount'] <= 0) return;

  var isFound = searchGoodInBasket(id);

  if (isFound) {
    if (goodsInBasket[id]['amount'] <= 0) return;
    increaseGoodOrderedAmount(id);
    calcGoodPrice(id);
    calcTotalBasketInfo();
    checkGoodAmount(id);
    blockOrderFields(false);
  } else {
    hideTextBasket(true);
    goodsInBasket[id] = cloneGood(goodsInCatalog[id]);
    addBasketCard(goodsInBasket[id]);
    increaseGoodOrderedAmount(id);
    calcTotalBasketInfo();
    checkGoodAmount(id);
    blockOrderFields(false);
  }

  target.blur();
};

var manageGoodOrderedAmountInBasket = function (evt) {
  var target = evt.target;
  var classNames = target.classList;
  var id = Number(target.dataset.cardId);

  evt.preventDefault();

  if (classNames.contains('card-order__close')) {
    blockAddGoodButtonInBasket(id, false);
    deleteBasketCard(id);
    calcTotalBasketInfo();
    if (getGoodAmountInBasket() < 1) {
      hideTextBasket(false);
      blockOrderFields(true);
    }
  } else if (classNames.contains('card-order__btn--increase')) {
    increaseGoodOrderedAmount(id);
    calcGoodPrice(id);
  } else if (classNames.contains('card-order__btn--decrease')) {
    decreaseGoodOrderedAmount(id);
    calcGoodPrice(id);
    if (getGoodAmountInBasket() < 1) {
      hideTextBasket(false);
      blockOrderFields(true);
    }
  }
};

var addCardToFavorites = function (evt) {
  var target = evt.target;
  var targetClass = target.classList;

  if (!targetClass.contains('card__btn-favorite')) return;

  evt.preventDefault();
  targetClass.toggle('card__btn-favorite--selected');
  target.blur();
};

/**
 * Обработчики
 */
catalogCardsListElement.addEventListener('click', function (evt) {
  addGoodToBasket(evt);
});

catalogCardsListElement.addEventListener('keydown', function (evt) {
  if (evt.which === KEYCODE_ENTER) {
    addGoodToBasket(evt);
  }
});

basketCardsListElement.addEventListener('click', function (evt) {
  manageGoodOrderedAmountInBasket(evt);
});

basketCardsListElement.addEventListener('keydown', function (evt) {
  if (evt.which === KEYCODE_ENTER) {
    manageGoodOrderedAmountInBasket(evt);
  }
});

basketCardsListElement.addEventListener('keydown', function (evt) {
  var target = evt.target;
  var classNames = target.classList;

  if (!classNames.contains('card-order__count')) return;

  checkNumericField(evt);
});

basketCardsListElement.addEventListener('input', function (evt) {
  var target = evt.target;
  var classNames = target.classList;
  var id = Number(target.dataset.cardId);

  if (!classNames.contains('card-order__count')) return;

  if (Number(getBasketCardElement('card-order__count', id).value) > goodsInCatalog[id]['amount']) {
    blockAddGoodButtonInBasket(id, true);
    getBasketCardElement('card-order__count', id).setAttribute('value', goodsInCatalog[id]['amount']);
    getBasketCardElement('card-order__count', id).value = goodsInCatalog[id]['amount'];
    goodsInBasket[id]['orderedAmount'] = goodsInCatalog[id]['amount'];
  } else if (Number(getBasketCardElement('card-order__count', id).value) < 0) {
    getBasketCardElement('card-order__count', id).setAttribute('value', 0);
    getBasketCardElement('card-order__count', id).value = 0;
    goodsInBasket[id]['orderedAmount'] = 0;
  } else {
    if (getCatalogCardElement('card__btn', id).classList.contains('card__btn--disabled')) {
      blockAddGoodButtonInBasket(id, false);
    }
    goodsInBasket[id]['orderedAmount'] = Number(getBasketCardElement('card-order__count', id).value);
  }

  goodsInBasket[id]['amount'] = goodsInCatalog[id]['amount'] - goodsInBasket[id]['orderedAmount'];
  getBasketCardElement('card-order__price', id).textContent = goodsInBasket[id]['price'] * goodsInBasket[id]['orderedAmount'] + ' ₽';
  calcTotalBasketInfo();

  if (getBasketCardElement('card-order__count', id).value === '0') {
    setTimeout(function () {
      deleteBasketCard(id);

      if (getGoodAmountInBasket() < 1) {
        hideTextBasket(false);
        calcTotalBasketInfo();
        blockOrderFields(true);
      }
    }, 10000);
  }
});

catalogCardsListElement.addEventListener('click', function (evt) {
  addCardToFavorites(evt);
});

catalogCardsListElement.addEventListener('keydown', function (evt) {
  if (evt.which === KEYCODE_ENTER) {
    addCardToFavorites(evt);
  }
});

var toggleDeliveryElements = orderForm.querySelector('.deliver__toggle');
var deliveryCourier = orderForm.querySelector('.deliver__courier');
var deliveryStore = orderForm.querySelector('.deliver__store');

var selectDeliveryOption = function (evt) {
  var target = evt.target;

  if (target.id === 'deliver__courier') {
    deliveryCourier.classList.remove('visually-hidden');
    deliveryStore.classList.add('visually-hidden');
  } else {
    deliveryStore.classList.remove('visually-hidden');
    deliveryCourier.classList.add('visually-hidden');
  }
};

toggleDeliveryElements.addEventListener('click', function (evt) {
  selectDeliveryOption(evt);
});
