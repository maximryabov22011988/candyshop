'use strict';

(function () {
  var backendApi = window.backendApi;
  var isEnterEvent = window.util.isEnterEvent;
  var renderEmptyBasket = window.loader.renderEmptyBasket;
  var blockFields = window.order.blockFields;
  var renderCatalogCards = window.render.renderCatalogCards;
  var renderMoreCards = window.render.renderMoreCards;
  var renderRangeAmount = window.range.renderRangeAmount;
  var calcFilterItemAmount = window.filter.calcFilterItemAmount;
  var renderFilterItemAmount = window.filter.renderFilterItemAmount;

  var rangeCount = document.querySelector('.range__count');
  var catalogCardsListElement = document.querySelector('.catalog__cards');
  var moreGoodsButton = document.querySelector('.catalog__btn-more');

  var successHandler = function (goods) {
    var filteredGoods = goods.filter(function (good) {
      return good.price > 0;
    });

    var filterIdToAmount = calcFilterItemAmount(filteredGoods);
    renderFilterItemAmount(filterIdToAmount);

    renderRangeAmount(filteredGoods);
    rangeCount.textContent = '(' + filteredGoods.length + ')';

    filteredGoods.forEach(function (good, i) {
      good.isFavorite = false;
      good.id = i;
    });

    catalogCardsListElement.classList.remove('catalog__cards--load');
    renderCatalogCards(filteredGoods);
    moreGoodsButton.classList.remove('visually-hidden');

    window.goodsInCatalog = filteredGoods;
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
    renderMoreCards(goodsInCatalog);

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
