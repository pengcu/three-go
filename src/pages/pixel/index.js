import p5 from 'p5';

const sketch = (s) => {
  s.setup = () => {
    s.createCanvas(700, 700);
  }

  let t = 0;
  s.draw = () => {
    t += 0.001;
    s.blendMode(s.BLEND);
    s.fill(0, 20);
    s.noStroke();
    s.rect(0, 0, s.width, s.height);
    s.blendMode(s.ADD);
    let block_sz = 9;
    for (let x = 0; x < s.width; x += block_sz) {
      for (let y = 0; y < s.height; y += block_sz) {
        s.noStroke();
        let STRIBE_H = s.noise(x / 50, t, y / 500);
        let STRIBE_L = s.noise(100 - y / 50, -t, x / 500);
        let LOWFREQ = s.noise(x / 500, y / 500, t);
        let HIGHFREQ = s.noise(x / 100, y / 100, t);
        let SINCOS = s.sin(x / 100 + t) * s.cos(y / 100 - t);
        let staged = 150 * (((HIGHFREQ * 0.1 + LOWFREQ) * 10) % 1);
        // rgb
        s.fill(staged * 0.01, staged * 0.06, staged * 0.1);
        s.rect(x, y, block_sz - 3, block_sz - 3);
        if (((LOWFREQ * 10) % 1) < 0.1) {
          s.fill(255 * 0.1, 50 * 0.1, 80 * 0.1);
          s.rect(x, y, block_sz - 3, block_sz - 3);
        }
        if (((HIGHFREQ * 2) % 1) < 0.01) {
          s.fill(0, 0, 0);
          s.rect(x, y, block_sz - 3, block_sz - 3);
          s.fill(30 * 0.1, 20 * 0.1, 50 * 0.1);
          s.rect(x + block_sz, y, block_sz - 3, block_sz - 3);
        }
        if (((STRIBE_H * LOWFREQ) * 5 % 1) > 0.99) {
          s.fill(90 * 0.1, 120 * 0.1, 50 * 0.1);
          s.rect(x - block_sz, y, block_sz - 3, block_sz - 3);
        }
        if (((STRIBE_L * LOWFREQ) * 5 % 1) > 0.99) {
          s.fill(50 * 0.1, 50 * 0.1, 120 * 0.5);
          s.rect(x - block_sz, y, block_sz - 3, block_sz - 3);
        }
      }
    }
  }
}

const sketchInstance = new p5(sketch);