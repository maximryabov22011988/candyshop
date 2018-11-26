'use strict';

(function () {
  var isEnterEvent = window.util.isEnterEvent;

  var orderForm = document.querySelector('.buy form');

  var deliveryCourierContent = orderForm.querySelector('.deliver__courier');
  var deliveryStoreContent = orderForm.querySelector('.deliver__store');
  var deliveryCourierInput = orderForm.querySelector('#deliver__courier');
  var deliveryStoreInput = orderForm.querySelector('#deliver__store');

  var paymentCardContent = orderForm.querySelector('.payment__card-wrap');
  var paymentCashContent = orderForm.querySelector('.payment__cash-wrap');
  var paymentCardInput = orderForm.querySelector('#payment__card');
  var paymentCashInput = orderForm.querySelector('#payment__cash');

  var toggleTab = function (evt) {
    var target = evt.target;

    if (target.tagName.toLowerCase() !== 'label') {
      return;
    }

    switch (target.htmlFor) {
      case 'deliver__courier':
        deliveryCourierInput.checked = true;
        deliveryStoreInput.checked = false;
        deliveryCourierContent.classList.remove('visually-hidden');
        deliveryStoreContent.classList.add('visually-hidden');
        break;
      case 'deliver__store':
        deliveryStoreInput.checked = true;
        deliveryCourierInput.checked = false;
        deliveryStoreContent.classList.remove('visually-hidden');
        deliveryCourierContent.classList.add('visually-hidden');
        break;
      case 'payment__card':
        paymentCardInput.checked = true;
        paymentCashInput.checked = false;
        paymentCardContent.classList.remove('visually-hidden');
        paymentCashContent.classList.add('visually-hidden');
        break;
      case 'payment__cash':
        paymentCardInput.checked = false;
        paymentCashInput.checked = true;
        paymentCashContent.classList.remove('visually-hidden');
        paymentCardContent.classList.add('visually-hidden');
        break;
    }
  };

  orderForm.addEventListener('click', function (evt) {
    toggleTab(evt);
  });

  orderForm.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, toggleTab);
  });
})();
