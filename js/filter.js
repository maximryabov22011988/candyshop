'use strict';

(function () {
  var showElement = window.util.showElement;
  var hideElement = window.util.hideElement;
  var convertToArray = window.util.convertToArray;
  var debounce = window.debounce;
  var renderCatalogCard = window.render.renderCatalogCard;
  var renderCatalogCards = window.render.renderCatalogCards;

  var filterContainer = document.querySelector('.catalog__sidebar');
  var filterInputs = convertToArray(filterContainer.querySelector('input'));

  var catalogCardsContainer = document.querySelector('.catalog__cards');
  var showMoreGoodsButton = document.querySelector('.catalog__btn-more');
  var showAllButton = document.querySelector('.catalog__submit');

  var fragment = document.createDocumentFragment();

  var activeFilters = {
    kind: [],
    property: [],
    price: [],
    sort: ''
  };

  var resetFilters = function () {
    activeFilters.kind = [];
    activeFilters.property = [];
    activeFilters.price = [];
  };

  var removeCatalogCards = function () {
    while (catalogCardsContainer.firstChild) {
      catalogCardsContainer.removeChild(catalogCardsContainer.firstChild);
    }
  };

  var addCardToFragment = function (good, container) {
    container.appendChild(renderCatalogCard(good));
  };

  var uncheckInputs = function (inputs) {
    inputs.forEach(function (input) {
      input.checked = false;
    });
  };

  var checkedInputToggle = function (node) {
    var input = node.closest('.input-btn').querySelector('.input-btn__input');
    if (input.checked) {
      input.checked = false;
    } else {
      input.checked = true;
    }
  };

  var checkIfExistInFacts = function (currentFoodProperty) {
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

  var showAll = debounce(function (goodsData) {
    removeCatalogCards();
    resetFilters();
    uncheckInputs(filterInputs);
    renderCatalogCards(goodsData, goodsData.length);
    hideElement(showMoreGoodsButton);
  }, 500);

  var showEmptyFilters = function () {
    var emptyFilterTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');
    var emptyFilterElement = emptyFilterTemplate.cloneNode(true);
    removeCatalogCards();
    catalogCardsContainer.insertBefore(emptyFilterElement, showMoreGoodsButton);

    showAllButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      showAll(window.goodsInCatalog, window.goodsInCatalog.length);
    });
  };


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
      filterBySelected(evt, window.goodsInCatalog);
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

  filterContainer.addEventListener('click', manageFilters);

  filterContainer.addEventListener('mousedown', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'label') {
      evt.preventDefault();
    }
  });
})();






