import { checkLuhn } from './checkLuhn';
import CardType from './CardType';

export default class CardCheckComponent {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static get markup() {
    return `
    <h1>Проверка карты</h1>
      <div id="entercardTyp" data-id="entercardTyp" class="cardtypeinfo"></div>
      <div id="logo-group" data-id="logo-group" class="logo-group">
        <div class="sn-icon sn-mir"></div>
        <div class="sn-icon sn-visa"></div>
        <div class="sn-icon sn-mastercard"></div>
        <div class="sn-icon sn-maestro"></div>
        <div class="sn-icon sn-jsb"></div>
        <div class="sn-icon sn-unionpay"></div>
        <div class="sn-icon sn-amex"></div>
        <div class="sn-icon sn-dinersclub"></div>
        <div class="sn-icon sn-discover"></div>
        <div class="sn-icon sn-uek"></div>
      </div>
      <form id="enterform" class="enterform">
        <label for="entercard">Номер карты:</label>
        <input id="entercard" name="entercard" data-id="entercard" type="text" size="30" value="">
        <button id="enterbutton" data-id="enterbutton">Проверка</button>
        <div id="entercardState" data-id="entercardState" class="invisible"></div>
      </form>
      <a href="licenses.txt">Лицензии</a>
    `;
  }

  static get inputSelector() {
    return '[data-id=entercard]';
  }

  static get submitSelector() {
    return '[data-id=enterbutton]';
  }

  static get stateSelector() {
    return '[data-id=entercardState]';
  }

  static get logoGroupSelector() {
    return '[data-id=logo-group]';
  }

  static get logoGroupDivSelector() {
    return '[data-id=logo-group] div';
  }

  static get EnterCardTypSelector() {
    return '[data-id=entercardTyp]';
  }

  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;
    const submit = this.parentEl.querySelector(this.constructor.submitSelector);
    submit.addEventListener('click', (evt) => this.onSubmit(evt));
    const input = this.parentEl.querySelector(this.constructor.inputSelector);
    input.addEventListener('input', (evt) => this.onInput(evt));
  }

  onSubmit(event) {
    event.preventDefault();
    const myInput = this.parentEl.querySelector(this.constructor.inputSelector);
    const entercardState = this.parentEl.querySelector(this.constructor.stateSelector);
    const checkString = myInput.value;
    const result = checkLuhn(checkString);
    if (result.LastDigit === result.calcLastDigit) {
      entercardState.innerText = 'проверено';
      entercardState.classList.remove('invisible');
      entercardState.classList.remove('errormsg');
      entercardState.classList.add('successmsg');
      myInput.classList.remove('invalid');
      myInput.classList.add('valid');
    } else {
      entercardState.innerText = 'ошибка';
      entercardState.classList.remove('invisible');
      entercardState.classList.remove('successmsg');
      entercardState.classList.add('errormsg');
      myInput.classList.add('invalid');
      myInput.classList.remove('valid');
    }
  }

  onInput(event) {
    const entercardTyp = this.parentEl.querySelector(this.constructor.EnterCardTypSelector);
    const text = event.target.value;
    const CardTyp = CardType(text);
    if (CardTyp) {
      entercardTyp.innerText = CardTyp.typ;
      // entercardTyp.classList.remove('invisible');
      this.shadowIcons(true, 'sn-unselected', CardTyp.classes);
    } else {
      entercardTyp.innerText = '';
      this.shadowIcons(false, 'sn-unselected', '');
    }
  }

  shadowIcons(mode, shadowclass, exclusionClass) {
    const elements = this.parentEl.querySelectorAll(this.constructor.logoGroupDivSelector);
    for (const node of elements) {
      if (!node.classList.contains(exclusionClass)) {
        if (mode) {
          node.classList.add(shadowclass);
        } else {
          node.classList.remove(shadowclass);
        }
        node.classList.remove('selectedcardtype');
      } else {
        node.classList.add('selectedcardtype');
      }
    }
  }
}
