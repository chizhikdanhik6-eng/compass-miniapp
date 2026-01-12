const needle = document.getElementById('needle');

needle.animate(
  [
    { transform: 'rotate(-18deg)' },
    { transform: 'rotate(14deg)' },
    { transform: 'rotate(14deg)' }, // пауза
    { transform: 'rotate(0deg)' }   // фиксация
  ],
  {
    duration: 1300,
    easing: 'ease-in-out',
    fill: 'forwards'
  }
);
