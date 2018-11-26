'use strict';

(function () {
  var isEnterEvent = window.util.isEnterEvent;
  var isEscEvent = window.util.isEscEvent;

  var modalElement = document.querySelector('.modal');
  var closeButton = modalElement.querySelector('.modal__close');

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

    if (!target.classList.contains('modal')) {
      modalElement.classList.add('modal--hidden');
      document.removeEventListener('keydown', modalEscPressHandler);
    } else {
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

  var modalEscPressHandler = function (evt) {
    isEscEvent(evt, closeModal);
  };

  closeButton.addEventListener('click', function (evt) {
    closeModal(evt);
  });

  closeButton.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, closeModal);
  });

  window.modal = {
    showErrorModal: showErrorModal,
    showSuccessModal: showSuccessModal
  };
})();
