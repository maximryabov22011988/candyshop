'use strict';

(function () {
  var backendApi = window.backendApi;
  var isEnterEvent = window.util.isEnterEvent;
  var makeCounter = window.util.makeCounter;
  var renderEmptyBasket = window.loader.renderEmptyBasket;
  var blockFields = window.order.blockFields;
  var renderCatalogCards = window.render.renderCatalogCards;
  var renderMoreCards = window.render.renderMoreCards;
  var renderRangeAmount = window.range.renderRangeAmount;
  var calcFilterItemAmount = window.filter.calcFilterItemAmount;
  var renderFilterItemAmount = window.filter.renderFilterItemAmount;

  var favoriteGoodsCounter = makeCounter();

  var rangeCount = document.querySelector('.range__count');
  var catalogCardsListElement = document.querySelector('.catalog__cards');
  var favoriteCounter = document.querySelector('.input-btn__label[for="filter-favorite"]').nextElementSibling;
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
      good.id = i;
      good.favorite = false;
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
    if (!evt.target.classList.contains('card__btn-favorite')) {
      return;
    }

    evt.preventDefault();

    var target = evt.target;
    var targetClass = target.classList;
    var isFavorite = target.classList.contains('card__btn-favorite--selected');
    var id = Number(target.dataset.cardId);

    if (!isFavorite) {
      favoriteGoodsCounter.increment();
      window.goodsInCatalog[id].favorite = true;
      targetClass.add('card__btn-favorite--selected');
    } else {
      favoriteGoodsCounter.decrement();
      window.goodsInCatalog[id].favorite = false;
      targetClass.remove('card__btn-favorite--selected');
    }

    favoriteCounter.textContent = '(' + favoriteGoodsCounter.get() + ')';
    console.log(favoriteGoodsCounter.get());
    target.blur();
  };

  var showMoreCatalogCard = function (evt) {
    evt.preventDefault();
    renderMoreCards(window.goodsInCatalog);

    var catalogCards = document.querySelectorAll('.catalog__card');

    if (catalogCards.length === window.goodsInCatalog.length) {
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
