'use strict';

(function () {
  var convertToArray = window.util.convertToArray;
  var isEnterEvent = window.util.isEnterEvent;
  var isEscEvent = window.util.isEscEvent;

  var modalEscPressHandler = function (evt) {
    isEscEvent(evt, closeModal);
  };

  var showModal = function (modal) {
    modal.classList.remove('modal--hidden');
    document.addEventListener('keydown', modalEscPressHandler);
  };

  var showErrorModal = function (message) {
    var errorModal = document.querySelector('.modal[data-modal="error"]');
    showModal(errorModal);

    if (message) {
      var messageElement = errorModal.querySelector('.modal__message');
      messageElement.textContent = message;
    }

    document.addEventListener('keydown', modalEscPressHandler);
  };

  var showSuccessModal = function () {
    var successModal = document.querySelector('.modal[data-modal="success"]');
    showModal(successModal);
    document.addEventListener('keydown', modalEscPressHandler);
  };

  var closeModal = function (evt) {
    var target = evt.target;

    if (target.tagName.toLowerCase() === 'body') {
      var modalElements = convertToArray(document.querySelectorAll('.modal'));

      modalElements.forEach(function (element) {
        element.classList.add('modal--hidden');
        document.removeEventListener('keydown', modalEscPressHandler);
      });
    } else if (target.classList.contains('modal__close')) {
      while (target) {
        target = target.parentElement;

        if (target.classList.contains('modal')) {
          target.classList.add('modal--hidden');
          document.removeEventListener('keydown', modalEscPressHandler);
          break;
        }
      }
    }
  };

  document.addEventListener('click', function (evt) {
    closeModal(evt);
  });

  document.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, closeModal);
  });

  window.modal = {
    showErrorModal: showErrorModal,
    showSuccessModal: showSuccessModal
  };
})();
