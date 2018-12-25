'use strict';

(function () {
  var KEYCODE = window.util.KEYCODE;
  var isEnterEvent = window.util.isEnterEvent;


  /**
   * Обработчик скрытия модального окна при нажатии Esc.
   *
   * @param  {object} evt - объект event
   */
  var modalEscPressHandler = function (evt) {
    if (evt.which === KEYCODE['ESC']) {
      var modalElement = document.querySelector('.modal');
      modalElement.classList.add('modal--hidden');
      document.removeEventListener('keydown', modalEscPressHandler);
    }
  };

  /**
   * Обработчик скрытия модального окна.
   *
   * @param  {object} evt - объект event
   */
  var closeModal = function (evt) {
    var target = evt.target;
    if (target.classList.contains('modal__close')) {
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

  /**
   * Показывает произвольное модальное окно.
   *
   * @param  {DOM} modal - модальное окно, которое нужно показать
   */
  var showModal = function (modal) {
    modal.classList.remove('modal--hidden');
    document.addEventListener('keydown', modalEscPressHandler);
  };

  /**
   * Показывает модальное окно при успешном выполнении.
   */
  var showSuccessModal = function () {
    var successModal = document.querySelector('.modal[data-modal="success"]');
    showModal(successModal);
    document.addEventListener('keydown', modalEscPressHandler);
  };

  /**
   * Показывает модальное окно при выполнении с ошибкой.
   *
   * @param  {string} message - сообщение об ошибке
   */
  var showErrorModal = function (message) {
    var errorModal = document.querySelector('.modal[data-modal="error"]');
    showModal(errorModal);
    var messageElement = errorModal.querySelector('.modal__message');
    messageElement.textContent = message;
    document.addEventListener('keydown', modalEscPressHandler);
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
