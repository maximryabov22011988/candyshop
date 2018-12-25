'use strict';

(function () {
  var KEYCODE = window.util.KEYCODE;


  /**
   * Функция-конструктор для создания табов.
   *
   * @param {string} containerClassName - класс контейнера, куда нужно добавить табы
   */
  var Tabs = function (containerClassName) {
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

  /**
   * Устанавливает, какой таб нужно показать.
   *
   * @param {number} dataId - id таба, который нужно показать
   */
  Tabs.prototype.setActiveTab = function (dataId) {
    this.activeTab = dataId;
  };

  /**
   * Инициализирует табы.
   */
  Tabs.prototype.init = function () {
    this.reset();
    this.tabInput = this.container.querySelector('.toggle-btn__input[data-id="' + this.activeTab + '"]');
    this.tabInput.checked = true;
    this.tabContainer = this.container.querySelector('.toggle-btn__container[data-id="' + this.activeTab + '"]');
    this.tabContainer.classList.remove('visually-hidden');
  };

  /**
   * Сбрасывает все табы.
   */
  Tabs.prototype.reset = function () {
    this.tabInputs = this.container.querySelectorAll('.toggle-btn__input');
    this.tabContainers = this.container.querySelectorAll('.toggle-btn__container');
    for (var i = 0; i < this.tabInputs.length; i++) {
      this.tabInputs[i].checked = false;
      this.tabContainers[i].classList.add('visually-hidden');
    }
  };

  /**
   * Переключает табы.
   *
   * @param  {object} evt - объект event
   */
  Tabs.prototype.toggleTab = function (evt) {
    if (!evt.target.classList.contains('toggle-btn__label')) {
      return;
    }

    var id = parseInt(evt.target.dataset.id, 10);

    this.reset();
    this.tabInput = this.container.querySelector('.toggle-btn__input[data-id="' + id + '"]');
    this.tabInput.checked = true;
    this.tabContainer = this.container.querySelector('.toggle-btn__container[data-id="' + id + '"]');
    this.tabContainer.classList.remove('visually-hidden');
  };


  window.tabs = {
    paymentTabs: new Tabs('payment'),
    deliveryTabs: new Tabs('deliver')
  };
})();
