'use strict';

(function () {
  var KEYCODE = window.util.KEYCODE;
  var hideElement = window.util.hideElement;
  var convertToArray = window.util.convertToArray;
  var debounce = window.debounce;
  var renderCatalogCard = window.render.renderCatalogCard;
  var renderCatalogCards = window.render.renderCatalogCards;


  var filterContainerElement = document.querySelector('.catalog__sidebar');
  var fieldsElements = convertToArray(filterContainerElement.querySelectorAll('input'));

  var rangeContainerElement = document.querySelector('.range');
  var rangeCountElement = document.querySelector('.range__count');
  var rangeControlElement = rangeContainerElement.querySelector('.range__filter');
  var leftPinElement = rangeContainerElement.querySelector('.range__btn--left');
  var rightPinElement = rangeContainerElement.querySelector('.range__btn--right');
  var rangeLineElement = rangeContainerElement.querySelector('.range__fill-line');
  var rangeMinElement = rangeContainerElement.querySelector('.range__price--min');
  var rangeMaxElement = rangeContainerElement.querySelector('.range__price--max');
  var rangeControlWidth = rangeControlElement.offsetWidth;
  var pinWidth = rightPinElement.offsetWidth;

  var catalogCardsContainerElement = document.querySelector('.catalog__cards');
  var showMoreButtonElement = document.querySelector('.catalog__btn-more');
  var showAllButtonElement = document.querySelector('.catalog__submit');

  var fragment = document.createDocumentFragment();

  var activeFilters = {
    kind: [],
    property: [],
    price: [],
    sort: ''
  };

  var MIN = 0;
  var MAX = 1;

  /**
   * Сбрасывает все фильтры.
   */
  var resetFilters = function () {
    activeFilters.kind = [];
    activeFilters.property = [];
    activeFilters.price = [];
  };

  /**
   * Удаляет все карточки из каталога.
   */
  var removeCatalogCards = function () {
    while (catalogCardsContainerElement.firstChild) {
      catalogCardsContainerElement.removeChild(catalogCardsContainerElement.firstChild);
    }
  };

  /**
   * Добавляет карточки в контейнер.
   *
   * @param {DOM} good      - карточка товара
   * @param {DOM} container - контейнер для карточек
   */
  var addCardToFragment = function (good, container) {
    container.appendChild(renderCatalogCard(good));
  };

  /**
   * Снимает атрибут "checked" у полей.
   *
   * @param  {array} inputs - массив DOM-элементов
   */
  var uncheckInputs = function (inputs) {
    inputs.forEach(function (input) {
      input.checked = false;
    });
  };

  /**
   * Устанавливает / снимает атрибут "checked" у поля.

   * @param  {DOM} elem - поле, у которого нужно переключить атрибут "checked"
   */
  var checkedInputToggle = function (elem) {
    var parentElem = elem.closest('.input-btn');
    var input = parentElem.querySelector('.input-btn__input');
    if (input.checked) {
      input.checked = false;
    } else {
      input.checked = true;
    }
  };

  /**
   * Проверяет соответствие товара фильтру по составу.
   *
   * @param  {string} currentFoodProperty - текущий фильтр
   * @return {boolean}                    - true / false
   */
  var checkIfExistInProperty = function (currentFoodProperty) {
    var isSugarActive = activeFilters.property.indexOf('sugar') !== -1;
    var isVeganActive = activeFilters.property.indexOf('vegetarian') !== -1;
    var isGlutenActive = activeFilters.property.indexOf('gluten') !== -1;
    var isSugar = isSugarActive && !currentFoodProperty.sugar;
    var isVegan = isVeganActive && currentFoodProperty.vegetarian;
    var isGluten = isGlutenActive && !currentFoodProperty.gluten;

    return (
      (!isGlutenActive || isGluten) &&
      (!isSugarActive || isSugar) &&
      (!isVeganActive || isVegan)
    );
  };

  /**
   * Возвращает соответствующее свойство товара.
   *
   * @param  {string} targetText - текущее название фильтра по составу
   * @return {string}            - соответствующее свойство
   */
  var getPropertyName = function (targetText) {
    if (targetText === 'Без сахара') {
      return 'sugar';
    } else if (targetText === 'Вегетарианское') {
      return 'vegetarian';
    } else if (targetText === 'Безглютеновое') {
      return 'gluten';
    }
    return '';
  };

  /**
   * Сортирует товары в каталоге.
   *
   * @param  {object} evt  - объект event
   * @param  {array} goods - массив товаров
   */
  var sort = debounce(function (evt, goods) {
    var target = evt.target.innerText;
    checkedInputToggle(evt.target);

    if (activeFilters.sort.length === 0 || (activeFilters.sort.length === 0 && activeFilters.sort.indexOf(target) === -1)) {
      activeFilters.sort = target;
    } else if (activeFilters.sort.length > 0 && activeFilters.sort.indexOf(target) !== -1) {
      activeFilters.sort = '';
    } else if (activeFilters.sort.length > 0) {
      activeFilters.sort = '';
      activeFilters.sort = target;
    }

    removeCatalogCards();
    applyFilters(goods);
  });

  /**
   * Задает функцию сортировки для каждого типа.
   *
   * @param  {array} goods - список товаров
   */
  var sortGoods = function (goods) {
    if (activeFilters.sort === 'Сначала дорогие') {
      goods.sort(function (first, second) {
        if (first.price < second.price) {
          return 1;
        } else if (first.price > second.price) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    if (activeFilters.sort === 'Сначала дешёвые') {
      goods.sort(function (first, second) {
        if (first.price > second.price) {
          return 1;
        } else if (first.price < second.price) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    if (activeFilters.sort === 'По рейтингу') {
      goods.sort(function (first, second) {
        if (first.rating.value > second.rating.value) {
          return -1;
        } else if (first.rating.value < second.rating.value) {
          return 1;
        } else if (first.rating.value === second.rating.value && first.rating.number > second.rating.number) {
          return -1;
        } else if (first.rating.value === second.rating.value && first.rating.number < second.rating.number) {
          return 1;
        }
        return 0;
      });
    }

    if (activeFilters.sort === 'Сначала популярные') {
      return goods;
    }

    return '';
  };

  /**
   * Применяет выбранные фильтры к товарам.
   *
   * @param  {array} goods - массив товаров
   */
  var applyFilters = function (goods) {
    var filteredGoods = [];

    goods.forEach(function (good) {
      var isEmptyKind = activeFilters.kind.length === 0;
      var isExistInKind = !isEmptyKind && activeFilters.kind.indexOf(good.kind) !== -1;

      var isEmptyProperty = activeFilters.property.length === 0;
      var isExistInProperty = !isEmptyProperty && checkIfExistInProperty(good.nutritionFacts);

      var isEmptyPrice = activeFilters.price.length === 0;
      var isExistPrice = !isEmptyPrice && (good.price <= activeFilters.price[MAX] && good.price >= activeFilters.price[MIN]);

      var isEmptySort = activeFilters.sort.length === 0;
      var isExistSort = !isEmptySort;

      if ((isEmptyKind || isExistInKind) && (isEmptyProperty || isExistInProperty) && (isEmptyPrice || isExistPrice) && (isExistSort || isEmptySort)
      ) {
        filteredGoods.push(good);
      }
    });

    sortGoods(filteredGoods);

    filteredGoods.forEach(function (good) {
      addCardToFragment(good, fragment);
    });
    catalogCardsContainerElement.appendChild(fragment);

    rangeCountElement.textContent = '(' + filteredGoods.length + ')';
    if (filteredGoods.length === 0) {
      showEmptyFilters();
    }
  };

  /**
   * Фильтрует товары по типу.
   *
   * @param  {object} evt  - объект event
   * @param  {array} goods - список товаров
   */
  var filterByKind = debounce(function (evt, goods) {
    if (!evt.target.classList.contains('input-btn__label')) {
      return;
    }

    var target = evt.target;
    var targetKind = target.innerText;

    checkedInputToggle(target);

    if (activeFilters.kind.length === 0) {
      activeFilters.kind.push(targetKind);
    } else if (activeFilters.kind.length === 1 && activeFilters.kind.indexOf(targetKind) !== -1) {
      activeFilters.kind = [];
    } else if (activeFilters.kind.length > 1 && activeFilters.kind.indexOf(targetKind) !== -1) {
      activeFilters.kind = activeFilters.kind.filter(function (kind) {
        return kind !== targetKind;
      });
    } else if (activeFilters.kind.length > 0 && activeFilters.kind.indexOf(targetKind) === -1) {
      activeFilters.kind.push(targetKind);
    }

    removeCatalogCards();
    applyFilters(goods);
  });

  /**
   * Фильтрует товары по составу.
   *
   * @param  {object} evt  - объект event
   * @param  {array} goods - список товаров
   */
  var filterByProperty = debounce(function (evt, goods) {
    if (!target.classList.contains('input-btn__label')) {
      return;
    }

    var target = evt.target;
    var targetGoodProperty = getPropertyName(evt.target.innerText);

    checkedInputToggle(target);

    if (activeFilters.property.length === 0) {
      activeFilters.property.push(targetGoodProperty);
    } else if (activeFilters.property.indexOf(targetGoodProperty) !== -1 && activeFilters.property.length === 1) {
      activeFilters.property = [];
    } else if (activeFilters.property.indexOf(targetGoodProperty) !== -1 && activeFilters.property.length > 1) {
      activeFilters.property = activeFilters.property.filter(function (item) {
        return item !== targetGoodProperty;
      });
    } else if (activeFilters.property.indexOf(targetGoodProperty) === -1 && activeFilters.property.length > 0) {
      activeFilters.property.push(targetGoodProperty);
    }

    removeCatalogCards();
    applyFilters(goods);
  });

  /**
   * Фильтрует товары по наличию.
   *
   * @param  {object} evt  - объект event
   * @param  {array} goods - список товаров
   */
  var filterByAvailability = debounce(function (evt, goods) {
    removeCatalogCards();
    uncheckInputs(fieldsElements);
    checkedInputToggle(evt.target);
    resetFilters();

    goods.forEach(function (good) {
      if (good.amount > 0) {
        addCardToFragment(good, fragment);
      }
    });
    catalogCardsContainerElement.appendChild(fragment);

    if ((catalogCardsContainerElement.querySelectorAll('.catalog__card')).length === 0) {
      showEmptyFilters();
    }
  });

  /**
   * Фильтрует товары, отмеченные как избранные.
   *
   * @param  {object} evt  - объект event
   * @param  {array} goods - список товаров
   */
  var filterByFavorites = debounce(function (evt, goods) {
    removeCatalogCards();
    uncheckInputs(fieldsElements);
    checkedInputToggle(evt.target);
    resetFilters();

    goods.forEach(function (good) {
      if (good.favorite === true) {
        addCardToFragment(good, fragment);
      }
    });
    catalogCardsContainerElement.appendChild(fragment);

    if ((catalogCardsContainerElement.querySelectorAll('.catalog__card')).length === 0) {
      showEmptyFilters();
    }
  });

  /**
   * Фильтрует товары по диапазону цен.
   *
   * @param  {array} goods - список товаров
   */
  var filterByPrice = debounce(function (goods) {
    if (activeFilters.price.length === 0) {
      activeFilters.price.push(rangeMinElement.innerText, rangeMaxElement.innerText);
    } else if (activeFilters.price.length > 0) {
      activeFilters.price = [];
      activeFilters.price.push(rangeMinElement.innerText, rangeMaxElement.innerText);
    }

    removeCatalogCards();
    applyFilters(goods);
  });

  /**
   * Сбрасывает все фильтры и показывает все товары.
   *
   * @param  {array}  goods - массива товаров
   */
  var showAll = debounce(function (goods) {
    removeCatalogCards();
    resetFilters();
    uncheckInputs(fieldsElements);
    renderCatalogCards(goods, goods.length);
  });

  /**
   * Показывает элемент-заглушку, в случае если ни один из товаров не соответствует фильтру.
   */
  var showEmptyFilters = function () {
    var emptyFilterTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
    var emptyFilterElement = emptyFilterTemplate.cloneNode(true);
    removeCatalogCards();
    hideElement(showMoreButtonElement);
    catalogCardsContainerElement.appendChild(emptyFilterElement);

    showAllButtonElement.addEventListener('click', function (evt) {
      evt.preventDefault();
      showAll(window.goodsInCatalog, window.goodsInCatalog.length);
    });
  };

  /**
   * Управляет фильтрами товаров.
   *
   * @param  {object} evt  - объект event
   */
  var manageFilters = function (evt) {
    evt.preventDefault();
    var target = evt.target.innerText;

    if (target === 'Мороженое' || target === 'Газировка' || target === 'Жевательная резинка' || target === 'Мармелад' || target === 'Зефир') {
      filterByKind(evt, window.goodsInCatalog);
    } else if (target === 'Без сахара') {
      filterByProperty(evt, window.goodsInCatalog, 'sugar');
    } else if (target === 'Безглютеновое') {
      filterByProperty(evt, window.goodsInCatalog, 'gluten');
    } else if (target === 'Вегетарианское') {
      filterByProperty(evt, window.goodsInCatalog, 'vegetarian');
    } else if (target === 'В наличии') {
      filterByAvailability(evt, window.goodsInCatalog);
    } else if (target === 'Только избранное') {
      filterByFavorites(evt, window.goodsInCatalog);
    } else if (target === 'Показать всё') {
      showAll(window.goodsInCatalog);
    } else if (target === 'Сначала популярные') {
      sort(evt, window.goodsInCatalog);
    } else if (target === 'Сначала дорогие') {
      sort(evt, window.goodsInCatalog);
    } else if (target === 'Сначала дешёвые') {
      sort(evt, window.goodsInCatalog);
    } else if (target === 'По рейтингу') {
      sort(evt, window.goodsInCatalog);
    }
  };

  filterContainerElement.addEventListener('click', function (evt) {
    manageFilters(evt);
  });

  filterContainerElement.addEventListener('mousedown', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'label') {
      evt.preventDefault();
    }
  });

  /**
   * Рассчитывает цену при перемещении pin.
   *
   * @param  {number} moveX      - новое положение pin
   * @param  {number} startX     - начальное положение pin
   * @param  {boolean} isleftPin - флаг, в случае если левый pin
   * @return {number}            - цена, соответствующая новому положению pin
   */
  var calcPrice = function (moveX, startX, isleftPin) {
    var priceDiff = Math.floor((Math.abs(moveX - startX) / rangeControlWidth) * (window.maxValue - window.minValue));
    return isleftPin ? (window.maxValue - priceDiff) : (window.minValue + priceDiff);
  };

  /**
   * Перемещает pin.
   *
   * @param  {number}  newX      - новое положение pin
   * @param  {number}  leftEdge  - крайнее левое положение
   * @param  {number}  rightEdge - крайнее правое положение
   * @param  {boolean} isLeftPin - флаг, в случае если левый pin
   */
  var movePinTo = function (newX, leftEdge, rightEdge, isLeftPin) {
    if (newX < leftEdge) {
      newX = leftEdge;
    }

    if (newX > rightEdge) {
      newX = rightEdge;
    }

    if (isLeftPin) {
      leftPinElement.style.left = newX + 'px';
      rangeLineElement.style.left = newX + 'px';
      rangeMinElement.textContent = calcPrice(newX, rangeControlWidth, isLeftPin) + 5;
    } else {
      rightPinElement.style.right = newX + 'px';
      rangeLineElement.style.right = newX + 'px';
      rangeMaxElement.textContent = calcPrice(newX, rangeControlWidth);
    }
  };

  rangeControlElement.addEventListener('mousedown', function (evt) {
    if (!evt.target.classList.contains('range__btn') || evt.which !== KEYCODE['LEFT_MOUSE_BUTTON']) {
      return;
    }
    evt.preventDefault();

    var isLeftPin = evt.target.classList.contains('range__btn--left');
    var isRightPin = evt.target.classList.contains('range__btn--right');

    var pinCoords = {
      leftPinElement: {
        startX: leftPinElement.offsetLeft
      },
      rightPinElement: {
        startX: rightPinElement.offsetLeft
      }
    };

    var moveRangeButton = function (moveEvt) {
      var newX;
      if (isLeftPin) {
        newX = pinCoords.leftPinElement.startX + (moveEvt.clientX - evt.clientX);
        movePinTo(newX, 0, (pinCoords.rightPinElement.startX - pinWidth), isLeftPin);
      }
      if (isRightPin) {
        newX = rangeControlWidth - pinCoords.rightPinElement.startX - (moveEvt.clientX - evt.clientX);
        movePinTo(newX, 0, (rangeControlWidth - (pinCoords.leftPinElement.startX + pinWidth * 2)));
      }
      filterByPrice(window.goodsInCatalog);
    };

    var fixRangeButton = function () {
      document.removeEventListener('mousemove', moveRangeButton);
      document.removeEventListener('mouseup', fixRangeButton);
    };

    document.addEventListener('mousemove', moveRangeButton);
    document.addEventListener('mouseup', fixRangeButton);
  });
})();
