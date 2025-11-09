export default class Hourglass {
    constructor(duration, onEnd) {
        this.duration = duration; // in seconds
        this.onEnd = onEnd;
        this.container = document.getElementById('hourglass-container');
        this.hourglassEl = document.getElementById('hourglass');
        this.sandTop = document.querySelector('.sand-top');
        this.sandBottom = document.querySelector('.sand-bottom');
        this.sparklesContainer = document.getElementById('sparkles-container');

        this.isPaused = false;
        this.isFlipped = false;
        this.animationRequestId = null;
        this.startTime = null;
        this.elapsedTime = 0;
        
        this.createSparkles();
    }

    start() {
        this.startTime = performance.now();
        this.isPaused = false;
        this.animate();
    }

    animate() {
        this.animationRequestId = requestAnimationFrame((now) => {
            if (this.isPaused) {
                this.startTime = now - this.elapsedTime;
                this.animate();
                return;
            }

            this.elapsedTime = now - this.startTime;
            const progress = Math.min(this.elapsedTime / (this.duration * 1000), 1);
            
            // Animate sand
            this.sandTop.style.height = `${(1 - progress) * 100}%`;
            this.sandBottom.style.height = `${progress * 100}%`;

            if (progress >= 1) {
                this.flip();
            } else {
                this.animate();
            }
        });
    }

    flip() {
        this.hourglassEl.classList.add('flipping');
        this.isFlipped = true;
        
        // After flip animation, reset for the next countdown
        setTimeout(() => {
            this.hourglassEl.classList.remove('flipping');
            this.reset();
            this.onEnd();
        }, 500); // Match CSS transition duration
    }
    
    reset() {
        cancelAnimationFrame(this.animationRequestId);
        this.animationRequestId = null;
        this.elapsedTime = 0;
        this.startTime = performance.now();
        
        // Reset sand levels
        this.sandTop.style.transition = 'none';
        this.sandBottom.style.transition = 'none';
        this.sandTop.style.height = '100%';
        this.sandBottom.style.height = '0%';
        
        // Re-enable transition for next run
        setTimeout(() => {
            this.sandTop.style.transition = '';
            this.sandBottom.style.transition = '';
        }, 50);

        this.animate();
    }

    pause() {
        this.isPaused = true;
        this.sparklesContainer.style.animationPlayState = 'paused';
    }

    resume() {
        this.isPaused = false;
        this.sparklesContainer.style.animationPlayState = 'running';
    }

    createSparkles() {
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            // Distribute start times to create a continuous stream
            sparkle.style.animationDelay = `${Math.random() * 1}s`;
            this.sparklesContainer.appendChild(sparkle);
        }
    }
}