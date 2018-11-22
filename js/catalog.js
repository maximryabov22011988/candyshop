'use strict';

(function () {
  var goodsInCatalog = window.data;
  var KEYCODE = window.util.KEYCODE;
  var blockOrderFields = window.util.blockOrderFields;

  var fragment = document.createDocumentFragment();
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.catalog__card');

  var catalogCardsListElement = document.querySelector('.catalog__cards');
  catalogCardsListElement.classList.remove('catalog__cards--load');

  var loaderElement = catalogCardsListElement.querySelector('.catalog__load');
  loaderElement.classList.add('visually-hidden');


  var renderCatalogCard = function (good) {
    var catalogCardElement = catalogCardTemplate.cloneNode(true);

    catalogCardElement.querySelector('.card__title').textContent = good.name;
    catalogCardElement.querySelector('.card__img').src = good.picture;
    catalogCardElement.querySelector('.card__img').alt = good.name;
    catalogCardElement.querySelector('.card__price').firstChild.textContent = good.price;
    catalogCardElement.querySelector('.card__weight').textContent = '/ ' + good.weight + ' Г';
    catalogCardElement.querySelector('.stars__rating').classList.add(window.util.getRatingClassName(good.rating.value));
    catalogCardElement.querySelector('.star__count').textContent = good.rating.number;
    catalogCardElement.querySelector('.card__characteristic').textContent = good.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    catalogCardElement.querySelector('.card__composition-list').textContent = good.nutritionFacts.ingredients;
    catalogCardElement.querySelector('.card__btn').setAttribute('data-card-id', good.id);

    if (good.amount === 0) {
      catalogCardElement.querySelector('.card__btn').classList.add('card__btn--disabled');
    }

    return catalogCardElement;
  };

  goodsInCatalog.forEach(function (good) {
    if (goodsInCatalog.length > 5) {
      catalogCardTemplate.classList.add('card--in-stock');
    } else if (goodsInCatalog.length >= 1 && goodsInCatalog.length <= 5) {
      catalogCardTemplate.classList.add('card--little');
    } else {
      catalogCardTemplate.classList.add('card--soon');
    }

    fragment.appendChild(renderCatalogCard(good));
  });

  catalogCardsListElement.appendChild(fragment);

  blockOrderFields(true);

  var addCardToFavorites = function (evt) {
    var target = evt.target;
    var targetClass = target.classList;

    if (!targetClass.contains('card__btn-favorite')) {
      return;
    }

    evt.preventDefault();
    targetClass.toggle('card__btn-favorite--selected');
    target.blur();
  };

  catalogCardsListElement.addEventListener('click', function (evt) {
    addCardToFavorites(evt);
  });

  catalogCardsListElement.addEventListener('keydown', function (evt) {
    if (evt.which === KEYCODE['ENTER']) {
      addCardToFavorites(evt);
    }
  });
})();
