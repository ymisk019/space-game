const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

let score = 0;
let gameOver = false;

// لاعب (المركبة)
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 50,
  width: 40,
  height: 30,
  speed: 6,
  dx: 0
};

const bullets = [];
const meteorites = [];

// التحكم بالأزرار
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.dx = -player.speed;
  if (e.key === 'ArrowRight') player.dx = player.speed;
  if (e.key === ' ' || e.key === 'ArrowUp') fireBullet();
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

function fireBullet() {
  if (gameOver) return;
  bullets.push({
    x: player.x + player.width / 2 - 3,
    y: player.y,
    width: 6,
    height: 15,
    speed: 8
  });
}

function spawnMeteorite() {
  if (gameOver) return;
  const size = Math.random() * 25 + 20;
  meteorites.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    size: size,
    speed: Math.random() * 2 + 2
  });
}

setInterval(spawnMeteorite, 1000);

function update() {
  if (gameOver) return;

  // تحريك اللاعب
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // تحريك الليزر
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) bullets.splice(index, 1);
  });

  // تحريك النيازك واختبار التصادم
  meteorites.forEach((meteor, mIndex) => {
    meteor.y += meteor.speed;

    // الخسارة عند وصول النيزك للأرض
    if (meteor.y + meteor.size > canvas.height) {
      gameOver = true;
      alert('💥 خسرت! مجموع نقاطك: ' + score);
      location.reload();
    }

    // تصادم الليزر مع النيزك
    bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < meteor.x + meteor.size &&
        bullet.x + bullet.width > meteor.x &&
        bullet.y < meteor.y + meteor.size &&
        bullet.y + bullet.height > meteor.y
      ) {
        meteorites.splice(mIndex, 1);
        bullets.splice(bIndex, 1);
        score += 10;
        scoreEl.innerText = score;
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // رسم المركبة
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.fill();

  // رسم الليزر
  ctx.fillStyle = '#ef4444';
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // رسم النيازك
  ctx.fillStyle = '#a855f7';
  meteorites.forEach((meteor) => {
    ctx.beginPath();
    ctx.arc(meteor.x + meteor.size / 2, meteor.y + meteor.size / 2, meteor.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
