'use strict';

(function () {
  var backendApi = window.backendApi;
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;
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
    evt.preventDefault();
    blockFields(false);

    var stopSubmit = false;

    for (var i = 0; i < orderFields.length; i++) {
      var field = orderFields[i];

      if (field.required === true) {
        var isValidField = validateField(evt, customValidation, field);

        if (isValidField) {
          var isVerifyField = verifyField(evt, customValidation, field);
          if (!isVerifyField) {
            field.focus();
          }
        }

        if (field.checkValidity() === false) {
          stopSubmit = true;
        }
      }
    }

    var isCorrectBankCard = paymentMessage.textContent.toLowerCase() === 'одобрен';

    if (!stopSubmit && isCorrectBankCard) {
      backendApi.sendData(new FormData(orderForm), successHandler, errorHandler);
    }
  });

  window.order.blockFields = blockFields;
})();
