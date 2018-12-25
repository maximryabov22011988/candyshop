'use strict';

(function () {
  var backendApi = window.backendApi;
  var convertToArray = window.util.convertToArray;
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;
  var showSuccessModal = window.modal.showSuccessModal;


  var orderFormElement = document.querySelector('.buy__form');
  var orderFieldsElements = convertToArray(orderFormElement.querySelectorAll('input'));
  var contactFieldsElements = convertToArray(orderFormElement.querySelectorAll('.contact-data__inputs input'));
  var bankCardFieldsElements = convertToArray(orderFormElement.querySelectorAll('.payment__inputs input'));
  var courierFieldsElements = convertToArray(orderFormElement.querySelectorAll('.deliver__address-entry-fields input'));
  var paymentMessageElement = orderFormElement.querySelector('.payment__card-status');

  /**
   * Блокирует / разблокирует все поля формы заказа.
   *
   * @param  {boolean} boolean - true / false
   */
  var blockFields = function (boolean) {
    orderFieldsElements.forEach(function (fieldElement) {
      fieldElement.disabled = boolean;
    });
  };

  /**
   * Сбрасывает атрибут "checked" у полей внутри контейнера.
   *
   * @param  {string} containerClassName - css-класс контейнера
   */
  var resetFields = function (containerClassName) {
    var fieldsElements = convertToArray(orderFormElement.querySelectorAll('.' + containerClassName + ' input'));
    fieldsElements.forEach(function (fieldElement) {
      fieldElement.setAttribute('checked', false);
      fieldElement.checked = false;
    });
  };

  /**
   * Добавляет атрибут "disable" у полей внутри контейнера.
   *
   * @param  {[type]} containerClassName - css-класс контейнера
   */
  var disableFields = function (containerClassName) {
    var fieldsElements = convertToArray(orderFormElement.querySelectorAll('.' + containerClassName + ' input'));
    fieldsElements.forEach(function (fieldElement) {
      fieldElement.disabled = true;
    });
  };

  /**
   * Сбрасывает атрибут "disable" у полей внутри контейнера.
   *
   * @param  {[type]} containerClassName - css-класс контейнера
   */
  var enableFields = function (containerClassName) {
    var fieldsElements = convertToArray(orderFormElement.querySelectorAll('.' + containerClassName + ' input'));
    fieldsElements.forEach(function (fieldElement) {
      fieldElement.disabled = false;
    });
  };

  /**
   * Валидирует и верифицирует поля формы (валидация - проверяет корректность заполнения; верификация - проверяет корректность значения).
   *
   * @param  {object} evt         - объект event
   * @param  {DOM} fieldsElements - поле для проверки
   * @return {boolean}            - все поля корректны (true / false)
   */
  var checkFields = function (evt, fieldsElements) {
    var validityFields = [];
    fieldsElements.forEach(function (fieldElement) {
      if (fieldElement.required === true) {
        if (validateField(evt, customValidation, fieldElement)) {
          if (!verifyField(evt, customValidation, fieldElement)) {
            fieldElement.focus();
          }
        }
        if (fieldElement.checkValidity() === true) {
          validityFields.push(true);
        } else {
          validityFields.push(false);
        }
      }
    });
    return validityFields.every(function (value) {
      return value === true;
    });
  };

  /**
   * Обработчик при успешной отправке данных формы.
   *
   * @param  {object} response - xhr-запрос
   * @param  {object} evt      - объект event
   */
  var successHandler = function (response, evt) {
    showSuccessModal();
    orderFieldsElements.forEach(function (fieldElement) {
      var fieldContainerElement = fieldElement.parentElement;
      fieldElement.value = '';
      if (fieldContainerElement.classList.contains('text-input')) {
        fieldContainerElement.classList.remove('text-input--error');
        fieldContainerElement.classList.remove('text-input--correct');
      }
    });
    paymentMessageElement.textContent = 'Не определён';
    paymentMessageElement.style.color = '';
  };

  /**
   * Обработчик при неудачной отправке данных формы
   *
   * @param  {string} errorMessage - текст ошибки
   */
  var errorHandler = function (errorMessage) {
    throw new Error(errorMessage);
  };

  orderFormElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    blockFields(false);

    var cardPaymentInputElement = orderFormElement.querySelector('#payment__card');
    var courierDeliveryInputElement = orderFormElement.querySelector('#deliver__courier');
    var isCorrectContactFields = checkFields(evt, contactFieldsElements);
    var isCorrectBankCard = null;
    var isCorrectCourierFields = null;

    if (cardPaymentInputElement.checked === true && courierDeliveryInputElement.checked === true) {
      resetFields('deliver__store-list');
      checkFields(evt, bankCardFieldsElements);
      isCorrectBankCard = paymentMessageElement.textContent.toLowerCase() === 'одобрен';
      isCorrectCourierFields = checkFields(evt, courierFieldsElements);
      if (isCorrectContactFields && isCorrectBankCard && isCorrectCourierFields) {
        backendApi.sendData(new FormData(orderFormElement), successHandler, errorHandler);
      }
      return;
    }

    if (cardPaymentInputElement.checked === true) {
      checkFields(evt, bankCardFieldsElements);
      isCorrectBankCard = paymentMessageElement.textContent.toLowerCase() === 'одобрен';
      if (isCorrectContactFields && isCorrectBankCard) {
        backendApi.sendData(new FormData(orderFormElement), successHandler, errorHandler);
      }
      return;
    }

    if (courierDeliveryInputElement.checked === true) {
      resetFields('deliver__store-list');
      isCorrectCourierFields = checkFields(evt, courierFieldsElements);
      if (isCorrectContactFields && isCorrectCourierFields) {
        backendApi.sendData(new FormData(orderFormElement), successHandler, errorHandler);
      }
      return;
    }

    if (isCorrectContactFields) {
      backendApi.sendData(new FormData(orderFormElement), successHandler, errorHandler);
    }
  });


  window.order = {
    blockFields: blockFields,
    disableFields: disableFields,
    enableFields: enableFields
  };
})();
