import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GoldParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const particles = [];
        const particleCount = 60;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.2 - 0.1;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.opacity = Math.random() * 0.5;
                this.pulse = Math.random() * 0.01 + 0.005;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.pulse;

                if (this.opacity > 0.6 || this.opacity < 0.1) {
                    this.pulse = -this.pulse;
                }

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Add a subtle glow to some particles
                if (this.size > 1.5) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#d4af37';
                } else {
                    ctx.shadowBlur = 0;
                }
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default GoldParticles;
