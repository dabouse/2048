// Matrix Terminal 2048 - Game Logic

class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.moves = 0;
        this.won = false;
        this.over = false;
        this.previousState = null;
        
        this.init();
    }

    // Initialize new game
    init() {
        this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.moves = 0;
        this.won = false;
        this.over = false;
        
        // Add two initial tiles
        this.addRandomTile();
        this.addRandomTile();
    }

    // Add random tile (90% chance of 2, 10% chance of 4)
    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
            return randomCell;
        }
        return null;
    }

    // Save current state for undo
    saveState() {
        this.previousState = {
            board: this.board.map(row => [...row]),
            score: this.score,
            moves: this.moves,
            won: this.won,
            over: this.over
        };
    }

    // Move tiles in specified direction
    move(direction) {
        if (this.over || this.won) return false;
        
        this.saveState();
        let moved = false;
        const newBoard = this.board.map(row => [...row]);
        
        switch (direction) {
            case 'left':
                moved = this.moveLeft(newBoard);
                break;
            case 'right':
                moved = this.moveRight(newBoard);
                break;
            case 'up':
                moved = this.moveUp(newBoard);
                break;
            case 'down':
                moved = this.moveDown(newBoard);
                break;
        }
        
        if (moved) {
            this.board = newBoard;
            this.moves++;
            
            // Add new tile after move
            const newTile = this.addRandomTile();
            
            // Check win condition
            if (!this.won && this.checkWin()) {
                this.won = true;
            }
            
            // Check game over
            if (this.checkGameOver()) {
                this.over = true;
            }
            
            return { moved, newTile };
        }
        
        return { moved: false };
    }

    // Move left
    moveLeft(board) {
        let moved = false;
        
        for (let row = 0; row < this.size; row++) {
            const newRow = this.slideAndMerge(board[row]);
            if (!this.arraysEqual(board[row], newRow)) {
                board[row] = newRow;
                moved = true;
            }
        }
        
        return moved;
    }

    // Move right
    moveRight(board) {
        let moved = false;
        
        for (let row = 0; row < this.size; row++) {
            const reversed = board[row].slice().reverse();
            const newRow = this.slideAndMerge(reversed).reverse();
            if (!this.arraysEqual(board[row], newRow)) {
                board[row] = newRow;
                moved = true;
            }
        }
        
        return moved;
    }

    // Move up
    moveUp(board) {
        let moved = false;
        
        for (let col = 0; col < this.size; col++) {
            const column = [];
            for (let row = 0; row < this.size; row++) {
                column.push(board[row][col]);
            }
            
            const newColumn = this.slideAndMerge(column);
            
            for (let row = 0; row < this.size; row++) {
                if (board[row][col] !== newColumn[row]) {
                    board[row][col] = newColumn[row];
                    moved = true;
                }
            }
        }
        
        return moved;
    }

    // Move down
    moveDown(board) {
        let moved = false;
        
        for (let col = 0; col < this.size; col++) {
            const column = [];
            for (let row = 0; row < this.size; row++) {
                column.push(board[row][col]);
            }
            
            const reversed = column.reverse();
            const newColumn = this.slideAndMerge(reversed).reverse();
            
            for (let row = 0; row < this.size; row++) {
                if (board[row][col] !== newColumn[row]) {
                    board[row][col] = newColumn[row];
                    moved = true;
                }
            }
        }
        
        return moved;
    }

    // Slide and merge array (for row/column)
    slideAndMerge(arr) {
        // Remove zeros
        let newArr = arr.filter(val => val !== 0);
        
        // Merge equal adjacent tiles
        for (let i = 0; i < newArr.length - 1; i++) {
            if (newArr[i] === newArr[i + 1]) {
                newArr[i] *= 2;
                this.score += newArr[i];
                newArr.splice(i + 1, 1);
            }
        }
        
        // Fill with zeros
        while (newArr.length < this.size) {
            newArr.push(0);
        }
        
        return newArr;
    }

    // Check if player won (reached 2048)
    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if game is over
    checkGameOver() {
        // Check for empty cells
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // Check for possible merges
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.board[i][j];
                
                // Check right neighbor
                if (j < this.size - 1 && current === this.board[i][j + 1]) {
                    return false;
                }
                
                // Check bottom neighbor
                if (i < this.size - 1 && current === this.board[i + 1][j]) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Undo last move
    undo() {
        if (this.previousState) {
            this.board = this.previousState.board.map(row => [...row]);
            this.score = this.previousState.score;
            this.moves = this.previousState.moves;
            this.won = this.previousState.won;
            this.over = this.previousState.over;
            this.previousState = null;
            return true;
        }
        return false;
    }

    // Get available moves
    getAvailableMoves() {
        const moves = [];
        const directions = ['up', 'down', 'left', 'right'];
        
        for (const direction of directions) {
            const testGame = new Game2048();
            testGame.board = this.board.map(row => [...row]);
            testGame.score = this.score;
            testGame.moves = this.moves;
            
            const result = testGame.move(direction);
            if (result.moved) {
                moves.push(direction);
            }
        }
        
        return moves;
    }

    // Get board state as flat array
    getBoardState() {
        return this.board.flat();
    }

    // Set board state from flat array
    setBoardState(state) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = state[i * this.size + j];
            }
        }
    }

    // Utility: Check if two arrays are equal
    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }

    // Get game statistics
    getStats() {
        return {
            score: this.score,
            moves: this.moves,
            won: this.won,
            over: this.over,
            emptyCells: this.board.flat().filter(cell => cell === 0).length,
            maxTile: Math.max(...this.board.flat()),
            availableMoves: this.getAvailableMoves().length
        };
    }

    // Clone game state
    clone() {
        const cloned = new Game2048();
        cloned.board = this.board.map(row => [...row]);
        cloned.score = this.score;
        cloned.moves = this.moves;
        cloned.won = this.won;
        cloned.over = this.over;
        return cloned;
    }
}
