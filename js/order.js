'use strict';

(function () {
  var backend = window.backend;
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var showSuccessModal = window.modal.showSuccessModal;

  var orderForm = document.querySelector('.buy__form');
  var orderFields = orderForm.querySelectorAll('input');
  var paymentMessage = orderForm.querySelector('.payment__card-status');

  var blockFields = function (boolean) {
    for (var i = 0; i < orderFields.length; i++) {
      orderFields[i].disabled = boolean;
    }
  };

  var successHandler = function (response, evt) {
    showSuccessModal();

    for (var i = 0; i < orderFields.length; i++) {
      var fieldContainer = orderFields[i].parentElement;
      orderFields[i].value = '';

      if (fieldContainer.classList.contains('text-input')) {
        fieldContainer.classList.remove('text-input--error');
        fieldContainer.classList.remove('text-input--correct');
      }
    }

    paymentMessage.textContent = 'Не определён';
    paymentMessage.style.color = '';
  };

  var errorHandler = function (errorMessage) {
    throw new Error(errorMessage);
  };

  orderForm.addEventListener('submit', function (evt) {
    var stopSubmit = false;

    blockFields(false);

    for (var i = 0; i < orderFields.length; i++) {
      var field = orderFields[i];

      if (field.required === true) {
        validateField(evt, customValidation, field);

        if (field.checkValidity() === false) {
          stopSubmit = true;
        }
      }
    }

    evt.preventDefault();

    if (!stopSubmit) {
      backend.sendData(new FormData(orderForm), successHandler, errorHandler);
    }
  });

  window.order.blockFields = blockFields;
})();
