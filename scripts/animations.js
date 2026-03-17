// Matrix Terminal 2048 - Animation Manager

class AnimationManager {
    constructor() {
        this.isAnimating = false;
        this.animationQueue = [];
        this.settings = {
            enabled: true,
            speed: 200, // ms for tile movements
            effects: true
        };
    }

    // Set animation settings
    setSettings(settings) {
        this.settings = { ...this.settings, ...settings };
    }

    // Animate tile movement
    animateTileMovement(from, to, value, callback) {
        if (!this.settings.enabled) {
            callback();
            return;
        }

        this.isAnimating = true;
        
        const fromTile = document.querySelector(`[data-position="${from.row}-${from.col}"]`);
        const toTile = document.querySelector(`[data-position="${to.row}-${to.col}"]`);
        
        if (!fromTile || !toTile) {
            this.isAnimating = false;
            callback();
            return;
        }

        // Create moving tile element with enhanced effects
        const movingTile = document.createElement('div');
        movingTile.className = 'tile tile-moving';
        movingTile.setAttribute('data-value', value);
        movingTile.textContent = value;
        movingTile.style.position = 'absolute';
        movingTile.style.zIndex = '100';
        
        // Set initial position
        const fromRect = fromTile.getBoundingClientRect();
        const toRect = toTile.getBoundingClientRect();
        const boardRect = document.getElementById('game-board').getBoundingClientRect();
        
        movingTile.style.left = (fromRect.left - boardRect.left) + 'px';
        movingTile.style.top = (fromRect.top - boardRect.top) + 'px';
        movingTile.style.width = fromRect.width + 'px';
        movingTile.style.height = fromRect.height + 'px';
        
        // Add Matrix trail effect
        const trail = document.createElement('div');
        trail.className = 'matrix-trail';
        trail.style.position = 'absolute';
        trail.style.width = '100%';
        trail.style.height = '2px';
        trail.style.background = 'linear-gradient(90deg, transparent, #00ff41, transparent)';
        trail.style.top = '50%';
        trail.style.transform = 'translateY(-50%)';
        trail.style.opacity = '0';
        movingTile.appendChild(trail);
        
        document.getElementById('game-board').appendChild(movingTile);
        
        // Create ghost effect at source
        const ghostTile = document.createElement('div');
        ghostTile.className = 'tile ghost-effect';
        ghostTile.setAttribute('data-value', value);
        ghostTile.textContent = value;
        ghostTile.style.position = 'absolute';
        ghostTile.style.left = (fromRect.left - boardRect.left) + 'px';
        ghostTile.style.top = (fromRect.top - boardRect.top) + 'px';
        ghostTile.style.width = fromRect.width + 'px';
        ghostTile.style.height = fromRect.height + 'px';
        ghostTile.style.opacity = '0.3';
        ghostTile.style.zIndex = '50';
        document.getElementById('game-board').appendChild(ghostTile);
        
        // Animate ghost fade out
        setTimeout(() => {
            ghostTile.style.transition = 'opacity 0.3s ease-out';
            ghostTile.style.opacity = '0';
        }, 10);
        
        // Enhanced movement animation
        setTimeout(() => {
            // Activate trail
            trail.style.opacity = '1';
            trail.style.animation = 'trail-flow 0.3s ease-out';
            
            movingTile.style.transition = `all ${this.settings.speed}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            movingTile.style.left = (toRect.left - boardRect.left) + 'px';
            movingTile.style.top = (toRect.top - boardRect.top) + 'px';
            
            // Add glow effect during movement
            movingTile.style.filter = 'brightness(1.3) drop-shadow(0 0 10px #00ff41)';
        }, 10);
        
        // Remove effects and update target
        setTimeout(() => {
            toTile.setAttribute('data-value', value);
            toTile.textContent = value;
            
            // Add arrival effect
            toTile.style.transform = 'scale(1.1)';
            toTile.style.filter = 'brightness(1.5)';
            
            setTimeout(() => {
                toTile.style.transition = 'all 0.2s ease-out';
                toTile.style.transform = 'scale(1)';
                toTile.style.filter = 'brightness(1)';
            }, 50);
            
            fromTile.removeAttribute('data-value');
            fromTile.textContent = '';
            movingTile.remove();
            ghostTile.remove();
            
            this.isAnimating = false;
            callback();
        }, this.settings.speed + 50);
    }

    // Animate tile merge
    animateTileMerge(from1, from2, to, value, callback) {
        if (!this.settings.enabled) {
            callback();
            return;
        }

        this.isAnimating = true;
        
        const from1Tile = document.querySelector(`[data-position="${from1.row}-${from1.col}"]`);
        const from2Tile = document.querySelector(`[data-position="${from2.row}-${from2.col}"]`);
        const toTile = document.querySelector(`[data-position="${to.row}-${to.col}"]`);
        
        if (!from1Tile || !from2Tile || !toTile) {
            this.isAnimating = false;
            callback();
            return;
        }

        // Create enhanced merging tiles
        const movingTile1 = this.createMovingTile(from1Tile, value);
        const movingTile2 = this.createMovingTile(from2Tile, value);
        
        // Add particle effects
        this.createMergeParticles(from1Tile);
        this.createMergeParticles(from2Tile);
        
        const boardRect = document.getElementById('game-board').getBoundingClientRect();
        const toRect = toTile.getBoundingClientRect();
        
        // Enhanced merge animation
        setTimeout(() => {
            const duration = this.settings.speed;
            
            movingTile1.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            movingTile2.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            
            movingTile1.style.left = (toRect.left - boardRect.left) + 'px';
            movingTile1.style.top = (toRect.top - boardRect.top) + 'px';
            movingTile2.style.left = (toRect.left - boardRect.left) + 'px';
            movingTile2.style.top = (toRect.top - boardRect.top) + 'px';
            
            // Add spiral effect
            movingTile1.style.transform = 'rotate(180deg) scale(0.8)';
            movingTile2.style.transform = 'rotate(-180deg) scale(0.8)';
            
            // Intense glow during merge
            movingTile1.style.filter = 'brightness(2) drop-shadow(0 0 20px #00ff41)';
            movingTile2.style.filter = 'brightness(2) drop-shadow(0 0 20px #00ff41)';
        }, 10);
        
        // Enhanced merge effect and cleanup
        setTimeout(() => {
            // Clear source tiles
            from1Tile.removeAttribute('data-value');
            from1Tile.textContent = '';
            from2Tile.removeAttribute('data-value');
            from2Tile.textContent = '';
            
            // Update target tile with spectacular merge effect
            toTile.setAttribute('data-value', value);
            toTile.textContent = value;
            toTile.classList.add('tile-merging', 'glitch-effect');
            
            // Create explosion effect
            this.createMergeExplosion(toTile);
            
            // Remove moving tiles
            movingTile1.remove();
            movingTile2.remove();
            
            // Remove merge effect classes
            setTimeout(() => {
                toTile.classList.remove('tile-merging', 'glitch-effect');
                this.isAnimating = false;
                callback();
            }, 600);
        }, this.settings.speed + 50);
    }

    // Create merge particles effect
    createMergeParticles(tile) {
        const rect = tile.getBoundingClientRect();
        const boardRect = document.getElementById('game-board').getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'merge-particle';
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#00ff41';
            particle.style.borderRadius = '50%';
            particle.style.left = (rect.left - boardRect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top - boardRect.top + rect.height / 2) + 'px';
            particle.style.zIndex = '200';
            particle.style.boxShadow = '0 0 6px #00ff41';
            
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 50 + Math.random() * 30;
            const duration = 400 + Math.random() * 200;
            
            document.getElementById('game-board').appendChild(particle);
            
            setTimeout(() => {
                particle.style.transition = `all ${duration}ms ease-out`;
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => particle.remove(), duration);
        }
    }

    // Create merge explosion effect
    createMergeExplosion(tile) {
        const explosion = document.createElement('div');
        explosion.className = 'merge-explosion';
        explosion.style.position = 'absolute';
        explosion.style.width = '100%';
        explosion.style.height = '100%';
        explosion.style.border = '2px solid #00ff41';
        explosion.style.borderRadius = '4px';
        explosion.style.pointerEvents = 'none';
        explosion.style.zIndex = '150';
        
        const rect = tile.getBoundingClientRect();
        const boardRect = document.getElementById('game-board').getBoundingClientRect();
        
        explosion.style.left = (rect.left - boardRect.left) + 'px';
        explosion.style.top = (rect.top - boardRect.top) + 'px';
        explosion.style.width = rect.width + 'px';
        explosion.style.height = rect.height + 'px';
        
        document.getElementById('game-board').appendChild(explosion);
        
        setTimeout(() => {
            explosion.style.transition = 'all 0.4s ease-out';
            explosion.style.transform = 'scale(2)';
            explosion.style.opacity = '0';
            explosion.style.borderColor = '#ffffff';
        }, 10);
        
        setTimeout(() => explosion.remove(), 400);
    }

    // Create moving tile element
    createMovingTile(sourceTile, value) {
        const movingTile = document.createElement('div');
        movingTile.className = 'tile tile-moving';
        movingTile.setAttribute('data-value', value);
        movingTile.textContent = value;
        movingTile.style.position = 'absolute';
        movingTile.style.zIndex = '100';
        
        const sourceRect = sourceTile.getBoundingClientRect();
        const boardRect = document.getElementById('game-board').getBoundingClientRect();
        
        movingTile.style.left = (sourceRect.left - boardRect.left) + 'px';
        movingTile.style.top = (sourceRect.top - boardRect.top) + 'px';
        movingTile.style.width = sourceRect.width + 'px';
        movingTile.style.height = sourceRect.height + 'px';
        
        document.getElementById('game-board').appendChild(movingTile);
        return movingTile;
    }

    // Animate new tile appearance
    animateNewTile(position, value, callback) {
        if (!this.settings.enabled) {
            callback();
            return;
        }

        const tile = document.querySelector(`[data-position="${position.row}-${position.col}"]`);
        if (!tile) {
            callback();
            return;
        }

        tile.setAttribute('data-value', value);
        tile.textContent = value;
        tile.classList.add('tile-new');
        
        // Enhanced Matrix rain effect
        if (this.settings.effects) {
            this.createEnhancedMatrixRain(tile);
            this.createSpawnParticles(tile);
        }
        
        // Add spawn glow effect
        tile.style.transform = 'scale(0)';
        tile.style.filter = 'brightness(2)';
        
        setTimeout(() => {
            tile.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            tile.style.transform = 'scale(1)';
            tile.style.filter = 'brightness(1)';
        }, 10);
        
        setTimeout(() => {
            tile.classList.remove('tile-new');
            callback();
        }, 400);
    }

    // Enhanced Matrix rain effect
    createEnhancedMatrixRain(tile) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const rain = document.createElement('div');
                rain.className = 'matrix-rain enhanced';
                rain.textContent = Math.random() < 0.5 ? '1' : '0';
                rain.style.left = Math.random() * 80 - 40 + '%';
                rain.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
                rain.style.fontSize = (8 + Math.random() * 4) + 'px';
                tile.appendChild(rain);
                
                setTimeout(() => rain.remove(), 1000);
            }, i * 100);
        }
    }

    // Create spawn particles
    createSpawnParticles(tile) {
        const rect = tile.getBoundingClientRect();
        const boardRect = document.getElementById('game-board').getBoundingClientRect();
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'spawn-particle';
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = '#00ff41';
            particle.style.borderRadius = '50%';
            particle.style.left = (rect.left - boardRect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top - boardRect.top + rect.height / 2) + 'px';
            particle.style.zIndex = '200';
            particle.style.boxShadow = '0 0 4px #00ff41';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 20;
            
            document.getElementById('game-board').appendChild(particle);
            
            setTimeout(() => {
                particle.style.transition = 'all 0.6s ease-out';
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => particle.remove(), 600);
        }
    }

    // Animate score update
    animateScoreUpdate(oldScore, newScore, callback) {
        if (!this.settings.enabled || oldScore === newScore) {
            callback();
            return;
        }

        const scoreElement = document.getElementById('score-display');
        scoreElement.classList.add('score-updating');
        
        // Animate score counting
        const duration = 500;
        const steps = 20;
        const increment = (newScore - oldScore) / steps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
            currentStep++;
            const currentScore = Math.round(oldScore + (increment * currentStep));
            scoreElement.textContent = `SCORE: ${currentScore}`;
            
            if (currentStep >= steps) {
                clearInterval(interval);
                scoreElement.textContent = `SCORE: ${newScore}`;
                scoreElement.classList.remove('score-updating');
                callback();
            }
        }, duration / steps);
    }

    // Animate game over
    animateGameOver(callback) {
        if (!this.settings.enabled) {
            callback();
            return;
        }

        const board = document.getElementById('game-board');
        board.classList.add('game-over-animation');
        
        setTimeout(() => {
            board.classList.remove('game-over-animation');
            callback();
        }, 1000);
    }

    // Animate victory
    animateVictory(callback) {
        if (!this.settings.enabled) {
            callback();
            return;
        }

        const board = document.getElementById('game-board');
        board.classList.add('victory-animation');
        
        setTimeout(() => {
            board.classList.remove('victory-animation');
            callback();
        }, 2000);
    }

    // Animate button press
    animateButtonPress(button, callback) {
        if (!this.settings.enabled) {
            callback();
            return;
        }

        button.classList.add('btn-press');
        
        setTimeout(() => {
            button.classList.remove('btn-press');
            callback();
        }, 200);
    }

    // Animate status update
    animateStatusUpdate(statusText, callback) {
        if (!this.settings.enabled) {
            callback();
            return;
        }

        const statusElement = document.getElementById('status');
        statusElement.classList.add('status-updating');
        statusElement.textContent = statusText;
        
        setTimeout(() => {
            statusElement.classList.remove('status-updating');
            callback();
        }, 300);
    }

    // Animate undo effect
    animateUndo(callback) {
        if (!this.settings.enabled) {
            callback();
            return;
        }

        const board = document.getElementById('game-board');
        board.classList.add('undo-effect');
        
        setTimeout(() => {
            board.classList.remove('undo-effect');
            callback();
        }, 500);
    }

    // Add hover effect to control buttons
    addControlButtonEffects() {
        const controlButtons = document.querySelectorAll('.control-btn');
        
        controlButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (this.settings.enabled) {
                    button.classList.add('control-btn-hover');
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('control-btn-hover');
            });
        });
    }

    // Check if currently animating
    isCurrentlyAnimating() {
        return this.isAnimating;
    }

    // Queue animation
    queueAnimation(animation) {
        this.animationQueue.push(animation);
        this.processQueue();
    }

    // Process animation queue
    processQueue() {
        if (this.animationQueue.length === 0 || this.isAnimating) {
            return;
        }
        
        const animation = this.animationQueue.shift();
        animation();
    }
}
