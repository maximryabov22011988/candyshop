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
  var favoriteCounter = document.querySelector('.input-btn__label[for="filter-favorite"]').nextElementSibling;
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

  var renderEmptyFilter = function (title, text) {
    var emptyFilter = catalogCardsListElement.querySelector('.catalog__empty-filter');
    if (!emptyFilter) {
      var emptyFilterElement = emptyFilterTemplate.cloneNode(true);
      if (title) {
        emptyFilterElement.querySelector('.empty-filter__title').textContent = title;
      }
      if (text) {
        emptyFilterElement.querySelector('.empty-filter__text').textContent = text;
      }
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
    var isAvailability = filter === 'filter-availability' && good.amount >= 1;
    var isFavorite = filter === 'filter-favorite' && good.favorite === true;

    if (!isIceCream && !isSoda && !isGum && !isMarmalade && !isMarshmallows && !isSugarFree && !isVegetarian && !isGlutenFree && !isAvailability  && !isFavorite) {
      return false;
    }

    if (isAvailability) {
      return true;
    }

    if (isFavorite) {
      return true;
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


  // var checkFilterInputs = function () {
  //   var filterInputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input[checked="true"]'));
  //   return filterInputs.some(function (input) {
  //     return input.checked === true;
  //   });
  // };

  var disableFilterInputs = function (isDisabled) {
    var filterInputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input'));
    filterInputs.forEach(function (input) {
      if (input.name !== 'mark' && input.name !== 'sort') {
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

  var resetFilterInputs = function (filterId) {
    var filterInputs = convertToArray(document.querySelectorAll('.catalog__filter .input-btn__input'));
    if (filterId) {
      filterInputs.forEach(function (input) {
        if (input.id !== filterId) {
          input.setAttribute('checked', false);
          input.checked = false;
        }
      });
    } else {
      filterInputs.forEach(function (input) {
        input.setAttribute('checked', false);
        input.checked = false;
      });
    }
  };

  var resetFavoriteClass = function () {
    var favoriteButtons = convertToArray(document.querySelectorAll('.card__btn-favorite--selected'));
    favoriteButtons.forEach(function (button) {
      button.classList.remove('card__btn-favorite--selected');
    });
  };

  var deleteCatalogCards = function () {
    var catalogCards = convertToArray(catalogCardsListElement.querySelectorAll('.catalog__card'));
    catalogCards.forEach(function (card) {
      catalogCardsListElement.removeChild(card);
    });
  };

  var showUnfilteredCards = function () {
    deleteCatalogCards();
    renderCatalogCards(window.goodsInCatalog);
    moreGoodsButton.classList.remove('visually-hidden');
    isFiltered = false;
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
    var filterId = target.htmlFor;
    var isKindFilter = target.previousElementSibling.name === 'food-type';
    var isAvailabilityFilter = filterId === 'filter-availability';
    var isFavoriteFilter = filterId === 'filter-favorite';
    var isChecked = target.previousElementSibling.checked;

    if (filters.indexOf(filterId) === -1) {
      filters.push(filterId);
    } else {
      filters.splice(filters.indexOf(filterId), 1);
    }

    if (isKindFilter) {
      filteredGoods.length = 0;

      filters.forEach(function (filter) {
        window.goodsInCatalog.filter(function (good) {
          var isCorrect = filterGood(filter, good);
          if (isCorrect) {
            filteredGoods.push(good);
            return true;
          }
          return false;
        });
      });
      updateCatalogCards(filteredGoods);
      isFiltered = true;

      if (filters.length === 0 || filteredGoods.length === 0) {
        showUnfilteredCards();
      }
      return;
    }

    if (isAvailabilityFilter) {
      hideEmptyFilter(true);
      if (isChecked) {
        resetFilterInputs(filterId);
        disableFilterInputs(true);

        filteredGoods = window.goodsInCatalog.filter(function (good) {
          var isCorrect = filterGood(filterId, good);
          return isCorrect ? true : false;
        });

        updateCatalogCards(filteredGoods);
        isFiltered = true;
      } else {
        filteredGoods.length = 0;
        filters.length = 0;
        isFiltered = false;
        disableFilterInputs(false);
        showUnfilteredCards();
        return;
      }
    }

    if (isFavoriteFilter) {
      if (isChecked) {
        resetFilterInputs(filterId);
        disableFilterInputs(true);

        filteredGoods = window.goodsInCatalog.filter(function (good) {
          var isCorrect = filterGood(filterId, good);
          return isCorrect ? true : false;
        });

        updateCatalogCards(filteredGoods);
        isFiltered = true;
      } else {
        filteredGoods.length = 0;
        filters.length = 0;
        isFiltered = false;
        disableFilterInputs(false);
      }

      if (favoriteCounter.textContent.slice(1, -1) === '0') {
        renderEmptyFilter('Увы, но тебя пока ничего не зацепило ...', 'Попробуй позже. Нажми «Показать всё», чтобы сбросить фильтр.');
      }
      return;
    }

    if (filters.length === 1) {
      filteredGoods = window.goodsInCatalog.filter(function (good) {
        var isCorrect = filterGood(filters[0], good);
        return isCorrect ? true : false;
      });
      updateCatalogCards(filteredGoods);
      isFiltered = true;
    } else if (filters.length === 0) {
      showUnfilteredCards();
    }

    if (filters.length >= 2) {
      //
      updateCatalogCards(filteredGoods);
      isFiltered = true;
    }

    if (filters.length === 0 && filteredGoods.length === 0) {
      showUnfilteredCards();
    } else if (filters.length > 0 && filteredGoods.length === 0) {
      renderEmptyFilter();
    }
/*
    if (!isAvailabilityFilter && !isFavoriteFilter) {
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
 */
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
    window.favoriteGoods = {};

    hideEmptyFilter(true);
    resetFilterInputs();
    disableFilterInputs(false);
    deleteCatalogCards();
    renderCatalogCards(window.goodsInCatalog, window.goodsInCatalog.length);
    moreGoodsButton.classList.add('visually-hidden');

    resetFavoriteClass();
    favoriteCounter.textContent = '(0)';
  });

  filterContainer.addEventListener('click', function (evt) {
    manageFilter(evt, toggleFilter);
  });

  filterContainer.addEventListener('mousedown', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'label') {
      evt.preventDefault();
    }
  });

  window.filter = {
    calcFilterItemAmount: calcFilterItemAmount,
    renderFilterItemAmount: renderFilterItemAmount
  };
})();
