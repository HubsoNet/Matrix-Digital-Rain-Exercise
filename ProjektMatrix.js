const canvas = document.querySelector('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const c = canvas.getContext('2d');
const symbolSize = 26;
const timeStart = performance.now();
let timeEnd;
let words = 'PROJEKT PANDORA';
let alpha = 1;
let extraAlpha = 0;
words = words.split('');
let tick = 1;

function Symbol(x, y, speed, first) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.switchInterval = Math.floor(Math.random() * 10 + 6);
  this.first = first;

  this.setToRandomSymbol = () => {
    timeEnd = performance.now();
    const frameCount = Math.round((timeEnd - timeStart) / 16);
    if (frameCount % this.switchInterval === 0) {
      this.value = String.fromCharCode(
        0x30A0 + Math.floor(Math.random() * 96),
      );
    }
  };

  this.rain = () => {
    this.y = (this.y >= window.innerHeight) ? 0 : this.y += this.speed;
  };
}

function Stream() {
  this.symbols = [];
  this.totalSymbols = Math.floor(Math.random() * 26 + 5);
  this.speed = (Math.floor(Math.random() * 9) + 2);

  this.generateSymbols = (x, y) => {
    let first = Math.round(Math.random() / 1.2) === 1;
    for (let i = 0; i <= this.totalSymbols; i += 1) {
      const symbol = new Symbol(x, y, this.speed, first);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
      first = false;
    }

    this.render = () => {
      this.symbols.forEach((symbol) => {
        if (symbol.first === true) {
          c.fillStyle = `rgba(220, 255, 220, ${alpha})`;
        } else {
          c.fillStyle = `rgba(0, 255, 43, ${alpha})`;
        }
        c.font = `bold ${symbolSize}px serif`;
        c.fillText(symbol.value, symbol.x, symbol.y);
        symbol.rain();
        symbol.setToRandomSymbol();
      });
    };
  };
}

function Writing() {
  this.symbols = [];

  this.generateSymbols = () => {
    for (let i = 0; i <= words.length - 1; i += 1) {
      if (words[i] === ' ') continue;
      const symbol = new Symbol((window.innerWidth / 2) - (((words.length - 1) / 2) * symbolSize) + (i * symbolSize), window.innerHeight / 2);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
    }
  };

  this.render = () => {
    this.symbols.forEach((symbol) => {
      c.fillStyle = `rgba(0, 255, 43, ${Math.abs(alpha - 1) - extraAlpha})`;
      c.font = `bold ${symbolSize}px serif`;
      c.fillText(symbol.value, symbol.x, symbol.y);
      symbol.setToRandomSymbol();
    });
  };
}

function Pandora() {
  this.symbols = words;

  this.render = () => {
    let i = 0;
    this.symbols.forEach((symbol) => {
      c.fillStyle = `rgba(0, 255, 43, ${Math.abs(alpha - 1) * 0.70})`;
      c.font = `bold ${symbolSize}px serif`;
      c.fillText(symbol, ((window.innerWidth / 2) - (((words.length - 1) / 2) * symbolSize) + (i * symbolSize)), window.innerHeight / 2);
      i += 1;
    });
  };
}

const streams = [];
let x = 0;

for (let i = 0; i <= window.innerWidth / symbolSize; i += 1) {
  const stream = new Stream();
  stream.generateSymbols(x, Math.floor(Math.random() * 2000 + -2000));
  streams.push(stream);
  x += symbolSize;
}

const writing = new Writing();
writing.generateSymbols();

const pandora = new Pandora(words);

function draw() {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (tick >= 570) extraAlpha += 0.06;
  writing.render();
  pandora.render();
  streams.forEach((stream) => {
    stream.render();
  });
}

setInterval((() => {
  if (tick >= 300) {
    if (alpha > 0.5) alpha -= 0.002;
    else if (alpha > 0.75) alpha -= 0.005;
    else if (alpha > 0.9) alpha -= 0.007;
    else alpha -= 0.008;
  }
  draw();
  tick += 1;
}), 1000 / 60);
