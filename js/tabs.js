'use strict';

(function () {
  var KEYCODE = window.util.KEYCODE;

  var CreateTabs = function (containerClassName) {
    this.container = document.querySelector('.' + containerClassName);
    this.tabInputs = null;
    this.tabContainers = null;
    this.activeTab = null;

    this.container.addEventListener('click', function (evt) {
      this.toggleTab(evt);
    }.bind(this));

    this.container.addEventListener('keydown', function (evt) {
      if (evt.which === KEYCODE['ENTER']) {
        this.toggleTab(evt);
      }
    }.bind(this));
  };

  CreateTabs.prototype.setActiveTab = function (dataId) {
    this.activeTab = dataId;
  };

  CreateTabs.prototype.init = function () {
    this.reset();

    this.tabInput = this.container.querySelector('.toggle-btn__input[data-id="' + this.activeTab + '"]');
    this.tabInput.setAttribute('checked', true);
    this.tabInput.checked = true;

    this.tabContainer = this.container.querySelector('.toggle-btn__container[data-id="' + this.activeTab + '"]');
    this.tabContainer.classList.remove('visually-hidden');
  };

  CreateTabs.prototype.reset = function () {
    this.tabInputs = this.container.querySelectorAll('.toggle-btn__input');
    this.tabContainers = this.container.querySelectorAll('.toggle-btn__container');

    for (var i = 0; i < this.tabInputs.length; i++) {
      this.tabInputs[i].setAttribute('checked', false);
      this.tabInputs[i].checked = false;
      this.tabContainers[i].classList.add('visually-hidden');
    }
  };

  CreateTabs.prototype.toggleTab = function (evt) {
    var target = evt.target;

    if (!target.classList.contains('toggle-btn__label')) {
      return;
    }

    var id = parseInt(target.dataset.id, 10);

    this.reset();

    this.tabInput = this.container.querySelector('.toggle-btn__input[data-id="' + id + '"]');
    this.tabInput.setAttribute('checked', true);
    this.tabInput.checked = true;

    this.tabContainer = this.container.querySelector('.toggle-btn__container[data-id="' + id + '"]');
    this.tabContainer.classList.remove('visually-hidden');
  };

  window.tabs = {
    paymentTabs: new CreateTabs('payment'),
    deliveryTabs: new CreateTabs('deliver')
  };
})();
