'use strict';

(function () {
  var backendApi = window.backendApi;
  var isEnterEvent = window.util.isEnterEvent;
  var renderEmptyBasket = window.loader.renderEmptyBasket;
  var blockFields = window.order.blockFields;

  var valueToClassName = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
  };

  var catalogCardsListElement = document.querySelector('.catalog__cards');
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var moreGoodsButton = document.querySelector('.catalog__btn-more');

  var getRatingClassName = function (value) {
    return 'stars__rating--' + valueToClassName[value];
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

  var startIndex = 0;

  var insertCatalogCard = function (goods, amount) {
    if (startIndex >= goods.length) {
      return;
    }

    var fragment = document.createDocumentFragment();

    for (var i = startIndex; i < startIndex + amount; i++) {
      var goodClass = 'card--soon';

      if (goods.length > 5) {
        goodClass = 'card--in-stock';
      } else if (goods.length >= 1 && goods.length <= 5) {
        goodClass = 'card--little';
      }

      fragment.appendChild(renderCatalogCard(goods[i], i, goodClass));
    }

    catalogCardsListElement.insertBefore(fragment, moreGoodsButton);
    startIndex += amount;
  };

  var successHandler = function (goods) {
    goods = goods.filter(function (good) {
      return good.price > 0;
    });

    catalogCardsListElement.classList.remove('catalog__cards--load');

    insertCatalogCard(goods, 6);
    moreGoodsButton.classList.remove('visually-hidden');

    window.goodsInCatalog = goods;
  };

  var errorHandler = function (errorMessage) {
    var loaderElement = document.querySelector('.catalog__load');
    loaderElement.style.display = 'none';
    throw new Error(errorMessage);
  };

  renderEmptyBasket();
  backendApi.loadData(successHandler, errorHandler);
  blockFields(true);

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

  var showMoreCatalogCard = function (evt) {
    evt.preventDefault();
    insertCatalogCard(goodsInCatalog, 6);

    if (document.querySelectorAll('.catalog__card').length === goodsInCatalog.length) {
      moreGoodsButton.classList.add('visually-hidden');
    }

    evt.target.blur();
  };

  catalogCardsListElement.addEventListener('click', function (evt) {
    addCardToFavorites(evt);
  });

  catalogCardsListElement.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, addCardToFavorites);
  });

  moreGoodsButton.addEventListener('click', function (evt) {
    showMoreCatalogCard(evt);
  });

  moreGoodsButton.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, showMoreCatalogCard);
  });
})();
