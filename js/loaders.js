'use strict';

(function () {
  var catalogLoaderTemplate = document.querySelector('#load-data').content.querySelector('.catalog__load');
  var emptyBasketTemplate = document.querySelector('#cards-empty').content.querySelector('.goods__card-empty');

  var createPreloader = function () {
    var holder = document.createElement('div');
    holder.classList.add('holder');

    var preloader = document.createElement('div');
    preloader.classList.add('preloader');

    for (var i = 0; i < 10; i++) {
      var div = document.createElement('div');
      preloader.appendChild(div);
    }

    holder.appendChild(preloader);
    return holder;
  };

  var renderCatalogLoader = function (message) {
    var catalogLoaderElement = catalogLoaderTemplate.cloneNode(true);

    if (message) {
      catalogLoaderElement.querySelector('.catalog__load-text').textContent = message;
    } else {
      var preloader = createPreloader();
      catalogLoaderElement.appendChild(preloader);
    }

    document.querySelector('.catalog__cards').appendChild(catalogLoaderElement);
  };

  var renderEmptyBasket = function () {
    var emptyBasketElement = emptyBasketTemplate.cloneNode(true);
    document.querySelector('.goods__cards').appendChild(emptyBasketElement);
  };

  window.loader = {
    renderCatalogLoader: renderCatalogLoader,
    renderEmptyBasket: renderEmptyBasket
  };
})();
