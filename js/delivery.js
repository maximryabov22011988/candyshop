'use strict';

(function () {
  var customValidation = window.validate.customValidation;
  var validateField = window.validate.validateField;
  var verifyField = window.validate.verifyField;
  var enableFields = window.order.enableFields;
  var disableFields = window.order.disableFields;
  var deliveryTabs = window.tabs.deliveryTabs;


  var MAPS_PATH = 'img/map/';

  var storeTabElement = document.querySelector('.toggle-btn__label[for="payment__card"]');
  var courierTabElement = document.querySelector('.toggle-btn__label[for="payment__cash"]');
  var storeImageElement = document.querySelector('.deliver__store-map-img');
  var storeContainerElement = document.querySelector('.deliver__store-list');
  var courierContainerElement = document.querySelector('.deliver__entry-fields-wrap');

  deliveryTabs.setActiveTab(0);
  deliveryTabs.init();

  storeTabElement.addEventListener('click', function () {
    disableFields('deliver__entry-fields-wrap');
  });

  courierTabElement.addEventListener('click', function () {
    enableFields('deliver__entry-fields-wrap');
  });

  storeContainerElement.addEventListener('click', function (evt) {
    if (evt.target.tagName.toLowerCase() !== 'label') {
      return;
    }
    var target = evt.target;
    var targetInput = target.previousElementSibling;
    targetInput.checked = true;
    storeImageElement.src = MAPS_PATH + target.htmlFor.slice(6) + '.jpg';
  });

  courierContainerElement.addEventListener('input', function (evt) {
    validateField(evt, customValidation);
    if (evt.target.checkValidity() === true) {
      verifyField(evt, customValidation);
    }
  });
})();
