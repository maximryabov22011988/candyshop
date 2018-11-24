'use strict';

(function () {
  var URL = {
    LOAD: 'https://js.dump.academy/candyshop/data',
    UPLOAD: 'https://js.dump.academy/candyshop'
  };

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
    document.querySelector('.catalog__load').appendChild(holder);
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

    createPreloader();

    return httpRequest;
  };

  var load = function (onLoad, onError) {
    var xhr = createRequest();
    xhr.responseType = 'json';

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
      } else {
        document.querySelector('.holder').classList.remove('visually-hidden');
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + (xhr.timeout / 1000) + ' с');
    });

    xhr.timeout = 10000;

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
