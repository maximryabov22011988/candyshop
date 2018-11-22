'use strict';

(function () {
  var KEYCODE = window.util.KEYCODE;

  var maxPrice = 10000;

  var rangeElement = document.querySelector('.range');
  var rangeControlElement = rangeElement.querySelector('.range__filter');
  var leftPin = rangeElement.querySelector('.range__btn--left');
  var rightPin = rangeElement.querySelector('.range__btn--right');
  var rangeFillLine = rangeElement.querySelector('.range__fill-line');
  var rangePriceMin = rangeElement.querySelector('.range__price--min');
  var rangePriceMax = rangeElement.querySelector('.range__price--max');

  var rangeControlWidth = rangeControlElement.offsetWidth;
  var pinWidth = rightPin.offsetWidth;

  rangePriceMin.textContent = 0;
  rangePriceMax.textContent = maxPrice;

  var calcPrice = function (moveX, startX, price, isleftPin) {
    var priceDiff = Math.floor((Math.abs(moveX - startX) / rangeControlWidth) * price);
    return isleftPin ? (price - priceDiff) : priceDiff;
  };

  var movePinTo = function (newX, leftEdge, rightEdge, isLeftPin) {
    if (newX < leftEdge) {
      newX = leftEdge;
    } else if (newX > rightEdge) {
      newX = rightEdge;
    }

    if (isLeftPin) {
      leftPin.style.left = newX + 'px';
      rangeFillLine.style.left = newX + 'px';
      rangePriceMin.textContent = calcPrice(newX, rangeControlWidth, maxPrice, isLeftPin);
    } else {
      rightPin.style.right = newX + 'px';
      rangeFillLine.style.right = newX + 'px';
      rangePriceMax.textContent = calcPrice(newX, rangeControlWidth, maxPrice);
    }
  };

  rangeControlElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var target = evt.target;
    var targetClass = target.classList;
    var isPin = targetClass.contains('range__btn');
    var isLeftPin = targetClass.contains('range__btn--left');
    var isRightPin = targetClass.contains('range__btn--right');

    if (!isPin || evt.which !== KEYCODE['LEFT_MOUSE_BUTTON']) {
      return;
    }

    var pinCoords = {
      leftPin: {
        startX: leftPin.offsetLeft
      },
      rightPin: {
        startX: rightPin.offsetLeft
      }
    };

    var moveRangeButton = function (moveEvt) {
      var newX;

      if (isLeftPin) {
        newX = pinCoords.leftPin.startX + (moveEvt.clientX - evt.clientX);
        movePinTo(newX, 0, (pinCoords.rightPin.startX - pinWidth), isLeftPin);
      } else if (isRightPin) {
        newX = rangeControlWidth - pinCoords.rightPin.startX - (moveEvt.clientX - evt.clientX);
        movePinTo(newX, 0, (rangeControlWidth - (pinCoords.leftPin.startX + pinWidth * 2)));
      }
    };

    var fixRangeButton = function () {
      document.removeEventListener('mousemove', moveRangeButton);
      document.removeEventListener('mouseup', fixRangeButton);
    };

    document.addEventListener('mousemove', moveRangeButton);
    document.addEventListener('mouseup', fixRangeButton);
  });
})();
