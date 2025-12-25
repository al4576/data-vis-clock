let img1;
let img2;
let mountains = [];
let lastLoggedMinute = -1;

const CANVAS_SIZE = 600;
const CENTER_X = 300;
const CENTER_Y = 300;
const MAIN_RADIUS = 250;
const IMG_ORIGINAL_WIDTH = 1134;
const IMG_ORIGINAL_HEIGHT = 850;
const IMG_SCALE = 0.03;

function preload() {
  img1 = loadImage("images/alien.png");
  img2 = loadImage("images/invert.png");
}

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  angleMode(DEGREES);
  generateMountains();
}

function generateMountains() {
  let maxMountains = 12;
  let span = MAIN_RADIUS * 2;
  let spacing = span / (maxMountains + 1);

  mountains = [];

  for (let i = 0; i < maxMountains; i++) {
    randomSeed(i * 999);

    mountains.push({
      x: -MAIN_RADIUS + spacing * (i + 1),
      width: random(90, 150),
      height: random(60, 110)
    });
  }
}

function draw() {
  let hr = hour();
  let min = minute();
  let sec = second();
  let currentMinute = minute();
  if (second() === 0 && currentMinute !== lastLoggedMinute) {
    console.log("Minute:", currentMinute);
    lastLoggedMinute = currentMinute;
  }


  background(128);
  noStroke();

  drawClock();

  let isDay = (hr >= 6 && hr < 18);

  drawOrbitingImage(sec, isDay);

  drawStars(min, isDay);

  drawMountains(hr, isDay);

  drawCelestialBody(hr, min, isDay);
}

function drawClock() {
  push();
  translate(CENTER_X, CENTER_Y);
  
  fill(0);
  arc(0, 0, MAIN_RADIUS * 2, MAIN_RADIUS * 2, 0, 180);
  
  fill(255);
  arc(0, 0, MAIN_RADIUS * 2, MAIN_RADIUS * 2, 180, 360);
  
  pop();
}

function drawOrbitingImage(sec, isDay) {
  let orbitAngle = map(sec, 0, 60, 0, 360);

  push();
  translate(CENTER_X, CENTER_Y);
  rotate(orbitAngle);
  translate(0, -MAIN_RADIUS - 15);
  imageMode(CENTER);
  if (sec <= 15 || sec > 45) {
    img = img1;
  }
  else {
    img = img2
  }
  image(img, 0, 0, IMG_ORIGINAL_WIDTH * IMG_SCALE, IMG_ORIGINAL_HEIGHT * IMG_SCALE);
  pop();
}

function drawStars(min, isDay) {
  const radii = [50, 100, 150, 200];
  const starsPerArc = 15;
  let totalStars = min;

  push();
  translate(CENTER_X, CENTER_Y);
  noStroke();

  let startAngle, endAngle;
  if (isDay) {
    fill(255); 
    startAngle = 0;
    endAngle = 180;
  } else {
    fill(0); 
    startAngle = 180;
    endAngle = 360;
  }

  for (let arcIndex = 0; arcIndex < radii.length; arcIndex++) {
    let r = radii[arcIndex];
    let starsOnThisArc = constrain(totalStars - arcIndex * starsPerArc, 0, starsPerArc);

    for (let i = 0; i < starsOnThisArc; i++) {
      let starAngle = map(i, 0, starsPerArc - 1, startAngle + 7, endAngle - 7);
      let starX = cos(starAngle) * r;
      let starY = sin(starAngle) * r;
      circle(starX, starY, 3);
    }
  }
  pop();
}

function drawMountains(hr, isDay) {
  let numMountains = hr % 12;
  if (numMountains === 0) numMountains = 12;

  push();
  translate(CENTER_X, CENTER_Y);
  noStroke();
  fill(192);

  

  beginClip();
  if (isDay) {
    arc(0, 0, MAIN_RADIUS * 2, MAIN_RADIUS * 2, 180, 360);
  }
  else {
    arc(0, 0, MAIN_RADIUS * 2, MAIN_RADIUS * 2, 0, 180);
  }
  endClip();

  for (let i = 0; i < numMountains; i++) {
    let index = isDay ? i : (mountains.length - 1 - i);
    let m = mountains[index];

    let baseY = 0;
    let peakY = isDay ? -m.height : m.height;

    triangle(
      m.x, peakY,
      m.x - m.width / 2, baseY,
      m.x + m.width / 2, baseY
    );
  }

  pop();
}

function drawCelestialBody(hr, min, isDay) {
  let t = (hr * 60 + min) % 1440;
  let celestialAngle = map(t, 0, 1440, 90, 90 + 360);
  celestialAngle -= 270; // 6am = -180

  push();
  translate(CENTER_X, CENTER_Y);
  rotate(celestialAngle);
  translate(0, -MAIN_RADIUS + 40);
  noStroke();

  if (isDay) {
    fill(255, 200, 50); // Sun
  } else {
    fill(50, 50, 255); // Moon
  }
  circle(0, 0, 45);
  pop();
}
