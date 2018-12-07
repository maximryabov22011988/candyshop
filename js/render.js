'use strict';

(function () {
  var valueToClassName = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
  };

  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var catalogCardsListElement = document.querySelector('.catalog__cards');
  var moreGoodsButton = document.querySelector('.catalog__btn-more');

  var getRatingClassName = function (value) {
    return 'stars__rating--' + valueToClassName[value];
  };

  var renderCatalogCard = function (good, id, className) {
    var catalogCardElement = catalogCardTemplate.cloneNode(true);

    catalogCardElement.classList.remove('card--in-stock');
    catalogCardElement.classList.add(className);

    catalogCardElement.setAttribute('data-good-kind', good.kind);
    catalogCardElement.setAttribute('data-good-sugar', good.nutritionFacts.sugar);
    catalogCardElement.setAttribute('data-good-vegetarian', good.nutritionFacts.vegetarian);
    catalogCardElement.setAttribute('data-good-gluten', good.nutritionFacts.gluten);

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
    } else if (good.favorite === false) {
      catalogCardElement.querySelector('.card__btn-favorite').classList.remove('card__btn-favorite--selected');
    }

    if (good.amount === 0) {
      catalogCardElement.querySelector('.card__btn').classList.add('card__btn--disabled');
    }

    return catalogCardElement;
  };

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

    catalogCardsListElement.insertBefore(fragment, moreGoodsButton);
  };

  var startIndex = 0;

  var renderMoreCards = function (goods) {
    var fragment = document.createDocumentFragment();
    var goodClass;

    if (goods.length >= 6) {
      for (var i = startIndex; i < startIndex + 6; i++) {
        goodClass = 'card--soon';

        if (goods.length > 5) {
          goodClass = 'card--in-stock';
        } else if (goods.length >= 1 && goods.length <= 5) {
          goodClass = 'card--little';
        }

        fragment.appendChild(renderCatalogCard(goods[i], i, goodClass));
      }

      startIndex += 6;

      if (startIndex >= goods.length) {
        startIndex = 0;
      }

      catalogCardsListElement.insertBefore(fragment, moreGoodsButton);
    }
  };

  window.render = {
    renderCatalogCard: renderCatalogCard,
    renderCatalogCards: renderCatalogCards,
    renderMoreCards: renderMoreCards
  };
})();
