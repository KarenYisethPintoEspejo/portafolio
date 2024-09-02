document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('mouseover', () => {
        icon.style.transform = 'scale(1.2)';
        icon.style.transition = 'transform 0.2s ease-in-out';
    });

    icon.addEventListener('mouseout', () => {
        icon.style.transform = 'scale(1)';
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

document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('userInput');
    const outputContainer = document.getElementById('outputContainer');
    const prompt = document.querySelector('.prompt');
    const folders = {};

    function typeWriter(text, i, callback) {
        if (i < text.length) {
            outputContainer.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, i, callback), 50);
        } else if (callback) {
            callback();
        }
    }

    function showWelcomeMessage() {
        const welcomeText = "Bienvenido al mundo de la codificación. Escribe 'help' para ver los comandos disponibles.\n";
        typeWriter(welcomeText, 0, () => {
            outputContainer.innerHTML += '\n'; 
            prompt.style.display = 'inline'; 
            userInput.style.display = 'inline'; 
            userInput.focus(); 
        });
    }

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const command = userInput.value.trim();
            executeCommand(command);
            userInput.value = '';
        }
    });

    function executeCommand(command) {
        const output = document.createElement('div');
        const [cmd, ...args] = command.split(' ');

        const commandOutput = document.createElement('div');
        commandOutput.textContent = `karen@pinto-developer:~$ ${command}`;
        outputContainer.appendChild(commandOutput);

        switch(cmd) {
            case 'help':
                output.textContent = 'about, projects, contact, cls, date, version, mkdir0, ls, rmdir';
                break;
            case 'about':
                output.textContent = 'Soy una desarrolladora con experiencia en backend...';
                break;
            case 'projects':
                output.textContent = 'Mis proyectos incluyen...';
                break;
            case 'contact':
                output.textContent = 'Puedes contactarme en...';
                break;
            case 'cls':
                outputContainer.innerHTML = '';
                return; 
            case 'date':
                output.textContent = `Fecha y hora actual: ${new Date().toLocaleString()}`;
                break;
            case 'version':
                output.textContent = 'Versión del sistema: 1.0.0';
                break;
            case 'mkdir':
                if (args.length === 0) {
                    output.textContent = 'Uso: create <nombre_carpeta>';
                } else {
                    const folderName = args.join(' ');
                    if (folders[folderName]) {
                        output.textContent = `La carpeta "${folderName}" ya existe.`;
                    } else {
                        folders[folderName] = true;
                        output.textContent = `Carpeta "${folderName}" creada.`;
                    }
                }
                break;
            case 'ls':
                if (Object.keys(folders).length === 0) {
                    output.textContent = 'No hay carpetas.';
                } else {
                    output.textContent =  Object.keys(folders).join('\n');
                }
                break;
            case 'rmdir':
                if (args.length === 0) {
                    output.textContent = 'Uso: delete <nombre_carpeta>';
                } else {
                    const folderName = args.join(' ');
                    if (folders[folderName]) {
                        delete folders[folderName];
                        output.textContent = `Carpeta "${folderName}" borrada.`;
                    } else {
                        output.textContent = `La carpeta "${folderName}" no existe.`;
                    }
                }
                break;
            default:
                output.textContent = `Comando no reconocido: ${command}`;
        }
        outputContainer.appendChild(output);
        outputContainer.scrollTop = outputContainer.scrollHeight;
    }

    userInput.style.display = 'none';
    prompt.style.display = 'none';

    showWelcomeMessage();
});
