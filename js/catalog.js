'use strict';

(function () {

  //!!!! Доработать показ ошибок на основе template #load-data, показ по 6 элементов (кнопка "показать еще")

  var backend = window.backend;
  var KEYCODE = window.util.KEYCODE;
  var blockOrderFields = window.util.blockOrderFields;

  var RATING_MAP = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
  };

  var catalogCardsListElement = document.querySelector('.catalog__cards');
  catalogCardsListElement.classList.remove('catalog__cards--load');

  var loaderElement = catalogCardsListElement.querySelector('.catalog__load');
  var loadMessage = catalogCardsListElement.querySelector('.catalog__load-text');

  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

  var getRatingClassName = function (value) {
    return 'stars__rating--' + RATING_MAP[value];
  };

  var renderCatalogCard = function (good, id, className) {
    var catalogCardElement = catalogCardTemplate.cloneNode(true);

    catalogCardElement.classList.remove('card--in-stock');
    catalogCardElement.classList.add(className);
    catalogCardElement.querySelector('.card__title').textContent = good.name;
    catalogCardElement.querySelector('.card__img').src = 'img/cards/' + good.picture;
    catalogCardElement.querySelector('.card__img').alt = good.name;
    catalogCardElement.querySelector('.card__price').firstChild.textContent = good.price;
    catalogCardElement.querySelector('.card__weight').textContent = '/ ' + good.weight + ' Г';
    catalogCardElement.querySelector('.stars__rating').classList.add(getRatingClassName(good.rating.value));
    catalogCardElement.querySelector('.star__count').textContent = good.rating.number;
    catalogCardElement.querySelector('.card__characteristic').textContent = good.nutritionFacts.sugar;
    catalogCardElement.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents;
    catalogCardElement.querySelector('.card__btn').setAttribute('data-card-id', id);

    if (good.amount === 0) {
      catalogCardElement.querySelector('.card__btn').classList.add('card__btn--disabled');
    }

    return catalogCardElement;
  };

  var successHandler = function (goods) {
    window.goodsInCatalog = goods;

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < goods.length; i++) {
      var goodClass = 'card--soon';

      if (goods.length > 5) {
        goodClass = 'card--in-stock';
      } else if (goods.length >= 1 && goods.length <= 5) {
        goodClass = 'card--little';
      }

      fragment.appendChild(renderCatalogCard(goods[i], i, goodClass));
    }

    loaderElement.style.display = 'none';
    catalogCardsListElement.appendChild(fragment);
  };

  var errorHandler = function (errorMessage) {
    var preloaderElement = document.querySelector('.holder');
    preloaderElement.classList.add('visually-hidden');

    loadMessage.style.marginTop = '0';
    loadMessage.textContent = errorMessage;
  };

  backend.load(successHandler, errorHandler);
  blockOrderFields(true);

  var addCardToFavorites = function (evt) {
    var target = evt.target;
    var targetClass = target.classList;

    if (!targetClass.contains('card__btn-favorite')) {
      return;
    }

    evt.preventDefault();
    targetClass.toggle('card__btn-favorite--selected');
    target.blur();
  };

  catalogCardsListElement.addEventListener('click', function (evt) {
    addCardToFavorites(evt);
  });

  catalogCardsListElement.addEventListener('keydown', function (evt) {
    if (evt.which === KEYCODE['ENTER']) {
      addCardToFavorites(evt);
    }
  });
})();
