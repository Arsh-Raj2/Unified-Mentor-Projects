class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.expression = '';
        this.shouldResetScreen = false;
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.expression = '';
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.expression === '') {
            this.expression = this.currentOperand;
        } else if (this.shouldResetScreen) {
            this.expression = this.currentOperand;
        } else {
            this.expression += this.currentOperand;
        }

        
        switch(operation) {
            case '×':
                this.expression += '*';
                break;
            case '÷':
                this.expression += '/';
                break;
            default:
                this.expression += operation;
        }
        
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.operation = operation;
        this.shouldResetScreen = false;
    }

    compute() {
        try {
            if (!this.expression) {
                return;
            }
            
           
            this.expression += this.currentOperand;
            
            
            if (this.expression.includes('/0')) {
                throw new Error("Cannot divide by zero");
            }

         
            let result = eval(this.expression);

           
            if (!Number.isInteger(result)) {
                result = parseFloat(result.toFixed(8));
              
                result = parseFloat(result);
            }

            this.currentOperand = result.toString();
            this.shouldResetScreen = true;
            this.operation = undefined;
            this.previousOperand = '';
            this.expression = '';

        } catch (error) {
            this.currentOperand = 'Error';
            setTimeout(() => this.clear(), 1500);
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentOperand = document.querySelector('.current-operand');
        currentOperand.classList.add('animate');
        setTimeout(() => currentOperand.classList.remove('animate'), 150);
        
        currentOperand.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            document.querySelector('.previous-operand').textContent =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            document.querySelector('.previous-operand').textContent = '';
        }
    }
}


let animationFrameId;


class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 30;
        this.init();
    }

    init() {
        this.setCanvasSize();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => this.setCanvasSize());
    }

    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1, // Reduced size
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fill();
        });

        animationFrameId = requestAnimationFrame(() => this.animate());
    }
}


document.addEventListener('mousemove', (e) => {
    const signature = document.querySelector('.signature');
    if (!signature) return;

    const mouseX = (e.clientX - window.innerWidth / 2) / 25;
    const mouseY = (e.clientY - window.innerHeight / 2) / 25;

    signature.style.transform = `
        perspective(1000px)
        rotateY(${mouseX}deg)
        rotateX(${-mouseY}deg)
        translateZ(20px)
    `;
});


document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
    } else {
        new ParticleBackground();
    }
});


const calculator = new Calculator();


document.querySelector('.calculator').addEventListener('click', (e) => {
    const button = e.target;
    if (!button.matches('button')) return;

    if (button.classList.contains('number')) {
        calculator.appendNumber(button.innerText);
    } else if (button.classList.contains('operator')) {
        calculator.chooseOperation(button.innerText);
    } else if (button.classList.contains('equals')) {
        calculator.compute();
    } else if (button.classList.contains('clear')) {
        calculator.clear();
    } else if (button.classList.contains('delete')) {
        calculator.delete();
    }
    calculator.updateDisplay();
});

// Unified Mentor Is Good