'use strict';

(function () {
  /**
   * Проверяет корректно ли заполнено слово.
   *
   * @param  {string}  word - слово для проверки
   * @return {boolean}      - true / false
   */
  var isCorrectWord = function (word) {
    return word.length > 0 && word[0] !== ' ';
  };

  /**
   * Проверяет корректность числа.
   *
   * @param  {number}  number - число для проверки
   * @return {boolean}        - true / false
   */
  var isCorrectNumber = function (number) {
    return parseInt(number, 10) !== 0;
  };

  /**
   * Проверяет длину номера телефона.
   *
   * @param  {string} phoneNumber - введенный номер
   * @return {boolean}            - true / false
   */
  var checkPhoneLength = function (phoneNumber) {
    return phoneNumber.length === 18;
  };

  /**
   * Проверяет номер банковской карты с помощью алгоритма Луна.
   *
   * @param  {string} cardNumber - введенный номер карты
   * @return {boolean}           - true / false
   */
  var checkCardNumber = function (cardNumber) {
    var sum = 0;
    var numbers = cardNumber.split('');

    if (cardNumber.length > 16) {
      numbers.forEach(function (number, index) {
        if (number === ' ') {
          numbers.splice(index, 1);
        }
      });
    }

    numbers.forEach(function (number, i) {
      number = parseInt(number, 10);
      if (i % 2 === 0) {
        number *= 2;
        if (number > 9) {
          number -= 9;
        }
      }
      sum += number;
    });

    return (sum === 0) ? false : sum % 10 === 0;
  };

  /**
   * Проверяет CVC банковской карты.
   *
   * @param  {string} cvc - введенный cvc
   * @return {boolean}    - true / false
   */
  var checkCardCvc = function (cvc) {
    return cvc >= 100 && cvc < 1000;
  };

  /**
   * Форматирует поле - имени.
   *
   * @param  {DOM} input - поле для проверки
   */
  var formatName = function (input) {
    if (input.name === 'name') {
      input.value = input.value.replace(/[^A-zА-яЁё\s]/g, '');
    }
  };

  /**
   * Форматирует поле - номера банковской карты.
   *
   * @param  {DOM} input - поле для проверки
   */
  var formatCardNumber = function (input) {
    if (input.name === 'card-number') {
      var cardNumber = input.value.replace(/[^\d]/g, '').substring(0, 16);
      input.value = (cardNumber !== '') ? cardNumber.match(/.{1,4}/g).join(' ') : '';
    }
  };

  /**
   * Форматирует поле - cvc банковской карты.
   *
   * @param  {DOM} input - поле для проверки
   */
  var formatCardCvc = function (input) {
    if (input.name === 'card-cvc') {
      input.value = input.value.replace(/[^\d]/g, '');
    }
  };

  /**
   * Форматирует поле - cardholder банковской карты.
   *
   * @param  {DOM} input - поле для проверки
   */
  var formatCardHolder = function (input) {
    if (input.name === 'cardholder') {
      input.value = input.value.replace(/[^A-zА-я\s]/g, '').toUpperCase();
    }
  };

  /**
   * Форматирует поле - номер дома.
   *
   * @param  {DOM} input - поле для проверки
   */
  var formatDeliveryHouse = function (input) {
    if (input.name === 'deliver-house') {
      input.value = input.value.replace(/[^0-9-/\\А-я\s]/g, '');
    }
  };

  /**
   * Форматирует поле - номер этажа.
   *
   * @param  {DOM} input - поле для проверки
   */
  var formatDeliveryFloor = function (input) {
    if (input.name === 'deliver-floor') {
      input.value = input.value.replace(/[^0-9]/g, '');
    }
  };

  /**
   * Форматирует поле - номер квартиры.
   *
   * @param  {DOM} input - поле для проверки
   */
  var formatDeliveryRoom = function (input) {
    if (input.name === 'deliver-room') {
      input.value = input.value.replace(/[^0-9]/g, '');
    }
  };

  var customValidation = {
    'name': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Некорректное имя',
        invalid: 'Имя должно содержать минимум 2 букву',
      },
      checkValue: isCorrectWord,
      formatValue: formatName
    },
    'tel': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Номер телефона должен содержать 10 цифр',
        invalid: null,
      },
      checkValue: checkPhoneLength,
      formatValue: null
    },
    'email': {
      messages: {
        required: null,
        pattern: 'Некорректный e-mail',
        invalid: null,
      },
      checkValue: isCorrectWord,
      formatValue: null
    },
    'card-number': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Номер карты должен содержать 16 цифр',
        invalid: 'Такой карты не существует',
      },
      checkValue: checkCardNumber,
      formatValue: formatCardNumber
    },
    'card-date': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Заполните в формате мм/гг',
        invalid: 'Некорректная дата',
      },
      checkValue: function (cardDate) {
        var dates = cardDate.split('/');
        var month = parseInt(dates[0], 10);
        var year = parseInt(dates[1], 10);
        var currentYear = parseInt(String(new Date().getFullYear()).slice(2), 10);
        return (month >= 1 && month <= 12 && year >= currentYear) ? true : false;
      },
      formatValue: function (input) {
        if (input.name === 'card-date') {
          var date = input.value.replace(/[^\d]/g, '').substring(0, 5);
          var month = parseInt(date.substring(0, 2), 10);
          var year = parseInt(date.slice(2), 10);
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
      checkValue: checkCardCvc,
      formatValue: formatCardCvc
    },
    'cardholder': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Поле должно содержать только латинские буквы',
        invalid: null
      },
      checkValue: isCorrectWord,
      formatValue: formatCardHolder
    },
    'deliver-street': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Название улицы не может состоять только из цифры, пробела или знака препинания',
        invalid: null,
      },
      checkValue: isCorrectWord,
      formatValue: null
    },
    'deliver-house': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: 'Некорректное значение',
        invalid: 'Такого номера дома не существует',
      },
      checkValue: isCorrectNumber,
      formatValue: formatDeliveryHouse
    },
    'deliver-floor': {
      messages: {
        required: null,
        pattern: null,
        invalid: 'Такого этажа нет',
      },
      checkValue: isCorrectNumber,
      formatValue: formatDeliveryFloor
    },
    'deliver-room': {
      messages: {
        required: 'Поле обязательно для заполнения',
        pattern: null,
        invalid: 'Некорректный номер квартиры',
      },
      checkValue: isCorrectNumber,
      formatValue: formatDeliveryRoom
    },
  };

  /**
   * Рендерит элемент ошибки.
   *
   * @param  {DOM} input           - поле, где нужно добавить элемент с описанием ошибки
   * @param  {string} errorMessage - описание ошибки
   */
  var renderErrorMessage = function (input, errorMessage) {
    var errorElement = document.createElement('p');
    errorElement.className = 'text-input__error-message';
    errorElement.textContent = errorMessage;
    input.parentElement.appendChild(errorElement);
  };

  /**
   * Изменяет текст ошибки.
   *
   * @param  {DOM} input           - поле, где нужно изменить элемент с описанием ошибки
   * @param  {string} errorMessage - новое описание ошибки
   */
  var changeErrorMessage = function (input, errorMessage) {
    var errorElement = input.parentElement.querySelector('.text-input__error-message');
    errorElement.textContent = errorMessage;
  };

  /**
   * Очищает текст ошибки.
   *
   * @param  {DOM} input - поле, где нужно очистить элемент с описанием ошибки
   */
  var clearErrorMessage = function (input) {
    var errorElements = input.parentElement.querySelector('.text-input__error-message');
    if (errorElements) {
      errorElements.textContent = '';
    }
  };

  /**
   * Изменяет css-класс контейнера при заполении поля.
   *
   * @param  {DOM} input           - поле, где нужно очистить элемент с описанием ошибки
   * @param  {Boolean} isCorrect   - флаг корректного заполнения поля
   */
  var changeErrorClassName = function (input, isCorrect) {
    if (isCorrect) {
      input.parentElement.classList.remove('text-input--error');
      input.parentElement.classList.add('text-input--correct');
    } else {
      input.parentElement.classList.remove('text-input--correct');
      input.parentElement.classList.add('text-input--error');
    }
  };

  /**
   * Валидирует поле (проверяет правильность заполнения).
   *
   * @param  {object} evt        - объект event
   * @param  {object} validation - объект кастомной валидации
   * @param  {DOM} input         - поле для проверки
   * @return {boolean}           - true / false
   */
  var validateField = function (evt, validation, input) {
    if (input || evt.target.tagName.toLowerCase() !== 'input') {
      target = input;
    }

    var target = evt.target;
    var isValid = true;

    if (target.tagName.toLowerCase() === 'input') {
      var targetName = target.name;
      var targetErrorElement = target.parentElement.querySelector('.text-input__error-message');

      if (validation[targetName].formatValue) {
        validation[targetName].formatValue(target);
      }

      if (target.validity.valid) {
        clearErrorMessage(target);
        changeErrorClassName(target, true);
      }

      if (target.validity.valueMissing) {
        isValid = false;
        changeErrorClassName(target);
        if (!targetErrorElement) {
          renderErrorMessage(target, validation[targetName].messages.required);
        } else {
          changeErrorMessage(target, validation[targetName].messages.required);
        }
        evt.preventDefault();
      }

      if (target.validity.patternMismatch) {
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

  /**
   * Верифицирует поле (проверяет корректно ли значение).
   * @param  {object} evt        - объект event
   * @param  {object} validation - объект кастомной валидации
   * @param  {DOM} input         - поле для проверки
   * @return {boolean}           - true / false
   */
  var verifyField = function (evt, validation, input) {
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


  window.validate = {
    customValidation: customValidation,
    validateField: validateField,
    verifyField: verifyField,
  };
})();
