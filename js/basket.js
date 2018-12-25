'use strict';

(function () {
  var isEnterEvent = window.util.isEnterEvent;
  var deepCopy = window.util.deepCopy;
  var showElement = window.util.showElement;
  var hideElement = window.util.hideElement;
  var renderBasketCard = window.render.renderBasketCard;
  var blockFields = window.order.blockFields;


  var goodsInBasket = {};

  var catalogCardsContainerElement = document.querySelector('.catalog__cards');
  var basketCardsContainerElement = document.querySelector('.goods__cards');

  /**
   * Возвращает в зависимости от количества товара, верное окончание для слова "товар".
   *
   * @param  {number} number - количество товара
   * @return {string}        - слово "товар" с верным окончанием
   */
  var getCorrectWord = function (number) {
    var word = 'товар';
    var wordEnds = ['а', 'ов'];
    if ((number >= 2 && number <= 4) || (number > 20 && number % 10 >= 2 && number % 10 <= 4)) {
      word = word + wordEnds[0];
    }
    if ((number >= 5 && number <= 11) || (number % 10 === 0 || number % 10 >= 2 && number % 10 <= 4) || (number % 10 >= 5 && number % 10 <= 9)) {
      word = word + wordEnds[1];
    }
    return word;
  };

  /**
   * Возвращает количество товара в корзине.
   *
   * @return {number} - количество товара в корзине
   */
  var getGoodAmountInBasket = function () {
    return Object.keys(goodsInBasket).length;
  };

  /**
   * Ищет товар в корзине.
   *
   * @param  {number} id - id товара
   * @return {boolean}   - true / false
   */
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

  /**
   * Изменяет количество в указанном свойстве.
   *
   * @param  {object} data     - товар
   * @param  {number} id       - id товара
   * @param  {string} change   - увеличение / уменьшение
   * @param  {string} property - свойство, количество которого нужно изменить
   */
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

  /**
   * Клонирует объект товара.
   * @param  {object} selectedGood - товар, который нужно добавить в корзину
   * @return {object}              - клон товара
   */
  var cloneGood = function (selectedGood) {
    var goodClone = deepCopy(selectedGood);
    goodClone.orderedAmount = 0;
    return goodClone;
  };

  /**
   * Возвращает карточку товара из каталога с нужным id.
   *
   * @param  {string} className - соответствующий css-класс
   * @param  {number} id        - id товара
   * @return {DOM}              - карточка товара
   */
  var getCatalogCardElement = function (className, id) {
    return catalogCardsContainerElement.querySelector('.' + className + '[data-card-id="' + id + '"]');
  };

  /**
   * Возвращает карточку товара из корзины с нужным id.
   *
   * @param  {string} className - соответствующий css-класс
   * @param  {number} id        - id товара
   * @return {DOM}              - карточка товара
   */
  var getBasketCardElement = function (className, id) {
    return basketCardsContainerElement.querySelector('.' + className + '[data-card-id="' + id + '"]');
  };

  /**
   * Добавляет карточку товара в корзину.
   *
   * @param {object} good - товар
   * @param {number} id   - id товара
   */
  var addBasketCard = function (good, id) {
    basketCardsContainerElement.appendChild(renderBasketCard(good, id));
  };

  /**
   * Удаляет карточку товара из корзины.
   *
   * @param {number} id   - id товара
   */
  var deleteBasketCard = function (id) {
    basketCardsContainerElement.removeChild(getBasketCardElement('card-order', id));
    delete goodsInBasket[id];
  };

  /**
   * Блокирует / разблокирует кнопку добавления товара в нужное карточке товара в каталога.
   *
   * @param  {number} id        - id товара
   * @param  {boolean} disabled - флаг, если нужно заблокировать кнопку
   */
  var blockAddGoodButton = function (id, disabled) {
    if (getCatalogCardElement('card__btn', id).classList.contains('card__btn--disabled')) {
      getCatalogCardElement('card__btn', id).classList.remove('card__btn--disabled');
    }
    if (disabled) {
      getCatalogCardElement('card__btn', id).classList.add('card__btn--disabled');
    }
  };

  /**
   * Переключает css-класс корзины, в случае если пуста.
   *
   * @param  {boolean} isEmpty - флаг, если корзина пуста
   */
  var isEmptyBasket = function (isEmpty) {
    if (isEmpty) {
      basketCardsContainerElement.classList.add('goods__cards--empty');
    } else {
      basketCardsContainerElement.classList.remove('goods__cards--empty');
    }
  };

  /**
   * Проверяет количество товара и блокирует кнопку добавления товара, если остаток равен 0.
   *
   * @param  {number} id - id товара
   */
  var checkGoodAmount = function (id) {
    if (getGoodAmountInBasket() < 1) {
      return;
    }
    if (goodsInBasket[id]['amount'] <= 0) {
      blockAddGoodButton(id, true);
    }
  };

  /**
   * Подсчитывает итоговую стоимость товара, в зависимости от количества товара.
   *
   * @param  {id} id - id товара
   */
  var calcGoodPrice = function (id) {
    if (goodsInBasket[id] === undefined) {
      return;
    }
    getBasketCardElement('card-order__price', id).textContent = goodsInBasket[id]['price'] * goodsInBasket[id]['orderedAmount'] + ' ₽';
  };

  /**
   * Рассчитывает итоговое количество и стоимость товаров в корзине.
   */
  var calcTotalBasketInfo = function () {
    var totalBasketInfoElement = document.querySelector('.goods__total');
    var totalPriceElement = totalBasketInfoElement.querySelector('.goods__price');
    var totalAmountElement = totalBasketInfoElement.querySelector('.goods__total-count');
    var totalHeaderBasketInfo = document.querySelector('.main-header__basket');
    hideElement(totalBasketInfoElement);
    totalHeaderBasketInfo.textContent = 'В корзине ничего нет';

    if (getGoodAmountInBasket() > 0) {
      var goodOrderedAmount = 0;
      var goodPrice;
      var goodTotalPrice = 0;

      showElement(totalBasketInfoElement);
      totalBasketInfoElement.querySelector('.goods__order-link').classList.remove('goods__order-link--disabled');

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

      totalAmountElement.textContent = ('Итого за ' + goodOrderedAmount + ' ' + getCorrectWord(goodOrderedAmount) + ': ').toUpperCase();
      totalPriceElement.textContent = goodTotalPrice + ' ₽';
      totalAmountElement.appendChild(totalPriceElement);
      totalHeaderBasketInfo.textContent = 'В корзине ' + goodOrderedAmount + ' ' + getCorrectWord(goodOrderedAmount) + ' на ' + goodTotalPrice + ' ₽';
    }
  };

  /**
   * Увеличивает количество заказанного товара.
   *
   * @param  {number} id - id товара
   */
  var increaseGoodOrderedAmount = function (id) {
    if (goodsInBasket[id].amount <= 0) {
      return;
    }

    getBasketCardElement('card-order__count', id).setAttribute('value', parseInt(getBasketCardElement('card-order__count', id).value, 10) + 1);
    changeDataValue(goodsInBasket, id, 'increase', 'orderedAmount');
    changeDataValue(goodsInBasket, id, 'decrease', 'amount');

    if (goodsInBasket[id].amount <= 0) {
      blockAddGoodButton(id, true);
    }

    calcTotalBasketInfo();
  };

  /**
   * Уменьшает количество заказанного товара.
   *
   * @param  {number} id - id товара
   */
  var decreaseGoodOrderedAmount = function (id) {
    if (goodsInBasket[id].orderedAmount <= 0) {
      return;
    }

    if (goodsInBasket[id].orderedAmount > 0) {
      blockAddGoodButton(id, false);
    }

    getBasketCardElement('card-order__count', id).setAttribute('value', parseInt(getBasketCardElement('card-order__count', id).value, 10) - 1);
    changeDataValue(goodsInBasket, id, 'decrease', 'orderedAmount');
    changeDataValue(goodsInBasket, id, 'increase', 'amount');

    if (goodsInBasket[id].orderedAmount < 1) {
      deleteBasketCard(id);
    }

    calcTotalBasketInfo();
  };

  /**
   * Добавляет товар в корзину.
   *
   * @param {object} evt - объект event
   */
  var addGoodToBasket = function (evt) {
    var target = evt.target;
    var id = parseInt(target.dataset.cardId, 10);

    if ((!evt.target.classList.contains('card__btn') || window.goodsInCatalog[id]['amount'] <= 0)) {
      return;
    }
    evt.preventDefault();

    if (searchGoodInBasket(id)) {
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

  /**
   * Управляет количеством заказанного товара в корзине.
   *
   * @param  {object} evt - объект event
   */
  var manageGoodOrderedAmountInBasket = function (evt) {
    var target = evt.target;
    var classNames = target.classList;
    var id = parseInt(target.dataset.cardId, 10);

    evt.preventDefault();

    if (classNames.contains('card-order__close')) {
      blockAddGoodButton(id, false);
      deleteBasketCard(id);
      calcTotalBasketInfo();
      if (getGoodAmountInBasket() < 1) {
        isEmptyBasket(true);
        blockFields(true);
      }
    }

    if (classNames.contains('card-order__btn--increase')) {
      increaseGoodOrderedAmount(id);
      calcGoodPrice(id);
    }

    if (classNames.contains('card-order__btn--decrease')) {
      decreaseGoodOrderedAmount(id);
      calcGoodPrice(id);
      if (getGoodAmountInBasket() < 1) {
        isEmptyBasket(true);
        blockFields(true);
      }
    }
  };

  catalogCardsContainerElement.addEventListener('click', function (evt) {
    addGoodToBasket(evt);
  });

  catalogCardsContainerElement.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, addGoodToBasket);
  });

  basketCardsContainerElement.addEventListener('click', function (evt) {
    manageGoodOrderedAmountInBasket(evt);
  });

  basketCardsContainerElement.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, manageGoodOrderedAmountInBasket);
  });

  basketCardsContainerElement.addEventListener('keyup', function (evt) {
    var target = evt.target;
    if (target.classList.contains('card-order__count')) {
      target.value = target.value.replace(/[^\d]/g, '');
    }
  });

  basketCardsContainerElement.addEventListener('input', function (evt) {
    if (!evt.target.classList.contains('card-order__count')) {
      return;
    }

    var id = parseInt(evt.target.dataset.cardId, 10);

    if (parseInt(getBasketCardElement('card-order__count', id).value, 10) > window.goodsInCatalog[id]['amount']) {
      blockAddGoodButton(id, true);
      getBasketCardElement('card-order__count', id).setAttribute('value', window.goodsInCatalog[id]['amount']);
      getBasketCardElement('card-order__count', id).value = window.goodsInCatalog[id]['amount'];
      goodsInBasket[id]['orderedAmount'] = window.goodsInCatalog[id]['amount'];
    } else if (parseInt(getBasketCardElement('card-order__count', id).value, 10) < 0) {
      getBasketCardElement('card-order__count', id).setAttribute('value', 0);
      getBasketCardElement('card-order__count', id).value = 0;
      goodsInBasket[id]['orderedAmount'] = 0;
    } else {
      if (getCatalogCardElement('card__btn', id).classList.contains('card__btn--disabled')) {
        blockAddGoodButton(id, false);
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
