// Matrix Terminal 2048 - UI Manager

class UIManager {
    constructor() {
        this.game = new Game2048();
        this.animationManager = new AnimationManager();
        this.storage = storage;
        
        // Debug mode
        this.debugMode = true;
        
        this.elements = {};
        this.initElements();
        this.initEventListeners();
        this.loadGame();
        this.render();
        
        // Add matrix effects
        this.initMatrixEffects();
        
        // Initial debug info
        this.logDebug('Game initialized', {
            board: this.game.board,
            score: this.game.score,
            moves: this.game.moves
        });
    }

    // Initialize DOM elements
    initElements() {
        this.elements = {
            gameBoard: document.getElementById('game-board'),
            scoreDisplay: document.getElementById('score-display'),
            bestScore: document.getElementById('best-score'),
            moves: document.getElementById('moves'),
            status: document.getElementById('status'),
            newGameBtn: document.getElementById('new-game'),
            undoBtn: document.getElementById('undo'),
            debugBtn: document.getElementById('debug'),
            quitBtn: document.getElementById('quit'),
            gameOver: document.getElementById('game-over'),
            victory: document.getElementById('victory'),
            finalScore: document.getElementById('final-score-value'),
            victoryScore: document.getElementById('victory-score-value'),
            restartBtn: document.getElementById('restart'),
            continueBtn: document.getElementById('continue'),
            restartVictoryBtn: document.getElementById('restart-victory'),
            controlBtns: document.querySelectorAll('.control-btn')
        };
    }

