'use strict';

(function () {
  var showErrorModal = window.modal.showErrorModal;
  var renderCatalogLoader = window.loader.renderCatalogLoader;

  var URLS = {
    GET: 'https://js.dump.academy/candyshop/data',
    POST: 'https://js.dump.academy/candyshop'
  };

  var createRequest = function () {
    var httpRequest = false;

    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();

      if (httpRequest.overrideMimeType) {
        httpRequest.overrideMimeType('text/xml');
      }
    } else if (window.ActiveXObject) {
      try {
        httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (CatchException) {
        httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
      }
    }

    if (!httpRequest) {
      throw new Error('Невозможно создать XMLHttpRequest');
    }

    return httpRequest;
  };

  var createXhr = function (onLoad, onError, isGet) {
    var xhr = createRequest();
    xhr.responseType = 'json';

    if (isGet) {
      if (!document.querySelector('.catalog__load')) {
        renderCatalogLoader();
      } else {
        document.querySelector('.catalog__cards').classList.add('catalog__cards--load');
      }
    }

    xhr.addEventListener('load', function () {
      var errorMessage;

      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          errorMessage = 'Неверный запрос';
          showErrorModal('Код ошибки: 400.');
          break;
        case 401:
          errorMessage = 'Пользователь не авторизован';
          showErrorModal('Код ошибки: 401.');
          break;
        case 404:
          errorMessage = 'Запрашиваемая информация не найдена';
          showErrorModal('Код ошибки: 404.');
          break;
        default:
          errorMessage = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (errorMessage) {
        onError(errorMessage);
      }
    });

    xhr.addEventListener('error', function () {
      var message = 'Произошла ошибка соединения';
      showErrorModal(message);
      onError(message);
    });

    xhr.addEventListener('timeout', function () {
      var message = 'Запрос не успел выполниться за ' + (xhr.timeout / 1000) + ' с';
      showErrorModal(message);
      onError(message);
    });

    if (isGet) {
      xhr.timeout = 15000;
    } else {
      xhr.timeout = 60000;
    }

    return xhr;
  };

  window.backendApi = {
    loadData: function (onLoad, onError) {
      var xhr = createXhr(onLoad, onError, true);
      xhr.open('GET', URLS.GET);
      xhr.send();
    },
    sendData: function (data, onLoad, onError) {
      var xhr = createXhr(onLoad, onError);
      xhr.open('POST', URLS.POST);
      xhr.send(data);
    }
  };
})();
