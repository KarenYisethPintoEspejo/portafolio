
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
    const boxes = document.querySelectorAll('.mission-box, .vision-box');

    boxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            createParticle(e, box);
            updateIlluminatedBorder(e, box);
        });

        box.addEventListener('mouseleave', () => {
            box.style.setProperty('--light-position-x', '50%');
            box.style.setProperty('--light-position-y', '50%');
            box.style.setProperty('--light-intensity', '0');
        });
    });

    function createParticle(e, parent) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.floor(Math.random() * 10 + 5);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const rect = parent.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 40;
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance;

        particle.style.setProperty('--translate-x', `${translateX}px`);
        particle.style.setProperty('--translate-y', `${translateY}px`);

        parent.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    function updateIlluminatedBorder(e, box) {
        const rect = box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const normalizedX = x / rect.width;
        const normalizedY = y / rect.height;

        const distanceToEdge = Math.min(
            normalizedX,
            normalizedY,
            1 - normalizedX,
            1 - normalizedY
        );
        const intensity = 1 - Math.min(distanceToEdge * 5, 1);

        box.style.setProperty('--light-position-x', `${normalizedX * 100}%`);
        box.style.setProperty('--light-position-y', `${normalizedY * 100}%`);
        box.style.setProperty('--light-intensity', intensity.toFixed(2));
    }
});
