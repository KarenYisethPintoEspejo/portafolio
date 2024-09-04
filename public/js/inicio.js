document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('mouseover', () => {
        icon.style.transform = 'scale(1.2)';
        icon.style.transition = 'transform 0.2s ease-in-out';
        icon.style.color = 'rgb(179, 60, 248)';
    });

    icon.addEventListener('mouseout', () => {
        icon.style.transform = 'scale(1)';
        icon.style.color = 'white';

    });
});

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


document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('loaded');
    document.querySelector('.container').classList.add('loaded');
    document.querySelector('nav').classList.add('loaded');
    document.querySelector('#name-heading').classList.add('loaded');
    document.querySelector('p').classList.add('loaded');
    document.querySelector('.social-icons').classList.add('loaded');
    document.querySelector('footer').classList.add('loaded');
    document.querySelector('#consola').classList.add('loaded');
});
