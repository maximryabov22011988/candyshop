'use strict';

(function () {
  var URL = {
    LOAD: 'https://js.dump.academy/candyshop/data',
    UPLOAD: 'https://js.dump.academy/candyshop'
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

  var load = function (onLoad, onError) {
    var xhr = createRequest();
    xhr.responseType = 'json';

    if (!document.querySelector('.catalog__load')) {
      window.loader.renderCatalogLoader();
    } else {
      document.querySelector('.catalog__cards').classList.add('catalog__cards--load');
    }

    xhr.addEventListener('load', function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          var errorMessage;

          switch (xhr.status) {
            case 400:
              errorMessage = 'Неверный запрос';
              break;
            case 401:
              errorMessage = 'Пользователь не авторизован';
              break;
            case 404:
              errorMessage = 'Запрашиваемая информация не найдена';
              break;
            default:
              errorMessage = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
          }
          onError(errorMessage);
        }
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + (xhr.timeout / 1000) + ' с');
    });

    xhr.timeout = 15000;

    xhr.open('GET', URL.LOAD);
    xhr.send();
  };

  // не работает
  var upload = function (data, onUpload, onError) {
    var xhr = createRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onUpload(xhr.response);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.open('POST', URL.UPLOAD);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };
})();
