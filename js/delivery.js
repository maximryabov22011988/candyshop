'use strict';

(function () {
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;
  var enableFields = window.order.enableFields;
  var disableFields = window.order.disableFields;

  var deliveryTabs = window.tabs.deliveryTabs;
  deliveryTabs.setActiveTab(0);
  deliveryTabs.init();

  var storeTab = document.querySelector('.toggle-btn__label[for="payment__card"]');
  var courierTab = document.querySelector('.toggle-btn__label[for="payment__cash"]');
  var storeImage = document.querySelector('.deliver__store-map-img');
  var storeContainer = document.querySelector('.deliver__store-list');
  var courierContainer = document.querySelector('.deliver__entry-fields-wrap');

  storeTab.addEventListener('click', function () {
    disableFields('deliver__entry-fields-wrap');
  });

  courierTab.addEventListener('click', function () {
    enableFields('deliver__entry-fields-wrap');
  });

  storeContainer.addEventListener('click', function (evt) {
    var target = evt.target;

    if (target.tagName.toLowerCase() !== 'label') {
      return;
    }

    var name = target.htmlFor.slice(6);
    storeImage.src = 'img/map/' + name + '.jpg';

    var targetInput = target.previousElementSibling;
    targetInput.setAttribute('checked', true);
    targetInput.checked = true;
  });

  courierContainer.addEventListener('input', function (evt) {
    validateField(evt, customValidation);

    if (evt.target.checkValidity() === true) {
      verifyField(evt, customValidation);
    }
  });
})();
