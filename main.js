import './style.css';

const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
const cx = innerWidth / 2;
const cy = innerHeight / 2;
const ctx = canvas.getContext('2d');
let pause = false;
const targetCounts = 10;

function recursionDraw(radius, itrCnt) {
  if (itrCnt <= 0) return;
  drawCircle(cx, cy, radius, '#0B71F4');
  recursionDraw(radius * 1.2, itrCnt - 1);
}

class Ray {
  constructor() {
    this.length = (innerWidth / 2) * 0.9;
    this.angle = 0;
    this.angleStep = Math.PI / 360;
  }
  draw() {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#0B71F4';
    ctx.fill();
    ctx.lineTo(0 + this.length, 0);
    ctx.closePath();
    ctx.strokeStyle = '#0B71F4';
    ctx.stroke();
    ctx.restore();
  }
  update() {
    this.angle += this.angleStep;
    if (this.angle >= Math.PI * 2) {
      this.angle = 0;
    }
  }
}
class Target {
  constructor() {
    this.r = 10;
    this.color = 'red';
    this.x = Math.floor(Math.random() * innerWidth);
    this.y = Math.floor(Math.random() * innerHeight);
    this.sectorAngle = (Math.PI / 180) * 4;
    this.legX = this.x - cx;
    this.legY = this.y - cy;
    this.atan = Math.PI / 2 - Math.atan2(this.legX, this.legY);
    this.angle = this.atan < 0 ? this.atan + Math.PI * 2 : this.atan;
    this.detected = false;
    this.elem = document.createElement('div');
    this.elem.classList.add('target');
    this.elem.style.left = `${this.x - 20}px`;
    this.elem.style.top = `${this.y - 20}px`;
    this.elem.addEventListener('animationend', (e) => {
      if (!(e.animationName === 'detecting-glow')) return;
      this.elem.classList.remove('active');
    });
  }
  draw() {
    drawCircle(this.x, this.y, this.r, this.color, this.detected);
    ctx.font = '14px serif';
    // ctx.fillText(this.angle, this.x, this.y);
  }
  update() {
    if (
      ray.angle > this.angle - this.sectorAngle &&
      ray.angle < this.angle + this.sectorAngle
    ) {
      // detected start
      if (!this.elem.classList.contains('active')) {
        this.elem.classList.add('active');
      }
      this.detected = true;
      this.color = 'green';
    } else {
      // detected end
      this.detected = false;
      this.color = 'red';
    }
  }
  addToDom() {
    const wrapper = document.querySelector('.dots-layout');
    wrapper.append(this.elem);
  }
}

const targets = Array.from(new Array(targetCounts), () => new Target());
targets.forEach((t) => t.addToDom());

function drawCircle(x, y, r, color, isFill) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.closePath();
  isFill && ctx.fill();
  ctx.stroke();
  ctx.restore();
}
const ray = new Ray();

function animate() {
  if (pause) return;
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  recursionDraw(20, 15);
  targets.forEach((t) => {
    t.update();
    t.draw();
  });
  ray.update();
  ray.draw();
}

animate();

document.addEventListener('keydown', ({ code }) => {
  if (code !== 'Space') return;
  pause = !pause;
  console.log(ray.angle);
  if (!pause) animate();
});
