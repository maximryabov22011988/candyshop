'use strict';

(function () {
  var KEYCODE = window.util.KEYCODE;
  var isEnterEvent = window.util.isEnterEvent;
  var deepCopy = window.util.deepCopy;
  var showElement = window.util.showElement;
  var hideElement = window.util.hideElement;
  var renderBasketCard = window.render.renderBasketCard;
  var blockFields = window.order.blockFields;

  var goodsInBasket = {};

  var catalogCardsContainer = document.querySelector('.catalog__cards');
  var basketCardsContainer = document.querySelector('.goods__cards');

  var getCorrectWord = function (number) {
    var word = 'товар';
    var wordEnds = ['а', 'ов'];

    if ((number >= 2 && number <= 4) ||
        (number > 20 && number % 10 >= 2 && number % 10 <= 4)) {
      word = word + wordEnds[0];
    } else if ((number >= 5 && number <= 11) ||
               (number % 10 === 0 || number % 10 >= 2 && number % 10 <= 4) ||
               (number % 10 >= 5 && number % 10 <= 9)) {
      word = word + wordEnds[1];
    }

    return word;
  };

  var getGoodAmountInBasket = function () {
    return Object.keys(goodsInBasket).length;
  };

  var searchGoodInBasket = function (id) {
    var isFound = false;

    for (var goodId in goodsInBasket) {
      if (parseInt(goodId, 10) === id) {
        isFound = true;
        break;
      }
    }

    return isFound;
  };

  var changeDataValue = function (data, id, change, property) {
    for (var key in data) {
      if (parseInt(key, 10) === id) {
        if (change === 'increase') {
          data[key][property] += 1;
          break;
        } else if (change === 'decrease') {
          data[key][property] -= 1;
          break;
        }
      }
    }
  };

  var cloneGood = function (selectedGood) {
    var goodClone = deepCopy(selectedGood);
    goodClone.orderedAmount = 0;

    return goodClone;
  };

  var getBasketCardElement = function (className, id) {
    return basketCardsContainer.querySelector('.' + className + '[data-card-id="' + id + '"]');
  };

  var getCatalogCardElement = function (className, id) {
    return catalogCardsContainer.querySelector('.' + className + '[data-card-id="' + id + '"]');
  };

  var addBasketCard = function (good, id) {
    basketCardsContainer.appendChild(renderBasketCard(good, id));
  };

  var deleteBasketCard = function (id) {
    basketCardsContainer.removeChild(getBasketCardElement('card-order', id));
    delete goodsInBasket[id];
  };

  var blockAddGoodButtonInBasket = function (id, disabled) {
    if (getCatalogCardElement('card__btn', id).classList.contains('card__btn--disabled')) {
      getCatalogCardElement('card__btn', id).classList.remove('card__btn--disabled');
    }

    if (disabled) {
      getCatalogCardElement('card__btn', id).classList.add('card__btn--disabled');
    }
  };

  var isEmptyBasket = function (isEmpty) {
    if (isEmpty) {
      basketCardsContainer.classList.add('goods__cards--empty');
    } else {
      basketCardsContainer.classList.remove('goods__cards--empty');
    }
  };

  var checkGoodAmount = function (id) {
    if (getGoodAmountInBasket() < 1) {
      return;
    }

    if (goodsInBasket[id]['amount'] <= 0) {
      blockAddGoodButtonInBasket(id, true);
    }
  };

  var calcGoodPrice = function (id) {
    if (goodsInBasket[id] === undefined) {
      return;
    }
    getBasketCardElement('card-order__price', id).textContent = goodsInBasket[id]['price'] * goodsInBasket[id]['orderedAmount'] + ' ₽';
  };

  var calcTotalBasketInfo = function () {
    var totalBasketInfo = document.querySelector('.goods__total');
    hideElement(totalBasketInfo);
    var totalPrice = totalBasketInfo.querySelector('.goods__price');
    var totalAmount = totalBasketInfo.querySelector('.goods__total-count');

    var totalHeaderBasketInfo = document.querySelector('.main-header__basket');
    totalHeaderBasketInfo.textContent = 'В корзине ничего нет';

    if (getGoodAmountInBasket() > 0) {
      showElement(totalBasketInfo);
      totalBasketInfo.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');

      var goodOrderedAmount = 0;
      var goodPrice;
      var goodTotalPrice = 0;

      for (var id in goodsInBasket) {
        if (goodsInBasket.hasOwnProperty(id)) {
          var good = goodsInBasket[id];

          if (good['orderedAmount'] !== 0) {
            goodOrderedAmount += good['orderedAmount'];
            goodPrice = good['price'] * good['orderedAmount'];
            goodTotalPrice += goodPrice;
          }
        }
      }

      totalAmount.textContent = ('Итого за ' + goodOrderedAmount + ' ' + getCorrectWord(goodOrderedAmount) + ': ').toUpperCase();
      totalPrice.textContent = goodTotalPrice + ' ₽';
      totalAmount.appendChild(totalPrice);

      totalHeaderBasketInfo.textContent = 'В корзине ' + goodOrderedAmount + ' ' + getCorrectWord(goodOrderedAmount) + ' на ' + goodTotalPrice + ' ₽';
    }
  };

  var increaseGoodOrderedAmount = function (id) {
    if (goodsInBasket[id].amount <= 0) {
      return;
    }

    getBasketCardElement('card-order__count', id)
      .setAttribute('value', parseInt(getBasketCardElement('card-order__count', id).value, 10) + 1);

    changeDataValue(goodsInBasket, id, 'increase', 'orderedAmount');
    changeDataValue(goodsInBasket, id, 'decrease', 'amount');

    if (goodsInBasket[id].amount <= 0) {
      blockAddGoodButtonInBasket(id, true);
    }

    calcTotalBasketInfo();
  };

  var decreaseGoodOrderedAmount = function (id) {
    if (goodsInBasket[id].orderedAmount <= 0) {
      return;
    }

    if (goodsInBasket[id].orderedAmount > 0) {
      blockAddGoodButtonInBasket(id, false);
    }

    getBasketCardElement('card-order__count', id)
      .setAttribute('value', parseInt(getBasketCardElement('card-order__count', id).value, 10) - 1);

    changeDataValue(goodsInBasket, id, 'decrease', 'orderedAmount');
    changeDataValue(goodsInBasket, id, 'increase', 'amount');

    if (goodsInBasket[id].orderedAmount < 1) {
      deleteBasketCard(id);
    }

    calcTotalBasketInfo();
  };

  var addGoodToBasket = function (evt) {
    var target = evt.target;
    var classNames = target.classList;
    var id = parseInt(target.dataset.cardId, 10);

    if (!classNames.contains('card__btn')) {
      return;
    }

    evt.preventDefault();

    if (window.goodsInCatalog[id]['amount'] <= 0) {
      return;
    }

    var isFound = searchGoodInBasket(id);

    if (isFound) {
      if (goodsInBasket[id]['amount'] <= 0) {
        return;
      }
      increaseGoodOrderedAmount(id);
      calcGoodPrice(id);
      calcTotalBasketInfo();
      checkGoodAmount(id);
      blockFields(false);
    } else {
      isEmptyBasket(false);
      goodsInBasket[id] = cloneGood(window.goodsInCatalog[id]);
      addBasketCard(goodsInBasket[id], id);
      increaseGoodOrderedAmount(id);
      calcTotalBasketInfo();
      checkGoodAmount(id);
      blockFields(false);
    }

    target.blur();
  };

  var manageGoodOrderedAmountInBasket = function (evt) {
    var target = evt.target;
    var classNames = target.classList;
    var id = parseInt(target.dataset.cardId, 10);

    evt.preventDefault();

    if (classNames.contains('card-order__close')) {
      blockAddGoodButtonInBasket(id, false);
      deleteBasketCard(id);
      calcTotalBasketInfo();
      if (getGoodAmountInBasket() < 1) {
        isEmptyBasket(true);
        blockFields(true);
      }
    } else if (classNames.contains('card-order__btn--increase')) {
      increaseGoodOrderedAmount(id);
      calcGoodPrice(id);
    } else if (classNames.contains('card-order__btn--decrease')) {
      decreaseGoodOrderedAmount(id);
      calcGoodPrice(id);
      if (getGoodAmountInBasket() < 1) {
        isEmptyBasket(true);
        blockFields(true);
      }
    }
  };

  catalogCardsContainer.addEventListener('click', function (evt) {
    addGoodToBasket(evt);
  });

  catalogCardsContainer.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, addGoodToBasket);
  });

  basketCardsContainer.addEventListener('click', function (evt) {
    manageGoodOrderedAmountInBasket(evt);
  });

  basketCardsContainer.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, manageGoodOrderedAmountInBasket);
  });

  basketCardsContainer.addEventListener('keydown', function (evt) {
    var target = evt.target;
    var classNames = target.classList;

    if (!classNames.contains('card-order__count') ||
        evt.which >= KEYCODE['0'] && evt.which <= KEYCODE['9'] ||
        evt.which === KEYCODE['BACKSPACE'] ||
        evt.which === KEYCODE['TAB']) {
      return;
    }

    evt.preventDefault();
  });

  basketCardsContainer.addEventListener('input', function (evt) {
    var target = evt.target;
    var classNames = target.classList;
    var id = parseInt(target.dataset.cardId, 10);

    if (!classNames.contains('card-order__count')) {
      return;
    }

    if (parseInt(getBasketCardElement('card-order__count', id).value, 10) > window.goodsInCatalog[id]['amount']) {
      blockAddGoodButtonInBasket(id, true);
      getBasketCardElement('card-order__count', id).setAttribute('value', window.goodsInCatalog[id]['amount']);
      getBasketCardElement('card-order__count', id).value = window.goodsInCatalog[id]['amount'];
      goodsInBasket[id]['orderedAmount'] = window.goodsInCatalog[id]['amount'];
    } else if (parseInt(getBasketCardElement('card-order__count', id).value, 10) < 0) {
      getBasketCardElement('card-order__count', id).setAttribute('value', 0);
      getBasketCardElement('card-order__count', id).value = 0;
      goodsInBasket[id]['orderedAmount'] = 0;
    } else {
      if (getCatalogCardElement('card__btn', id).classList.contains('card__btn--disabled')) {
        blockAddGoodButtonInBasket(id, false);
      }
      goodsInBasket[id]['orderedAmount'] = parseInt(getBasketCardElement('card-order__count', id).value, 10);
    }

    goodsInBasket[id]['amount'] = window.goodsInCatalog[id]['amount'] - goodsInBasket[id]['orderedAmount'];
    getBasketCardElement('card-order__price', id).textContent = goodsInBasket[id]['price'] * goodsInBasket[id]['orderedAmount'] + ' ₽';
    calcTotalBasketInfo();

    if (getBasketCardElement('card-order__count', id).value === '0') {
      setTimeout(function () {
        deleteBasketCard(id);

        if (getGoodAmountInBasket() < 1) {
          isEmptyBasket(true);
          calcTotalBasketInfo();
          blockFields(true);
        }
      }, 10000);
    }
  });
})();
