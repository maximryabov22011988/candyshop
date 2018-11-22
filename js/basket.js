'use strict';

(function () {
  var goodsInCatalog = window.data;
  var KEYCODE = window.util.KEYCODE;
  var deepCopy = window.util.deepCopy;
  var blockOrderFields = window.util.blockOrderFields;

  var goodsInBasket = {};

  var catalogCardsListElement = document.querySelector('.catalog__cards');
  var basketCardsListElement = document.querySelector('.goods__cards');
  basketCardsListElement.classList.remove('goods__cards--empty');
  var emptyBasketElement = document.querySelector('.goods__card-empty');

  var basketCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

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

  var renderBasketCard = function (good) {
    var basketCardElement = basketCardTemplate.cloneNode(true);

    basketCardElement.querySelector('.card-order__title').textContent = good.name;
    basketCardElement.querySelector('.card-order__img').src = good.picture;
    basketCardElement.querySelector('.card-order__img').alt = good.name;
    basketCardElement.querySelector('.card-order__price').textContent = good.price + ' ₽';

    basketCardElement.setAttribute('data-card-id', good.id);
    basketCardElement.querySelector('.card-order__close').setAttribute('data-card-id', good.id);
    basketCardElement.querySelector('.card-order__price').setAttribute('data-card-id', good.id);
    basketCardElement.querySelector('.card-order__count').setAttribute('data-card-id', good.id);
    basketCardElement.querySelector('.card-order__btn--decrease').setAttribute('data-card-id', good.id);
    basketCardElement.querySelector('.card-order__btn--increase').setAttribute('data-card-id', good.id);

    return basketCardElement;
  };

  var getGoodAmountInBasket = function () {
    return Object.keys(goodsInBasket).length;
  };

  var searchGoodInBasket = function (id) {
    var isFound = false;

    for (var goodId in goodsInBasket) {
      if (Number(goodId) === id) {
        isFound = true;
        break;
      }
    }

    return isFound;
  };

  var changeDataValue = function (data, id, change, property) {
    for (var key in data) {
      if (Number(key) === id) {
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
    return basketCardsListElement.querySelector('.' + className + '[data-card-id="' + id + '"]');
  };

  var getCatalogCardElement = function (className, id) {
    return catalogCardsListElement.querySelector('.' + className + '[data-card-id="' + id + '"]');
  };

  var addBasketCard = function (good) {
    basketCardsListElement.appendChild(renderBasketCard(good));
  };

  var deleteBasketCard = function (id) {
    basketCardsListElement.removeChild(getBasketCardElement('card-order', id));
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

  var hideTextBasket = function (hide) {
    if (emptyBasketElement.classList.contains('visually-hidden')) {
      emptyBasketElement.classList.remove('visually-hidden');
    }

    if (hide) {
      emptyBasketElement.classList.add('visually-hidden');
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
    totalBasketInfo.classList.add('visually-hidden');
    var totalPrice = totalBasketInfo.querySelector('.goods__price');
    var totalAmount = totalBasketInfo.querySelector('.goods__total-count');

    var totalHeaderBasketInfo = document.querySelector('.main-header__basket');
    totalHeaderBasketInfo.textContent = 'В корзине ничего нет';

    if (getGoodAmountInBasket() > 0) {
      totalBasketInfo.classList.remove('visually-hidden');
      totalBasketInfo.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');

      var goodOrderedAmount = 0;
      var goodPrice;
      var goodTotalPrice = 0;

      for (var id in goodsInBasket) {
        var good = goodsInBasket[id];

        if (good['orderedAmount'] !== 0) {
          goodOrderedAmount += good['orderedAmount'];
          goodPrice = good['price'] * good['orderedAmount'];
          goodTotalPrice += goodPrice;
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
      .setAttribute('value', Number(getBasketCardElement('card-order__count', id).value) + 1);

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
      .setAttribute('value', Number(getBasketCardElement('card-order__count', id).value) - 1);

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
    var id = Number(target.dataset.cardId);

    if (!classNames.contains('card__btn')) {
      return;
    }

    evt.preventDefault();

    if (goodsInCatalog[id]['amount'] <= 0) {
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
      blockOrderFields(false);
    } else {
      hideTextBasket(true);
      goodsInBasket[id] = cloneGood(goodsInCatalog[id]);
      addBasketCard(goodsInBasket[id]);
      increaseGoodOrderedAmount(id);
      calcTotalBasketInfo();
      checkGoodAmount(id);
      blockOrderFields(false);
    }

    target.blur();
  };

  var manageGoodOrderedAmountInBasket = function (evt) {
    var target = evt.target;
    var classNames = target.classList;
    var id = Number(target.dataset.cardId);

    evt.preventDefault();

    if (classNames.contains('card-order__close')) {
      blockAddGoodButtonInBasket(id, false);
      deleteBasketCard(id);
      calcTotalBasketInfo();
      if (getGoodAmountInBasket() < 1) {
        hideTextBasket(false);
        blockOrderFields(true);
      }
    } else if (classNames.contains('card-order__btn--increase')) {
      increaseGoodOrderedAmount(id);
      calcGoodPrice(id);
    } else if (classNames.contains('card-order__btn--decrease')) {
      decreaseGoodOrderedAmount(id);
      calcGoodPrice(id);
      if (getGoodAmountInBasket() < 1) {
        hideTextBasket(false);
        blockOrderFields(true);
      }
    }
  };

  catalogCardsListElement.addEventListener('click', function (evt) {
    addGoodToBasket(evt);
  });

  catalogCardsListElement.addEventListener('keydown', function (evt) {
    if (evt.which === KEYCODE['ENTER']) {
      addGoodToBasket(evt);
    }
  });

  basketCardsListElement.addEventListener('click', function (evt) {
    manageGoodOrderedAmountInBasket(evt);
  });

  basketCardsListElement.addEventListener('keydown', function (evt) {
    if (evt.which === KEYCODE['ENTER']) {
      manageGoodOrderedAmountInBasket(evt);
    }
  });

  basketCardsListElement.addEventListener('keydown', function (evt) {
    var target = evt.target;
    var classNames = target.classList;

    if (!classNames.contains('card-order__count') ||
        evt.which >= KEYCODE['0'] && evt.which <= KEYCODE['9'] ||
        evt.which === KEYCODE['BACKSPACE']) {
      return;
    }

    evt.preventDefault();
  });

  basketCardsListElement.addEventListener('input', function (evt) {
    var target = evt.target;
    var classNames = target.classList;
    var id = Number(target.dataset.cardId);

    if (!classNames.contains('card-order__count')) {
      return;
    }

    if (Number(getBasketCardElement('card-order__count', id).value) > goodsInCatalog[id]['amount']) {
      blockAddGoodButtonInBasket(id, true);
      getBasketCardElement('card-order__count', id).setAttribute('value', goodsInCatalog[id]['amount']);
      getBasketCardElement('card-order__count', id).value = goodsInCatalog[id]['amount'];
      goodsInBasket[id]['orderedAmount'] = goodsInCatalog[id]['amount'];
    } else if (Number(getBasketCardElement('card-order__count', id).value) < 0) {
      getBasketCardElement('card-order__count', id).setAttribute('value', 0);
      getBasketCardElement('card-order__count', id).value = 0;
      goodsInBasket[id]['orderedAmount'] = 0;
    } else {
      if (getCatalogCardElement('card__btn', id).classList.contains('card__btn--disabled')) {
        blockAddGoodButtonInBasket(id, false);
      }
      goodsInBasket[id]['orderedAmount'] = Number(getBasketCardElement('card-order__count', id).value);
    }

    goodsInBasket[id]['amount'] = goodsInCatalog[id]['amount'] - goodsInBasket[id]['orderedAmount'];
    getBasketCardElement('card-order__price', id).textContent = goodsInBasket[id]['price'] * goodsInBasket[id]['orderedAmount'] + ' ₽';
    calcTotalBasketInfo();

    if (getBasketCardElement('card-order__count', id).value === '0') {
      setTimeout(function () {
        deleteBasketCard(id);

        if (getGoodAmountInBasket() < 1) {
          hideTextBasket(false);
          calcTotalBasketInfo();
          blockOrderFields(true);
        }
      }, 10000);
    }
  });
})();
