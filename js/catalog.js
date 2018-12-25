'use strict';

(function () {
  var backendApi = window.backendApi;
  var isEnterEvent = window.util.isEnterEvent;
  var showElement = window.util.showElement;
  var hideElement = window.util.hideElement;
  var convertToArray = window.util.convertToArray;
  var renderEmptyBasket = window.loader.renderEmptyBasket;
  var blockFields = window.order.blockFields;
  var renderCatalogCard = window.render.renderCatalogCard;
  var renderCatalogCards = window.render.renderCatalogCards;


  var catalogCardsContainerElement = document.querySelector('.catalog__cards');
  var showMoreButtonElement = document.querySelector('.catalog__btn-more');
  var rangeCountElement = document.querySelector('.range__count');
  var rangeMinElement = document.querySelector('.range__price--min');
  var rangeMaxElement = document.querySelector('.range__price--max');

  var startIndex = 0;
  var goodInGroup = 6;

  var filterNameToAmount = {
    'Мороженое': 0,
    'Газировка': 0,
    'Жевательная резинка': 0,
    'Мармелад': 0,
    'Зефир': 0,
    'Без сахара': 0,
    'Вегетарианское': 0,
    'Безглютеновое': 0,
  };

  /**
   * Ищет минимальное значение в массиве.
   *
   * @param  {array} goods - массив товаров
   * @return {number}      - минимальное значение
   */
  var getMinOfArray = function (goods) {
    var goodPrices = goods.map(function (good) {
      return good.price;
    });
    return Math.min.apply(null, goodPrices);
  };

  /**
   * Ищет максимальное значение в массиве.
   *
   * @param  {array} goods - массив товаров
   * @return {number}      - максимальное значение
   */
  var getMaxOfArray = function (goods) {
    var goodPrices = goods.map(function (good) {
      return good.price;
    });
    return Math.max.apply(null, goodPrices);
  };

  /**
   * Подсчет количества товаров, соответствующих фильтрам.
   *
   * @param  {object} good - описание товара
   */
  var calcFilterCounts = function (good) {
    if (good.kind === 'Мороженое') {
      ++filterNameToAmount['Мороженое'];
    }
    if (good.kind === 'Газировка') {
      ++filterNameToAmount['Газировка'];
    }
    if (good.kind === 'Жевательная резинка') {
      ++filterNameToAmount['Жевательная резинка'];
    }
    if (good.kind === 'Мармелад') {
      ++filterNameToAmount['Мармелад'];
    }
    if (good.kind === 'Зефир') {
      ++filterNameToAmount['Зефир'];
    }
    if (good.nutritionFacts.sugar === false) {
      ++filterNameToAmount['Без сахара'];
    }
    if (good.nutritionFacts.vegetarian === true) {
      ++filterNameToAmount['Вегетарианское'];
    }
    if (good.nutritionFacts.gluten === false) {
      ++filterNameToAmount['Безглютеновое'];
    }
  };

  /**
   * Рендерит количество товаров, соответствующих фильтрам.
   *
   * @param  {array} goods - массив товаров
   */
  var renderFilterCounts = function (goods) {
    var labels = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__label'));

    labels.forEach(function (label) {
      if (label.nextElementSibling) {
        var currentFilter = label.innerText;
        label.nextElementSibling.textContent = '(' + filterNameToAmount[currentFilter] + ')';
        if (currentFilter === 'Только избранное') {
          label.nextElementSibling.textContent = '(' + 0 + ')';
        }
        if (currentFilter === 'В наличии') {
          label.nextElementSibling.textContent = '(' + goods.length + ')';
        }
      }
    });

    rangeCountElement.textContent = '(' + goods.length + ')';
  };

  /**
   * Рендерит минимальную и максимальную стоимость на основе, полученных данных.
   *
   * @param  {array} goods - массив товаров
   */
  var renderRangeAmount = function (goods) {
    rangeMinElement.textContent = getMinOfArray(goods);
    rangeMaxElement.textContent = getMaxOfArray(goods);
    window.minValue = getMinOfArray(goods) - 5;
    window.maxValue = getMaxOfArray(goods);
  };

  /**
   * Обработчик при успешном выполнении запроса.
   *
   * @param  {array} goods - массив товаров
   */
  var successHandler = function (goods) {
    var filteredGoods = goods.filter(function (good) {
      return good.price > 0;
    });

    filteredGoods.forEach(function (good, i) {
      good.id = i;
      good.favorite = false;
      calcFilterCounts(good);
    });

    startIndex += goodInGroup;
    catalogCardsContainerElement.classList.remove('catalog__cards--load');
    renderCatalogCards(filteredGoods);
    if (filteredGoods.length >= goodInGroup) {
      showElement(showMoreButtonElement);
    }

    renderFilterCounts(filteredGoods);
    renderRangeAmount(filteredGoods);

    window.goodsInCatalog = filteredGoods;
  };

  /**
   * Обработчик при выполнении запроса с ошибкой.
   *
   * @param  {string} errorMessage - сообщение об ошибке
   */
  var errorHandler = function (errorMessage) {
    var loaderElement = document.querySelector('.catalog__load');
    loaderElement.style.display = 'none';
    throw new Error(errorMessage);
  };

  /**
   * Добавляет товар в избранное.
   *
   * @param {object} evt - объект event
   */
  var addCardToFavorites = function (evt) {
    if (!evt.target.classList.contains('card__btn-favorite')) {
      return;
    }
    evt.preventDefault();

    var target = evt.target;
    var targetClass = target.classList;
    var isFavorite = target.classList.contains('card__btn-favorite--selected');
    var id = parseInt(target.dataset.cardId, 10);
    var favoriteCountElement = document.querySelector('.input-btn__label[for="filter-favorite"]').nextElementSibling;

    if (!isFavorite) {
      window.goodsInCatalog[id].favorite = true;
      targetClass.add('card__btn-favorite--selected');
      favoriteCountElement.textContent = '(' + (parseInt(favoriteCountElement.textContent.slice(1, -1), 10) + 1) + ')';
    } else {
      window.goodsInCatalog[id].favorite = false;
      targetClass.remove('card__btn-favorite--selected');
      favoriteCountElement.textContent = '(' + (parseInt(favoriteCountElement.textContent.slice(1, -1), 10) - 1) + ')';
    }

    target.blur();
  };

  /**
   * Добавляет карточки товара в каталог группами (по умолчанию по 6 товаров).
   *
   * @param {array} goods  - массив товаров
   * @param {number} amount - количество товара в группе, которое необходимо отрендерить
   */
  var addCatalogCards = function (goods, amount) {
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

    catalogCardsContainerElement.insertBefore(fragment, showMoreButtonElement);
    startIndex += amount;
  };

  /**
   * Рендерит следующую группу товаров (по умолчанию 6шт.).
   *
   * @param  {object} evt - объект event
   */
  var showMoreCard = function (evt) {
    evt.preventDefault();
    addCatalogCards(window.goodsInCatalog, goodInGroup);
    if (document.querySelectorAll('.catalog__card').length === window.goodsInCatalog.length) {
      hideElement(showMoreButtonElement);
    }
    evt.target.blur();
  };

  renderEmptyBasket();
  backendApi.loadData(successHandler, errorHandler);
  blockFields(true);

  catalogCardsContainerElement.addEventListener('click', function (evt) {
    addCardToFavorites(evt);
  });

  catalogCardsContainerElement.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, addCardToFavorites);
  });

  showMoreButtonElement.addEventListener('click', function (evt) {
    showMoreCard(evt);
  });

  showMoreButtonElement.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, showMoreCard);
  });
})();
