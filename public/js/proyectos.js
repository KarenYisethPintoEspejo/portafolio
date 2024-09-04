
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];

const mouse = {
    x: null,
    y: null,
    radius: 100 
};


window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }


    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }
        
        this.x += this.directionX;
        this.y += this.directionY;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.closePath();
        }

        this.draw();
    }
}

function init() {
    particlesArray.length = 0;
    const numberOfParticles = (canvas.width * canvas.height) / 13000; 
    for (let i = 0; i < numberOfParticles; i++) {
        const size = (Math.random() * 3) + 0.5; 
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() * 0.5) - 0.25; 
        const directionY = (Math.random() * 0.5) - 0.25; 

        const color = '#fff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => {
        particle.update();
    });
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

init();
animate();

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const cardWidth = cards[0].getBoundingClientRect().width;

    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    track.style.width = `${cardWidth * cards.length}px`;

    track.addEventListener('mouseover', () => {
        track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseout', () => {
        track.style.animationPlayState = 'running';
    });
});