    // Initialize event listeners
    initEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Button controls
        this.elements.controlBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.getAttribute('data-direction');
                this.handleMove(direction);
            });
        });
        
        // Game controls
        this.elements.newGameBtn.addEventListener('click', () => this.newGame());
        this.elements.undoBtn.addEventListener('click', () => this.undo());
        this.elements.debugBtn.addEventListener('click', () => this.openDebugConsole());
        this.elements.quitBtn.addEventListener('click', () => this.quit());
        
        // Game over/victory controls
        this.elements.restartBtn.addEventListener('click', () => this.newGame());
        this.elements.continueBtn.addEventListener('click', () => this.continueGame());
        this.elements.restartVictoryBtn.addEventListener('click', () => this.newGame());
        
        // Window controls
        window.addEventListener('beforeunload', () => this.saveGame());
        
        // Add control button effects
        this.animationManager.addControlButtonEffects();
    }

    // Initialize matrix effects
    initMatrixEffects() {
        // Add scanlines
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines';
        document.body.appendChild(scanlines);
        
        // Add cyber grid
        const grid = document.createElement('div');
        grid.className = 'cyber-grid';
        document.body.appendChild(grid);
        
        // Add matrix background
        this.createMatrixBackground();
        
        // Add terminal boot effect
        document.querySelector('.terminal-container').classList.add('terminal-boot');
    }

    // Create matrix background effect
    createMatrixBackground() {
        const matrixBg = document.createElement('div');
        matrixBg.className = 'matrix-bg';
        
        // Create matrix columns
        for (let i = 0; i < 20; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = Math.random() * 100 + '%';
            column.style.animationDuration = (Math.random() * 10 + 5) + 's';
            column.style.animationDelay = Math.random() * 5 + 's';
            
            // Generate random characters
            let text = '';
            for (let j = 0; j < 30; j++) {
                text += Math.random() < 0.5 ? '1' : '0';
            }
            column.textContent = text;
            
            matrixBg.appendChild(column);
        }
        
        document.body.appendChild(matrixBg);
    }

    // Handle keyboard input
    handleKeyPress(e) {
        if (this.animationManager.isCurrentlyAnimating()) {
            return;
        }
        
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right',
            'W': 'up',
            'S': 'down',
            'A': 'left',
            'D': 'right'
        };
        
        const direction = keyMap[e.key];
        if (direction) {
            e.preventDefault();
            this.handleMove(direction);
        }
    }

    // Handle move
    handleMove(direction) {
        if (this.animationManager.isCurrentlyAnimating()) {
            this.logDebug('Move blocked - animation in progress');
            return;
        }
        
        this.logDebug(`Move attempt: ${direction}`, {
            currentBoard: this.game.board,
            currentScore: this.game.score,
            currentMoves: this.game.moves
        });
        
        const oldScore = this.game.score;
        const oldBoard = this.game.board.map(row => [...row]); // Save board state before move
        const result = this.game.move(direction);
        
        this.logDebug(`Move result: ${direction}`, {
            moved: result.moved,
            newTile: result.newTile,
            scoreChange: this.game.score - oldScore,
            newBoard: this.game.board,
            newScore: this.game.score,
            moves: this.game.moves
        });
        
        if (result.moved) {
            // Validate game logic
            this.validateGameLogic(oldBoard, this.game.board, direction);
            
            // Save state to storage
            this.storage.saveToHistory({
                board: this.game.board,
                score: this.game.score,
                moves: this.game.moves
            });
            
            // Animate the actual tile movements
            this.animateTileMovements(oldBoard, this.game.board, direction, result.newTile, () => {
                // Update score
                this.animationManager.animateScoreUpdate(oldScore, this.game.score, () => {
                    this.updateDisplay();
                    
                    // Check game state
                    this.logDebug('Game state check', {
                        won: this.game.won,
                        over: this.game.over,
                        availableMoves: this.game.getAvailableMoves()
                    });
                    
                    if (this.game.won && !this.game.over) {
                        this.handleVictory();
                    } else if (this.game.over) {
                        this.handleGameOver();
                    }
                });
            });
        } else {
            this.logDebug(`Move ${direction} - no tiles moved`);
        }
    }

    // Animate actual tile movements
    animateTileMovements(oldBoard, newBoard, direction, newTile, callback) {
        // On utilise la nouvelle fonction qui calcule tout avec précision
        const animations = this.calculateAnimations(oldBoard, direction);
        const movements = animations.movements;
        const merges = animations.merges;
        
        this.logDebug(`Animation planning for ${direction}`, {
            movements: movements,
            merges: merges,
            newTile: newTile,
            totalAnimations: movements.length + merges.length + (newTile ? 1 : 0)
        });
        
        let animationCount = 0;
        const totalAnimations = movements.length + merges.length + (newTile ? 1 : 0);
        
        const checkComplete = () => {
            animationCount++;
            this.logDebug(`Animation completed: ${animationCount}/${totalAnimations}`);
            if (animationCount >= totalAnimations) {
                callback();
            }
        };
        
        // Animate movements first
        movements.forEach((move, index) => {
            this.logDebug(`Starting movement animation ${index + 1}`, move);
            this.animationManager.animateTileMovement(move.from, move.to, move.value, checkComplete);
        });
        
        // Then animate merges
        merges.forEach((merge, index) => {
            this.logDebug(`Starting merge animation ${index + 1}`, merge);
            this.animationManager.animateTileMerge(merge.from1, merge.from2, merge.to, merge.value, checkComplete);
        });
        
        // Finally animate new tile
        if (newTile) {
            this.logDebug('Starting new tile animation', newTile);
            this.animationManager.animateNewTile(newTile, this.game.board[newTile.row][newTile.col], checkComplete);
        }
        
        // If no animations, callback immediately
        if (totalAnimations === 0) {
            this.logDebug('No animations to process');
            callback();
        }
    }

    // Calcule de façon déterministe les animations de mouvement et de fusion
    calculateAnimations(oldBoard, direction) {
        const movements = [];
        const merges = [];
        
        // Helper pour traiter une seule ligne/colonne de manière séquentielle
        const processLine = (line, getCoords) => {
            // Étape 1: Ne garder que les tuiles non vides en mémorisant leur index d'origine
            let nonZeros = line.filter(item => item.value !== 0);
            
            // Étape 2: Fusionner les tuiles adjacentes avec les mêmes règles que game.js
            // Une tuile fusionnée ne peut pas fusionner à nouveau
            let merged = new Array(nonZeros.length).fill(false);
            
            for (let i = 0; i < nonZeros.length - 1; i++) {
                if (!merged[i] && !merged[i + 1] && nonZeros[i].value === nonZeros[i + 1].value) {
                    // C'est une fusion
                    const targetCoords = getCoords(i); // La destination est l'index actuel après glissement
                    merges.push({
                        from1: getCoords(nonZeros[i].originalIndex),
                        from2: getCoords(nonZeros[i + 1].originalIndex),
                        to: targetCoords,
                        value: nonZeros[i].value * 2
                    });
                    merged[i] = true;
                    nonZeros.splice(i + 1, 1); // Supprimer la tuile absorbée
                    merged.splice(i + 1, 1);
                    i--; // Reculer car on a supprimé un élément
                }
            }
            
            // Étape 3: Calculer les mouvements simples (tuiles qui ne fusionnent pas)
            let destIndex = 0;
            for (let i = 0; i < nonZeros.length; i++) {
                const targetCoords = getCoords(destIndex);
                const sourceCoords = getCoords(nonZeros[i].originalIndex);
                
                // Si la tuile a changé de position, c'est un mouvement
                if (targetCoords.row !== sourceCoords.row || targetCoords.col !== sourceCoords.col) {
                    movements.push({
                        from: sourceCoords,
                        to: targetCoords,
                        value: nonZeros[i].value
                    });
                }
                destIndex++;
            }
        };

        for (let i = 0; i < 4; i++) {
            let line = [];
            if (direction === 'left') {
                for (let j = 0; j < 4; j++) line.push({value: oldBoard[i][j], originalIndex: j});
                processLine(line, (index) => ({row: i, col: index}));
            } else if (direction === 'right') {
                for (let j = 3; j >= 0; j--) line.push({value: oldBoard[i][j], originalIndex: j});
                processLine(line, (index) => ({row: i, col: 3 - index}));
            } else if (direction === 'up') {
                for (let j = 0; j < 4; j++) line.push({value: oldBoard[j][i], originalIndex: j});
                processLine(line, (index) => ({row: index, col: i}));
            } else if (direction === 'down') {
                for (let j = 3; j >= 0; j--) line.push({value: oldBoard[j][i], originalIndex: j});
                processLine(line, (index) => ({row: 3 - index, col: i}));
            }
        }
        
        return { movements, merges };
    }

    // Render game board
    render() {
        this.createBoard();
        this.updateDisplay();
    }

    // Create game board
    createBoard() {
        this.elements.gameBoard.innerHTML = '';
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.setAttribute('data-position', `${row}-${col}`);
                
                const value = this.game.board[row][col];
                if (value > 0) {
                    tile.setAttribute('data-value', value);
                    tile.textContent = value;
                }
                
                this.elements.gameBoard.appendChild(tile);
            }
        }
    }

    // Update display
    updateDisplay() {
        // Update score
        this.elements.scoreDisplay.textContent = `SCORE: ${this.game.score}`;
        
        // Update best score
        const bestScore = this.storage.getBestScore();
        this.elements.bestScore.textContent = `BEST: ${bestScore}`;
        
        // Update moves
        this.elements.moves.textContent = `MOVES: ${this.game.moves}`;
        
        // Update status
        if (this.game.over) {
            this.elements.status.textContent = 'SYSTEM_FAILURE';
        } else if (this.game.won) {
            this.elements.status.textContent = 'MATRIX_ACHIEVED';
        } else {
            this.elements.status.textContent = 'SYSTEM_READY';
        }
        
        // Update board tiles
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const tile = document.querySelector(`[data-position="${row}-${col}"]`);
                const value = this.game.board[row][col];
                
                if (value > 0) {
                    tile.setAttribute('data-value', value);
                    tile.textContent = value;
                } else {
                    tile.removeAttribute('data-value');
                    tile.textContent = '';
                }
            }
        }
    }

    // Handle game over
    handleGameOver() {
        this.animationManager.animateGameOver(() => {
            this.elements.finalScore.textContent = this.game.score;
            this.elements.gameOver.classList.remove('hidden');
            
            // Update best score
            this.storage.saveBestScore(this.game.score);
        });
    }

    // Handle victory
    handleVictory() {
        this.animationManager.animateVictory(() => {
            this.elements.victoryScore.textContent = this.game.score;
            this.elements.victory.classList.remove('hidden');
            
            // Update best score
            this.storage.saveBestScore(this.game.score);
        });
    }

    // New game
    newGame() {
        this.animationManager.animateButtonPress(this.elements.newGameBtn, () => {
            this.game.init();
            this.storage.clearHistory();
            this.storage.clearCurrentGame();
            this.render();
            
            // Hide game over/victory screens
            this.elements.gameOver.classList.add('hidden');
            this.elements.victory.classList.add('hidden');
            
            this.animationManager.animateStatusUpdate('SYSTEM_READY');
        });
    }

    // Undo move
    undo() {
        if (this.animationManager.isCurrentlyAnimating()) {
            return;
        }
        
        const lastMove = this.storage.getLastMove();
        if (lastMove) {
            this.animationManager.animateButtonPress(this.elements.undoBtn, () => {
                this.animationManager.animateUndo(() => {
                    this.game.board = lastMove.board.map(row => [...row]);
                    this.game.score = lastMove.score;
                    this.game.moves = lastMove.moves;
                    this.game.won = false;
                    this.game.over = false;
                    
                    this.storage.removeLastMove();
                    this.updateDisplay();
                    
                    this.animationManager.animateStatusUpdate('MOVE_UNDONE');
                });
            });
        }
    }

    // Continue game after victory
    continueGame() {
        this.animationManager.animateButtonPress(this.elements.continueBtn, () => {
            this.elements.victory.classList.add('hidden');
            this.game.won = false;
            this.animationManager.animateStatusUpdate('CONTINUING_MATRIX');
        });
    }

    // Quit game
    quit() {
        this.animationManager.animateButtonPress(this.elements.quitBtn, () => {
            this.saveGame();
            if (typeof require !== 'undefined') {
                const { app } = require('electron');
                app.quit();
            }
        });
    }

    // Open debug console
    openDebugConsole() {
        this.logDebug('Opening DevTools...');
        
        // Use Electron's IPC to open DevTools
        try {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('open-devtools');
            this.logDebug('DevTools requested via IPC');
        } catch (e) {
            this.logDebug('IPC method failed:', e.message);
        }
        
        // Log current state regardless
        this.logDebug('=== CURRENT GAME STATE ===', {
            board: this.game.board,
            score: this.game.score,
            moves: this.game.moves,
            won: this.game.won,
            over: this.game.over,
            availableMoves: this.game.getAvailableMoves()
        });
        
        // Show debug info in an alert as fallback
        const boardStr = this.game.board.map(row => 
            row.map(cell => cell === 0 ? '.' : cell).join(' ')
        ).join('\n');
        
        alert(`Debug Info:\nScore: ${this.game.score}\nMoves: ${this.game.moves}\nBoard:\n${boardStr}`);
    }

    // Save game
    saveGame() {
        this.storage.saveCurrentGame({
            board: this.game.board,
            score: this.game.score,
            moves: this.game.moves
        });
    }

    // Load game
    loadGame() {
        const savedGame = this.storage.loadCurrentGame();
        if (savedGame) {
            this.game.board = savedGame.board;
            this.game.score = savedGame.score;
            this.game.moves = savedGame.moves;
            this.logDebug('Game loaded from storage', savedGame);
        } else {
            this.logDebug('No saved game found, starting fresh');
        }
    }

    // Debug logging
    logDebug(message, data = null) {
        if (!this.debugMode) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [2048-DEBUG]`;
        
        console.log(`${prefix} ${message}`);
        if (data) {
            if (typeof data === 'object' && data.board) {
                // Pretty print board
                console.log('Board state:');
                data.board.forEach((row, rowIndex) => {
                    const rowStr = row.map(cell => cell === 0 ? '.' : cell).join('\t');
                    console.log(`Row ${rowIndex}: ${rowStr}`);
                });
                console.log('Other data:', { ...data, board: '[Board printed above]' });
            } else {
                console.log('Data:', data);
            }
        }
    }

    // Validate game logic
    validateGameLogic(oldBoard, newBoard, direction) {
        const errors = [];
        
        // Use the new calculateAnimations function for validation
        const animations = this.calculateAnimations(oldBoard, direction);
        const movements = animations.movements;
        const merges = animations.merges;
        
        // Count tiles
        const oldTiles = this.countTiles(oldBoard);
        const newTiles = this.countTiles(newBoard);
        
        // Simple validation: new tile count should be old tiles - merges + 1
        const expectedTileChange = -merges.length + 1;
        const actualTileChange = newTiles - oldTiles;
        
        if (actualTileChange !== expectedTileChange) {
            errors.push(`Tile count change: expected ${expectedTileChange}, got ${actualTileChange}`);
        }
        
        // Score validation: score should increase by sum of merged values
        const expectedScoreIncrease = merges.reduce((sum, merge) => sum + merge.value, 0);
        const actualScoreIncrease = this.game.score - (this.previousScore || 0);
        
        // Allow small discrepancies due to game logic timing
        if (Math.abs(actualScoreIncrease - expectedScoreIncrease) > 0) {
            // This might be OK depending on when score was calculated
            this.logDebug('Score change noted', {
                expected: expectedScoreIncrease,
                actual: actualScoreIncrease,
                merges: merges.length
            });
        }
        
        // Check board validity
        if (!this.isValidBoard(newBoard)) {
            errors.push('Invalid board state');
        }
        
        if (errors.length > 0) {
            console.warn('⚠️ Validation warnings:', errors);
            this.logDebug('Validation issues (may be timing-related)', {
                oldBoard,
                newBoard,
                direction,
                movements,
                merges,
                errors
            });
        } else {
            this.logDebug('✅ Game logic validation passed', {
                movementsCount: movements.length,
                mergesCount: merges.length,
                tilesBefore: oldTiles,
                tilesAfter: newTiles
            });
        }
        
        // Store previous score for next validation
        this.previousScore = this.game.score;
    }

    // Count tiles on board
    countTiles(board) {
        return board.flat().filter(cell => cell > 0).length;
    }

    // Get score from board (sum of all tiles)
    getScoreFromBoard(board) {
        return board.flat().reduce((sum, cell) => sum + cell, 0);
    }

    // Check if board is valid
    isValidBoard(board) {
        // Check dimensions
        if (!board || board.length !== 4 || board.some(row => !row || row.length !== 4)) {
            return false;
        }
        
        // Check if all values are powers of 2 or 0
        for (let row of board) {
            for (let cell of row) {
                if (cell !== 0 && !this.isPowerOfTwo(cell)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Check if number is power of two
    isPowerOfTwo(num) {
        return num > 0 && (num & (num - 1)) === 0;
    }

    // Enable/disable debug mode
    setDebugMode(enabled) {
        this.debugMode = enabled;
        this.logDebug(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIManager();
});
