'use strict';

(function () {
  var hideElement = window.util.hideElement;


  var valueToClassName = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
  };

  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var basketCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var catalogCardsContainerElement = document.querySelector('.catalog__cards');
  var showMoreButtonElement = document.querySelector('.catalog__btn-more');

  /**
   * Возвращает соответствующий css-класс.
   *
   * @param  {number} value - значение рейтинга
   * @return {string}       - соответствующий css-класс
   */
  var getRatingClassName = function (value) {
    return 'stars__rating--' + valueToClassName[value];
  };

  /**
   * Рендерит карточку товара.
   *
   * @param  {object} good      - описание товара
   * @param  {number} id        - id товара
   * @param  {string} className - соответствующий класс
   * @return {DOM}              - карточка товара
   */
  var renderCatalogCard = function (good, id, className) {
    var catalogCardElement = catalogCardTemplate.cloneNode(true);

    catalogCardElement.classList.remove('card--in-stock');
    catalogCardElement.classList.add(className);
    catalogCardElement.querySelector('.card__title').textContent = good.name;
    catalogCardElement.querySelector('.card__img').src = 'img/cards/' + good.picture;
    catalogCardElement.querySelector('.card__img').alt = good.name;
    catalogCardElement.querySelector('.card__price').firstChild.textContent = good.price;
    catalogCardElement.querySelector('.card__weight').textContent = '/ ' + good.weight + ' Г';
    catalogCardElement.querySelector('.stars__rating').classList.add(getRatingClassName(good.rating.value));
    catalogCardElement.querySelector('.star__count').textContent = good.rating.number;
    catalogCardElement.querySelector('.card__characteristic').textContent = good.nutritionFacts.sugar;
    catalogCardElement.querySelector('.card__composition-list').textContent = good.nutritionFacts.contents;
    catalogCardElement.querySelector('.card__btn-favorite').setAttribute('data-card-id', good.id);
    catalogCardElement.querySelector('.card__btn').setAttribute('data-card-id', good.id);

    if (good.favorite === true) {
      catalogCardElement.querySelector('.card__btn-favorite').classList.add('card__btn-favorite--selected');
    }

    if (good.favorite === false) {
      catalogCardElement.querySelector('.card__btn-favorite').classList.remove('card__btn-favorite--selected');
    }

    if (good.amount === 0) {
      catalogCardElement.querySelector('.card__btn').classList.add('card__btn--disabled');
    }

    return catalogCardElement;
  };

  /**
   * Добавляет карточки товара в DOM.
   *
   * @param  {array} goods   - массив товаров
   * @param  {number} amount - количество товара для отображения
   */
  var renderCatalogCards = function (goods, amount) {
    amount = amount || 6;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < amount; i++) {
      var goodClass = 'card--soon';
      if (goods.length > 5) {
        goodClass = 'card--in-stock';
      } else if (goods.length >= 1 && goods.length <= 5) {
        goodClass = 'card--little';
      }
      fragment.appendChild(renderCatalogCard(goods[i], i, goodClass));
    }

    if (goods.length <= 6 || goods.length === amount) {
      hideElement(showMoreButtonElement);
      catalogCardsContainerElement.appendChild(fragment);
    }

    if (amount === 6) {
      catalogCardsContainerElement.insertBefore(fragment, showMoreButtonElement);
    }
  };

  /**
   * Рендерит карточку товара в корзине.
   *
   * @param  {object} good - описание товара
   * @param  {number} id   - id товара
   * @return {DOM}         - карточка товара
   */
  var renderBasketCard = function (good, id) {
    var basketCardElement = basketCardTemplate.cloneNode(true);

    basketCardElement.querySelector('.card-order__title').textContent = good.name;
    basketCardElement.querySelector('.card-order__img').src = 'img/cards/' + good.picture;
    basketCardElement.querySelector('.card-order__img').alt = good.name;
    basketCardElement.querySelector('.card-order__price').textContent = good.price + ' ₽';
    basketCardElement.setAttribute('data-card-id', id);
    basketCardElement.querySelector('.card-order__close').setAttribute('data-card-id', id);
    basketCardElement.querySelector('.card-order__price').setAttribute('data-card-id', id);
    basketCardElement.querySelector('.card-order__count').setAttribute('data-card-id', id);
    basketCardElement.querySelector('.card-order__btn--decrease').setAttribute('data-card-id', id);
    basketCardElement.querySelector('.card-order__btn--increase').setAttribute('data-card-id', id);

    return basketCardElement;
  };


  window.render = {
    renderCatalogCard: renderCatalogCard,
    renderCatalogCards: renderCatalogCards,
    renderBasketCard: renderBasketCard
  };
})();