/*
(function () {
  var makeCounter = window.util.makeCounter;
  var convertToArray = window.util.convertToArray;
  var debounce = window.debounce;
  var renderCatalogCard = window.render.renderCatalogCard;
  var renderCatalogCards = window.render.renderCatalogCards;

  var filteredGoods = [];
  var filters = [];
  var isFiltered = false;

  var foodTypeFilterCounter = makeCounter();
  var foodPropertyFilterCounter = makeCounter();

  var filterContainer = document.querySelector('.catalog__sidebar');
  var catalogCardsListElement = document.querySelector('.catalog__cards');
  var showMoreGoodsButton = document.querySelector('.catalog__btn-more');
  var showAllCardButton = document.querySelector('.catalog__submit');

  var emptyFilterTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');

  var filterCounter = {
    'kind': {
      'icecream': makeCounter(),
      'soda': makeCounter(),
      'gum': makeCounter(),
      'marmalade': makeCounter(),
      'marshmallow': makeCounter()
    },
    'sugar-free': makeCounter(),
    'vegetarian': makeCounter(),
    'gluten-free': makeCounter(),
    'favorite': makeCounter(),
    'availability': makeCounter(),
  };

  var calcFilterItemAmount = function (goods) {
    goods.forEach(function (good) {
      switch (good.kind) {
        case 'Мороженое':
          filterCounter['kind']['icecream'].increment();
          break;
        case 'Газировка':
          filterCounter['kind']['soda'].increment();
          break;
        case 'Жевательная резинка':
          filterCounter['kind']['gum'].increment();
          break;
        case 'Мармелад':
          filterCounter['kind']['marmalade'].increment();
          break;
        case 'Зефир':
          filterCounter['kind']['marshmallow'].increment();
          break;
      }

      if (!good.nutritionFacts.sugar) {
        filterCounter['sugar-free'].increment();
      }

      if (good.nutritionFacts.vegetarian) {
        filterCounter['vegetarian'].increment();
      }

      if (!good.nutritionFacts.gluten) {
        filterCounter['gluten-free'].increment();
      }

      if (good.amount > 0) {
        filterCounter['availability'].increment();
      }
    });

    return {
      'icecream': filterCounter['kind']['icecream'].get(),
      'soda': filterCounter['kind']['soda'].get(),
      'gum': filterCounter['kind']['gum'].get(),
      'marmalade': filterCounter['kind']['marmalade'].get(),
      'marshmallows': filterCounter['kind']['marshmallow'].get(),
      'sugar-free': filterCounter['sugar-free'].get(),
      'vegetarian': filterCounter['vegetarian'].get(),
      'gluten-free': filterCounter['gluten-free'].get(),
      'favorite': filterCounter['favorite'].get(),
      'availability': filterCounter['availability'].get(),
    };
  };

  var renderFilterItemAmount = function (map) {
    for (var id in map) {
      if (map.hasOwnProperty(id)) {
        var amount = '(' + map[id] + ')';
        var parentElement = filterContainer.querySelector('#filter-' + id).parentElement;
        parentElement.querySelector('.input-btn__item-count').textContent = amount;
      }
    }
  };

  var renderEmptyFilter = function () {
    var emptyFilterElement = emptyFilterTemplate.cloneNode(true);
    emptyFilterElement.classList.add('visually-hidden');
    catalogCardsListElement.insertBefore(emptyFilterElement, showMoreGoodsButton);
  };

  var toggleEmptyFilter = function (isShow) {
    var emptyFilter = catalogCardsListElement.querySelector('.catalog__empty-filter');
    if (isShow) {
      emptyFilter.classList.remove('visually-hidden');
    } else {
      emptyFilter.classList.add('visually-hidden');
    }
  };

  var changeEmptyFilterText = function (title, text) {
    var emptyFilter = catalogCardsListElement.querySelector('.catalog__empty-filter');
    emptyFilter.querySelector('.empty-filter__title').textContent = title;
    emptyFilter.querySelector('.empty-filter__text').textContent = text;
  };

  var isCorrectGood = function (filter, good) {
    var isIceCream = filter === 'filter-icecream' && good.kind === 'Мороженое';
    var isSoda = filter === 'filter-soda' && good.kind === 'Газировка';
    var isGum = filter === 'filter-gum' && good.kind === 'Жевательная резинка';
    var isMarmalade = filter === 'filter-marmalade' && good.kind === 'Мармелад';
    var isMarshmallows = filter === 'filter-marshmallows' && good.kind === 'Зефир';
    var isSugarFree = filter === 'filter-sugar-free' && good.nutritionFacts.sugar === false;
    var isVegetarian = filter === 'filter-vegetarian' && good.nutritionFacts.vegetarian === true;
    var isGlutenFree = filter === 'filter-gluten-free' && good.nutritionFacts.gluten === false;
    var isAvailability = filter === 'filter-availability' && good.amount >= 1;
    var isFavorite = filter === 'filter-favorite' && good.favorite === true;

    if (!isIceCream && !isSoda && !isGum && !isMarmalade && !isMarshmallows && !isSugarFree && !isVegetarian && !isGlutenFree && !isAvailability && !isFavorite) {
      return false;
    }

    if (isIceCream || isSoda || isGum || isMarmalade || isMarshmallows || isSugarFree || isVegetarian || isGlutenFree || isAvailability || isFavorite) {
      return true;
    }

    return false;
  };

  var isCheckedInputs = function () {
    var inputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input'));
    return inputs.some(function (input) {
      return input.checked === true;
    });
  };

  var disableRangeToggle = function (isDisabled) {
    var rangeContainer = filterContainer.querySelector('.range');
    if (isDisabled) {
      rangeContainer.classList.add('range--disabled');
    } else {
      rangeContainer.classList.remove('range--disabled');
    }
  };

  var disableInputsToggle = function (isDisabled) {
    var inputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input'));
    inputs.forEach(function (input) {
      if (isDisabled) {
        input.disabled = true;
        input.nextElementSibling.classList.add('input-btn__label--disabled');
      } else {
        input.disabled = false;
        input.nextElementSibling.classList.remove('input-btn__label--disabled');
      }
    });
  };

  var disableInputsGroup = function (isDisabled, filterGroupName) {
    var filterInputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input'));
    filterInputs.forEach(function (input) {
      if (input.name === filterGroupName) {
        if (isDisabled) {
          input.disabled = true;
          input.nextElementSibling.classList.add('input-btn__label--disabled');
        } else {
          input.disabled = false;
          input.nextElementSibling.classList.remove('input-btn__label--disabled');
        }
      }
    });
  };

  var disableGroupInputsExcept = function (targetFilter, filterGroupName, isDisabled) {
    var filterInputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input'));
    filterInputs.forEach(function (input) {
      if (isDisabled) {
        if (input.name === filterGroupName && input.id !== targetFilter) {
          input.disabled = true;
          input.nextElementSibling.classList.add('input-btn__label--disabled');
        }
      } else {
        if (input.name === filterGroupName) {
          input.disabled = false;
          input.nextElementSibling.classList.remove('input-btn__label--disabled');
        }
      }
    });
  };

  var resetInputs = function (filterId) {
    var inputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input'));
    if (filterId) {
      inputs.forEach(function (input) {
        if (input.id !== filterId) {
          input.setAttribute('checked', false);
          input.checked = false;
        }
      });
    } else {
      inputs.forEach(function (input) {
        input.setAttribute('checked', false);
        input.checked = false;
      });
    }
  };

  var deleteCatalogCards = function () {
    var catalogCards = convertToArray(catalogCardsListElement.querySelectorAll('.catalog__card'));
    catalogCards.forEach(function (card) {
      catalogCardsListElement.removeChild(card);
    });
  };

  var updateCatalogCards = function (goods) {
    deleteCatalogCards();
    var fragment = document.createDocumentFragment();
    goods.forEach(function (good) {
      fragment.appendChild(renderCatalogCard(good, good.id, 'card--in-stock'));
    });
    catalogCardsListElement.insertBefore(fragment, showMoreGoodsButton);
  };

  var toggleFilter = debounce(function (evt) {
    var target = evt.target;
    var filterId = target.htmlFor;

    var isFoodTypeFilter = target.previousElementSibling.name === 'food-type';
    var isFoodPropertyFilter = target.previousElementSibling.name === 'food-property';

    var isAvailabilityFilter = filterId === 'filter-availability';
    var isFavoriteFilter = filterId === 'filter-favorite';

    var isChecked = target.previousElementSibling.checked;

    if (isFoodTypeFilter && isChecked) {
      foodTypeFilterCounter.increment();
    } else if (isFoodTypeFilter && !isChecked) {
      foodTypeFilterCounter.decrement();
    }

    if (isFoodPropertyFilter && isChecked) {
      foodPropertyFilterCounter.increment();
    } else if (isFoodPropertyFilter && !isChecked) {
      foodPropertyFilterCounter.decrement();
    }

    if (filters.indexOf(filterId) === -1) {
      filters.push(filterId);
    } else {
      filters.splice(filters.indexOf(filterId), 1);
    }

    if (isFoodTypeFilter) {
      filteredGoods.length = 0;

      filters.forEach(function (filter) {
        window.goodsInCatalog.filter(function (good) {
          if (isCorrectGood(filter, good)) {
            filteredGoods.push(good);
            return true;
          }
          return false;
        });
      });
      updateCatalogCards(filteredGoods);

      if (foodTypeFilterCounter.get() > 1) {
        return;
      }
    }

    if (filters.length === 1 && isFoodPropertyFilter) {
      if (foodPropertyFilterCounter.get() >= 1) {
        disableInputsGroup(true, 'food-type');
        disableRangeToggle(true);
      }

      filteredGoods.length = 0;
      filteredGoods = window.goodsInCatalog.filter(function (good) {
        return isCorrectGood(filters[0], good);
      });
      updateCatalogCards(filteredGoods);
    }

    if (isFavoriteFilter) {
      var favoriteAmount = parseInt(target.nextElementSibling.textContent.slice(1, -1), 10);
      filteredGoods.length = 0;

      if (isChecked) {
        resetInputs(filterId);
        disableGroupInputsExcept(filterId, 'mark', true);
        disableInputsGroup(true, 'food-type');
        disableInputsGroup(true, 'food-property');
        disableRangeToggle(true);
        disableInputsGroup(true, 'sort');

        filteredGoods = window.goodsInCatalog.filter(function (good) {
          return isCorrectGood(filterId, good);
        });
        updateCatalogCards(filteredGoods);
      }

      if (!isChecked) {
        filteredGoods.length = 0;
        filters.length = 0;
        disableInputsToggle();
        disableRangeToggle();
      }

      if (!favoriteAmount) {
        changeEmptyFilterText('Увы, пока ничего тебе не приглянулось.', 'Попробуй позже. Нажми «Показать всё», чтобы сбросить  фильтр.');
        toggleEmptyFilter(true);
      } else {
        toggleEmptyFilter();
      }

      return;
    }

    if (isAvailabilityFilter) {
      toggleEmptyFilter();

      if (isChecked) {
        resetInputs(filterId);
        disableGroupInputsExcept(filterId, 'mark', true);
        disableInputsGroup(true, 'food-type');
        disableInputsGroup(true, 'food-property');
        disableInputsGroup(true, 'sort');
        disableRangeToggle(true);
        filteredGoods = window.goodsInCatalog.filter(function (good) {
          return isCorrectGood(filterId, good);
        });
        updateCatalogCards(filteredGoods);
      }

      if (!isChecked) {
        filteredGoods.length = 0;
        filters.length = 0;
        disableInputsToggle();
        disableRangeToggle();
      }
    }

    if (filters.length >= 2 || foodTypeFilterCounter.get() >= 1 && foodPropertyFilterCounter.get() >= 0) {
      if (foodTypeFilterCounter.get() >= 1 && isFoodPropertyFilter && !isAvailabilityFilter && !isFavoriteFilter) {

        if (foodPropertyFilterCounter.get() === 1) {
          disableGroupInputsExcept(filterId, 'food-property', true);
          disableRangeToggle(true);
        } else {
          disableInputsGroup(false, 'food-property');
          disableRangeToggle();
        }

        if (foodPropertyFilterCounter.get() > 1) {
          evt.preventDefault();
          return;
        }

        var tempFilteredGoods = [];

        filteredGoods.forEach(function (good) {
          var correctCounter = 0;

          filters.forEach(function (filter) {
            if (filterId === 'filter-sugar-free' && filter === filterId && good.nutritionFacts.sugar === false ||
                filterId === 'filter-vegetarian' && filter === filterId && good.nutritionFacts.vegetarian === true ||
                filterId === 'filter-gluten-free' && filter === filterId && good.nutritionFacts.gluten === false) {
              correctCounter++;
            }
          });

          if (correctCounter === foodPropertyFilterCounter.get()) {
            tempFilteredGoods.push(good);
          }
        });
        updateCatalogCards(tempFilteredGoods);
      } else if (isFoodPropertyFilter) {
        if (foodPropertyFilterCounter.get() >= 1) {
          disableInputsGroup(true, 'food-type');
          disableRangeToggle(true);
        }

        filters.forEach(function (filter, it) {
          if (it === 0) {
            filteredGoods = window.goodsInCatalog.filter(function (good) {
              return isCorrectGood(filter, good);
            });
          } else {
            filteredGoods = filteredGoods.filter(function (good) {
              return isCorrectGood(filter, good);
            });
          }
        });
        updateCatalogCards(filteredGoods);
      }

      if (isCheckedInputs() && catalogCardsListElement.querySelectorAll('.catalog__card').length === 0) {
        changeEmptyFilterText('Хм... Что-то ты перемудрил с фильтрами.', 'Попробуй ещё раз. Нажми «Показать всё», чтобы сбросить все фильтры.');
        toggleEmptyFilter(true);
        resetInputs();
        disableInputsToggle(true);
        disableRangeToggle(true);
        return;
      }
    }

    if (isCheckedInputs()) {
      isFiltered = true;
      toggleEmptyFilter();
    }

    if (!isCheckedInputs()) {
      filteredGoods.length = 0;
      filters.length = 0;
      isFiltered = false;
      disableInputsGroup(false, 'food-type');
      disableRangeToggle();
      deleteCatalogCards();
      showMoreGoodsButton.classList.add('visually-hidden');
      changeEmptyFilterText('Ты не выбрал не одного фильтра ...', 'Попробуй еще раз. Нажми на подходящий фильтр или «Показать всё». Вдруг что-то придется тебе по душе');
      toggleEmptyFilter(true);
    }
  }, 100);

  var manageFilter = function (evt, filterFunc) {
    if (evt.target.tagName.toLowerCase() !== 'label') {
      return;
    }

    if (!isFiltered) {
      deleteCatalogCards();
      showMoreGoodsButton.classList.add('visually-hidden');
    }

    filterFunc(evt);
  };

  filterContainer.addEventListener('click', function (evt) {
    manageFilter(evt, toggleFilter);
  });

  filterContainer.addEventListener('mousedown', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'label') {
      evt.preventDefault();
    }
  });

  showAllCardButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    filteredGoods.length = 0;
    filters.length = 0;

    foodTypeFilterCounter.reset();
    foodPropertyFilterCounter.reset();

    toggleEmptyFilter();
    resetInputs();
    disableInputsToggle();
    disableRangeToggle();
    deleteCatalogCards();

    renderCatalogCards(window.goodsInCatalog, window.goodsInCatalog.length);
    showMoreGoodsButton.classList.add('visually-hidden');
  });

  window.filter = {
    calcFilterItemAmount: calcFilterItemAmount,
    renderFilterItemAmount: renderFilterItemAmount,
    renderEmptyFilter: renderEmptyFilter
  };
})();
*/
