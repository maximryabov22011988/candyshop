'use strict';

(function () {
  var makeCounter = window.util.makeCounter;
  var convertToArray = window.util.convertToArray;
  var debounce = window.debounce;
  var renderCatalogCard = window.render.renderCatalogCard;
  var renderCatalogCards = window.render.renderCatalogCards;

  var filteredGoods = [];
  var filters = [];
  var isFiltered = false;

  var filterContainer = document.querySelector('.catalog__sidebar');
  var catalogCardsListElement = document.querySelector('.catalog__cards');
  var moreGoodsButton = document.querySelector('.catalog__btn-more');
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
          filterCounter['kind']['icecream']();
          break;
        case 'Газировка':
          filterCounter['kind']['soda']();
          break;
        case 'Жевательная резинка':
          filterCounter['kind']['gum']();
          break;
        case 'Мармелад':
          filterCounter['kind']['marmalade']();
          break;
        case 'Зефир':
          filterCounter['kind']['marshmallow']();
          break;
      }

      if (!good.nutritionFacts.sugar) {
        filterCounter['sugar-free']();
      }

      if (good.nutritionFacts.vegetarian) {
        filterCounter['vegetarian']();
      }

      if (!good.nutritionFacts.gluten) {
        filterCounter['gluten-free']();
      }

      if (good.amount > 0) {
        filterCounter['availability']();
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

  var hideEmptyFilter = function (hide) {
    var emptyFilter = catalogCardsListElement.querySelector('.catalog__empty-filter');
    if (emptyFilter) {
      if (hide) {
        emptyFilter.classList.add('visually-hidden');
      } else {
        emptyFilter.classList.remove('visually-hidden');
      }
    }
  };

  var renderEmptyFilter = function () {
    var emptyFilter = catalogCardsListElement.querySelector('.catalog__empty-filter');
    if (!emptyFilter) {
      var emptyFilterElement = emptyFilterTemplate.cloneNode(true);
      catalogCardsListElement.insertBefore(emptyFilterElement, moreGoodsButton);
    } else {
      hideEmptyFilter(false);
    }
  };

  var filterGood = function (filter, good) {
    var isIceCream = filter === 'filter-icecream' && good.kind === 'Мороженое';
    var isSoda = filter === 'filter-soda' && good.kind === 'Газировка';
    var isGum = filter === 'filter-gum' && good.kind === 'Жевательная резинка';
    var isMarmalade = filter === 'filter-marmalade' && good.kind === 'Мармелад';
    var isMarshmallows = filter === 'filter-marshmallows' && good.kind === 'Зефир';
    var isSugarFree = filter === 'filter-sugar-free' && good.nutritionFacts.sugar === false;
    var isVegetarian = filter === 'filter-vegetarian' && good.nutritionFacts.vegetarian === true;
    var isGlutenFree = filter === 'filter-gluten-free' && good.nutritionFacts.gluten === false;

    if (!isIceCream && !isSoda && !isGum && !isMarmalade && !isMarshmallows && !isSugarFree && !isVegetarian && !isGlutenFree) {
      return false;
    }

    if (isIceCream) {
      return true;
    }
    if (isSoda) {
      return true;
    }
    if (isGum) {
      return true;
    }
    if (isMarmalade) {
      return true;
    }
    if (isMarshmallows) {
      return true;
    }
    if (isSugarFree) {
      return true;
    }
    if (isVegetarian) {
      return true;
    }
    if (isGlutenFree) {
      return true;
    }

    return false;
  };

  var resetKindFilters = function (selectedFilters) {
    var inputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input[name="food-type"]'));
    var kindFilters = inputs.map(function (input) {
      return input.id;
    });

    for (var i = 0; i < selectedFilters.length; i++) {
      for (var j = 0; j < kindFilters.length; j++) {
        if (selectedFilters[i] === kindFilters[j]) {
          selectedFilters.splice(i, 1);

          if (selectedFilters.length === 0) {
            break;
          }
        }
      }
    }

    return selectedFilters;
  };

  var resetFilters = function () {
    var filterInputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input'));
    filterInputs.forEach(function (input) {
      input.setAttribute('checked', false);
      input.checked = false;
    });

    renderCatalogCards(window.goodsInCatalog);
    moreGoodsButton.classList.remove('visually-hidden');

    isFiltered = false;
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
    catalogCardsListElement.insertBefore(fragment, moreGoodsButton);
  };

  var toggleFilter = debounce(function (evt) {
    var target = evt.target;
    var id = target.htmlFor;

    if (target.previousElementSibling.name === 'food-type') {
      filters = resetKindFilters(filters);
    }

    if (filters.indexOf(id) === -1) {
      filters.push(id);
    } else {
      filters.splice(filters.indexOf(id), 1);
    }

    if (filters.length > 0 && filters.length < 2) {
      filteredGoods = window.goodsInCatalog.filter(function (good) {
        return filterGood(filters[0], good);
      });
      updateCatalogCards(filteredGoods);
    }

    if (filters.length >= 2) {
      filters.forEach(function (filter, it) {
        if (it === 0) {
          filteredGoods = window.goodsInCatalog.filter(function (good) {
            return filterGood(filter, good);
          });
        } else {
          filteredGoods = filteredGoods.filter(function (good) {
            return filterGood(filter, good);
          });
        }
      });
      updateCatalogCards(filteredGoods);
    }

    if (filters.length && filteredGoods.length === 0) {
      renderEmptyFilter();
    } else if (filteredGoods.length > 0) {
      hideEmptyFilter(true);
    }
  }, 300);

  var manageFilter = function (evt, filterFunc) {
    if (evt.target.tagName.toLowerCase() !== 'label') {
      return;
    }

    if (!isFiltered) {
      deleteCatalogCards();
      moreGoodsButton.classList.add('visually-hidden');
    }

    filterFunc(evt);
  };

  showAllCardButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    filteredGoods.length = 0;
    filters.length = 0;
    hideEmptyFilter(true);
    deleteCatalogCards();
    resetFilters();
  });

  filterContainer.addEventListener('click', function (evt) {
    manageFilter(evt, toggleFilter);
  });

  filterContainer.addEventListener('mousedown', function (evt) {
    if (evt.target.tagName.toLowerCase() !== 'label') {
      return;
    }

    evt.preventDefault();
  });

  window.filter = {
    calcFilterItemAmount: calcFilterItemAmount,
    renderFilterItemAmount: renderFilterItemAmount
  };
})();
