import CardCheckComponent from '../src/js/CardCheckComponent';

test('should render self', () => {
  document.body.innerHTML = '<div id="ComponentContainer"></div>';
  const container = document.querySelector('#ComponentContainer');
  const widget = new CardCheckComponent(container);
  widget.bindToDOM();
  expect(container.innerHTML).toEqual(CardCheckComponent.markup);
});

test.each([
  ['5084840100137725', 'проверено'],
  ['5121075011631319', 'проверено'],
  ['5856373368004110', 'проверено'],
  ['4229680011724554', 'ошибка'],
])(('checkLuhn("%s") should be "%s"'), (input, expected) => {
  document.body.innerHTML = '<div id="ComponentContainer"></div>';
  const container = document.querySelector('#ComponentContainer');
  const widget = new CardCheckComponent(container);
  widget.bindToDOM();
  const myInput = container.querySelector(widget.constructor.inputSelector);
  const mySubmit = container.querySelector(widget.constructor.submitSelector);
  const entercardState = container.querySelector(widget.constructor.stateSelector);
  myInput.value = input;
  mySubmit.click();
  expect(entercardState.innerText).toBe(expected);
});

test.each([
  ['2', 'Мир', 'sn-mir'],
  ['30', 'Diners Club', 'sn-dinersclub'],
  ['36', 'Diners Club', 'sn-dinersclub'],
  ['38', 'Diners Club', 'sn-dinersclub'],
  ['31', 'JCB International', 'sn-jsb'],
  ['35', 'JCB International', 'sn-jsb'],
  ['34', 'American Express', 'sn-amex'],
  ['37', 'American Express', 'sn-amex'],
  ['4', 'VISA', 'sn-visa'],
  ['50', 'Maestro', 'sn-maestro'],
  ['56', 'Maestro', 'sn-maestro'],
  ['57', 'Maestro', 'sn-maestro'],
  ['58', 'Maestro', 'sn-maestro'],
  ['51', 'MasterCard', 'sn-mastercard'],
  ['52', 'MasterCard', 'sn-mastercard'],
  ['53', 'MasterCard', 'sn-mastercard'],
  ['54', 'MasterCard', 'sn-mastercard'],
  ['55', 'MasterCard', 'sn-mastercard'],
  ['60', 'Discover', 'sn-discover'],
  ['62', 'China UnionPay', 'sn-unionpay'],
  ['63', 'Maestro', 'sn-maestro'],
  ['67', 'Maestro', 'sn-maestro'],
  ['7', 'УЭК', 'sn-uek'],
])(('starts with %d should be "%s" and "%s" classes'), (startdigits, systemName, classes) => {
  document.body.innerHTML = '<div id="ComponentContainer"></div>';
  const container = document.querySelector('#ComponentContainer');
  const widget = new CardCheckComponent(container);
  widget.bindToDOM();
  const myInput = container.querySelector(widget.constructor.inputSelector);
  const entercardTyp = container.querySelector(widget.constructor.EnterCardTypSelector);
  myInput.value = startdigits;
  const event = new Event('input');
  myInput.dispatchEvent(event);
  expect(entercardTyp.innerText).toBe(systemName);
  const cardIcon = document.querySelector(`.${classes}`);
  expect(cardIcon.classList.contains('selectedcardtype')).toBe(true);
  expect(cardIcon.classList.contains('sn-unselected')).toBe(false);
});

test.each([
  [123], [0], [1], [3], [5], [6], [8], [9],
])(('starts with %d should NOT detect payment system'), (startdigits) => {
  document.body.innerHTML = '<div id="ComponentContainer"></div>';
  const container = document.querySelector('#ComponentContainer');
  const widget = new CardCheckComponent(container);
  widget.bindToDOM();
  const myInput = container.querySelector(widget.constructor.inputSelector);
  const entercardTyp = container.querySelector(widget.constructor.EnterCardTypSelector);
  myInput.value = startdigits;
  const event = new Event('input');
  myInput.dispatchEvent(event);
  expect(entercardTyp.innerText).toBe('');
  const logoGroup = document.querySelector(widget.constructor.logoGroupSelector);
  const logoIcons = logoGroup.children;
  for (const icon of logoIcons) {
    expect(icon.classList.contains('selectedcardtype')).toBe(false);
  }
});
