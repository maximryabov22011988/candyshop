'use strict';

(function () {
  var orderForm = document.querySelector('.buy form');
  var orderFormFields = orderForm.querySelectorAll('input');

  var paymentFieldContainer = document.querySelector('.payment__inputs');
  var paymentFieldElements = paymentFieldContainer.querySelectorAll('.text-input__input');
  var paymentStatusMessageElement = orderForm.querySelector('.payment__card-status');

  var submitButton = orderForm.querySelector('.buy__submit-btn');

  var customValidation = {
    'card-number': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Номер карты должен содержать 16 цифр',
        invalid: 'Неверный номер карты',
      },
      checkValue: function (cardNumber) {
        var sum = 0;
        var numbers = cardNumber.split('');

        if (cardNumber.length > 16) {
          numbers.forEach(function (number, index) {
            if (number === ' ') {
              numbers.splice(index, 1);
            }
          });
        }

        for (var i = 0; i < numbers.length; i++) {
          var number = Number(numbers[i]);

          if (i % 2 === 0) {
            number *= 2;
            if (number > 9) {
              number -= 9;
            }
          }

          sum += number;
        }

        return (sum === 0) ? false : sum % 10 === 0;
      },
      formatValue: function (input) {
        if (input.name === 'card-number') {
          var cardNumber = input.value.replace(/[^\d]/g, '').substring(0, 16);
          input.value = (cardNumber !== '') ? cardNumber.match(/.{1,4}/g).join(' ') : '';
        }
      }
    },
    'card-date': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Заполните в формате мм/гг',
        invalid: 'Некорректная дата',
      },
      checkValue: function (cardDate) {
        var dates = cardDate.split('/');
        var month = Number(dates[0]);
        var year = Number(dates[1]);
        return (month >= 1 && month <= 12 && year >= 0) ? true : false;
      },
      formatValue: function (input) {
        if (input.name === 'card-date') {
          var date = input.value.replace(/[^\d]/g, '').substring(0, 5);
          var month = Number(date.substring(0, 2));
          var year = Number(date.slice(2));
          input.value = (date !== '') ? date.match(/.{1,2}/g).join('\/') : '';

          if (month > 12 && year) {
            input.value = '12/' + year;
          }
        }
      }
    },
    'card-cvc': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Поле CVC должно содержать 3 цифры',
        invalid: 'Неверный CVC',
      },
      checkValue: function (cvc) {
        return (cvc >= 100 && cvc < 1000) ? true : false;
      },
      formatValue: function (input) {
        if (input.name === 'card-cvc') {
          input.value = input.value.replace(/[^\d]/g, '');
        }
      }
    },
    'cardholder': {
      messages: {
        required: 'Поле обязательно для заполнения',
        invalid: 'Поле должно содержать только заглавные, латинские буквы'
      },
      checkValue: function (fullname) {
        var names = fullname.split(' ');
        return (names.length === 2 && names[0].length >= 2 && names[1].length >= 2) ? true : false;
      },
      formatValue: function (input) {
        if (input.name === 'cardholder') {
          input.value = input.value.replace(/[^A-Z\s]/g, '');
        }
      }
    }
  };

  var renderErrorMessage = function (input, errorMessage) {
    var errorElement = document.createElement('p');
    errorElement.className = 'text-input__error-message';
    errorElement.textContent = errorMessage;

    input.parentElement.appendChild(errorElement);
  };

  var changeErrorMessage = function (input, errorMessage) {
    var errorElement = input.parentElement.querySelector('.text-input__error-message');
    errorElement.textContent = errorMessage;
  };

  var clearErrorMessage = function (input) {
    var errorElements = input.parentElement.querySelector('.text-input__error-message');
    if (errorElements) {
      errorElements.textContent = '';
    }
  };

  var changeErrorClassName = function (input, isCorrect) {
    if (isCorrect) {
      input.parentElement.classList.remove('text-input--error');
      input.parentElement.classList.add('text-input--correct');
    } else {
      input.parentElement.classList.remove('text-input--correct');
      input.parentElement.classList.add('text-input--error');
    }
  };

  var verificationValue = function (evt, validation, input) {
    if (!input) {
      input = evt.target;
    }

    var fieldName = input.name;
    var fieldErrorElement = input.parentElement.querySelector('.text-input__error-message');

    if (!validation[fieldName].checkValue(input.value)) {
      changeErrorClassName(input);

      if (!fieldErrorElement) {
        renderErrorMessage(input, validation[fieldName].messages.invalid);
      } else {
        changeErrorMessage(input, validation[fieldName].messages.invalid);
      }

      evt.preventDefault();
      return false;
    }

    return true;
  };

  var validateFields = function (evt, validation, input) {
    var target = evt.target;
    var isValid = true;

    if (input || target.tagName.toLowerCase() !== 'input') {
      target = input;
    }

    if (target.tagName.toLowerCase() === 'input') {
      var targetName = target.name;
      var targetErrorElement = target.parentElement.querySelector('.text-input__error-message');

      if (validation[targetName].formatValue) {
        validation[targetName].formatValue(target);
      }

      if (target.validity.valid) {
        clearErrorMessage(target);
        changeErrorClassName(target, true);
      } else if (target.validity.valueMissing) {
        isValid = false;
        changeErrorClassName(target);
        if (!targetErrorElement) {
          renderErrorMessage(target, validation[targetName].messages.required);
        } else {
          changeErrorMessage(target, validation[targetName].messages.required);
        }
        evt.preventDefault();
      } else if (target.validity.patternMismatch) {
        isValid = false;
        changeErrorClassName(target);
        if (!targetErrorElement) {
          renderErrorMessage(target, validation[targetName].messages.pattern);
        } else {
          changeErrorMessage(target, validation[targetName].messages.pattern);
        }
        evt.preventDefault();
      }
    }

    return isValid;
  };

  paymentFieldContainer.addEventListener('input', function (evt) {
    validateFields(evt, customValidation);
    if (evt.target.checkValidity() === true) {
      verificationValue(evt, customValidation);
    }
  });

  paymentFieldContainer.addEventListener('blur', function () {
    var totalVerification = [];

    for (var k = 0; k < paymentFieldElements.length; k++) {
      var field = paymentFieldElements[k];
      totalVerification[k] = customValidation[field.name].checkValue(field.value);
    }

    var isVerify = totalVerification.every(function (verifyValue) {
      return verifyValue === true;
    });

    if (isVerify) {
      paymentStatusMessageElement.textContent = 'Одобрен';
    } else {
      paymentStatusMessageElement.textContent = 'Не определён';
    }
  }, true);

  submitButton.addEventListener('click', function (evt) {
    var stopSubmit = false;

    for (var i = 0; i < orderFormFields.length; i++) {
      var field = orderFormFields[i];

      if (field.checkValidity() === false) {
        stopSubmit = true;
      }
    }

    if (stopSubmit) {
      evt.preventDefault();
    }
  });

  // Не забыть удалить!!!
  orderForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
  });
})();
