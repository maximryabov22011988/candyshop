'use strict';

(function () {
  var backendApi = window.backendApi;
  var isEnterEvent = window.util.isEnterEvent;
  var showElement = window.util.showElement;
  var hideElement = window.util.hideElement;
  var renderRangeAmount = window.range.renderRangeAmount;
  var renderEmptyBasket = window.loader.renderEmptyBasket;
  var blockFields = window.order.blockFields;
  var renderCatalogCards = window.render.renderCatalogCards;
  var renderMoreCards = window.render.renderMoreCards;

  var catalogCardsContainer = document.querySelector('.catalog__cards');
  var showMoreGoodsButton = document.querySelector('.catalog__btn-more');
  var rangeCount = document.querySelector('.range__count');

  var successHandler = function (goods) {
    var filteredGoods = goods.filter(function (good) {
      return good.price > 0;
    });

    filteredGoods.forEach(function (good, i) {
      good.id = i;
      good.favorite = false;
    });

    catalogCardsContainer.classList.remove('catalog__cards--load');
    renderCatalogCards(filteredGoods);
    showElement(showMoreGoodsButton);

    renderRangeAmount(filteredGoods);
    rangeCount.textContent = '(' + filteredGoods.length + ')';

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
    if (!evt.target.classList.contains('card__btn-favorite')) {
      return;
    }

    evt.preventDefault();

    var target = evt.target;
    var targetClass = target.classList;
    var isFavorite = target.classList.contains('card__btn-favorite--selected');
    var id = parseInt(target.dataset.cardId, 10);

    if (!isFavorite) {
      window.goodsInCatalog[id].favorite = true;
      targetClass.add('card__btn-favorite--selected');
    } else {
      window.goodsInCatalog[id].favorite = false;
      targetClass.remove('card__btn-favorite--selected');
    }

    target.blur();
  };

  var showMoreCatalogCard = function (evt) {
    evt.preventDefault();
    renderMoreCards(window.goodsInCatalog);

    var catalogCards = document.querySelectorAll('.catalog__card');

    if (catalogCards.length === window.goodsInCatalog.length) {
      hideElement(showMoreGoodsButton);
    }

    evt.target.blur();
  };

  catalogCardsContainer.addEventListener('click', function (evt) {
    addCardToFavorites(evt);
  });

  catalogCardsContainer.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, addCardToFavorites);
  });

  showMoreGoodsButton.addEventListener('click', function (evt) {
    showMoreCatalogCard(evt);
  });

  showMoreGoodsButton.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, showMoreCatalogCard);
  });
})();
