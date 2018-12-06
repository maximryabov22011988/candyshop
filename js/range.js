'use strict';

(function () {
  var KEYCODE = window.util.KEYCODE;

  var rangeElement = document.querySelector('.range');
  var rangeControlElement = rangeElement.querySelector('.range__filter');
  var leftPin = rangeElement.querySelector('.range__btn--left');
  var rightPin = rangeElement.querySelector('.range__btn--right');
  var rangeFillLine = rangeElement.querySelector('.range__fill-line');
  var rangeMinValue = rangeElement.querySelector('.range__price--min');
  var rangeMaxValue = rangeElement.querySelector('.range__price--max');

  var rangeControlWidth = rangeControlElement.offsetWidth;
  var pinWidth = rightPin.offsetWidth;

  var getMinOfArray = function (goods) {
    var goodPrices = goods.map(function (good) {
      return good.price;
    });

    return Math.min.apply(null, goodPrices);
  };

  var getMaxOfArray = function (goods) {
    var goodPrices = goods.map(function (good) {
      return good.price;
    });

    return Math.max.apply(null, goodPrices);
  };

  var renderRangeAmount = function (goods) {
    rangeMinValue.textContent = getMinOfArray(goods);
    rangeMaxValue.textContent = getMaxOfArray(goods);
    window.minValue = getMinOfArray(goods) - 5;
    window.maxValue = getMaxOfArray(goods);
  };

  var calcPrice = function (moveX, startX, isleftPin) {
    var priceDiff = Math.floor((Math.abs(moveX - startX) / rangeControlWidth) * (window.maxValue - window.minValue));
    return isleftPin ? (window.maxValue - priceDiff) : (window.minValue + priceDiff);
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
      rangeMinValue.textContent = calcPrice(newX, rangeControlWidth, isLeftPin) + 5;
    } else {
      rightPin.style.right = newX + 'px';
      rangeFillLine.style.right = newX + 'px';
      rangeMaxValue.textContent = calcPrice(newX, rangeControlWidth);
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

  window.range = {
    renderRangeAmount: renderRangeAmount
  };
})();
