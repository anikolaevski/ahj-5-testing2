import CardCheckComponent from './CardCheckComponent';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#ComponentContainer');
  const widget = new CardCheckComponent(container);
  widget.bindToDOM();
  // eslint-disable-next-line no-console
  console.log('Component started!');
});
