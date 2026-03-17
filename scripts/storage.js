// Matrix Terminal 2048 - Storage Management

class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            BEST_SCORE: 'matrix_2048_best_score',
            CURRENT_GAME: 'matrix_2048_current_game',
            GAME_HISTORY: 'matrix_2048_game_history',
            SETTINGS: 'matrix_2048_settings'
        };
    }

    // Save best score
    saveBestScore(score) {
        try {
            const currentBest = this.getBestScore();
            if (score > currentBest) {
                localStorage.setItem(this.STORAGE_KEYS.BEST_SCORE, score.toString());
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error saving best score:', error);
            return false;
        }
    }

    // Get best score
    getBestScore() {
        try {
            const score = localStorage.getItem(this.STORAGE_KEYS.BEST_SCORE);
            return score ? parseInt(score, 10) : 0;
        } catch (error) {
            console.error('Error getting best score:', error);
            return 0;
        }
    }

    // Save current game state
    saveCurrentGame(gameState) {
        try {
            const stateToSave = {
                board: gameState.board,
                score: gameState.score,
                moves: gameState.moves,
                timestamp: Date.now()
            };
            localStorage.setItem(this.STORAGE_KEYS.CURRENT_GAME, JSON.stringify(stateToSave));
            return true;
        } catch (error) {
            console.error('Error saving current game:', error);
            return false;
        }
    }

    // Load current game state
    loadCurrentGame() {
        try {
            const savedGame = localStorage.getItem(this.STORAGE_KEYS.CURRENT_GAME);
            if (savedGame) {
                const gameState = JSON.parse(savedGame);
                // Check if game is not too old (24 hours)
                const hoursSinceLastPlay = (Date.now() - gameState.timestamp) / (1000 * 60 * 60);
                if (hoursSinceLastPlay < 24) {
                    return gameState;
                }
            }
            return null;
        } catch (error) {
            console.error('Error loading current game:', error);
            return null;
        }
    }

    // Clear current game
    clearCurrentGame() {
        try {
            localStorage.removeItem(this.STORAGE_KEYS.CURRENT_GAME);
            return true;
        } catch (error) {
            console.error('Error clearing current game:', error);
            return false;
        }
    }

    // Save move to history (for undo functionality)
    saveToHistory(gameState) {
        try {
            let history = this.getHistory();
            history.push({
                board: gameState.board,
                score: gameState.score,
                moves: gameState.moves,
                timestamp: Date.now()
            });
            
            // Keep only last 10 moves
            if (history.length > 10) {
                history = history.slice(-10);
            }
            
            localStorage.setItem(this.STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Error saving to history:', error);
            return false;
        }
    }

    // Get move history
    getHistory() {
        try {
            const history = localStorage.getItem(this.STORAGE_KEYS.GAME_HISTORY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error getting history:', error);
            return [];
        }
    }

    // Get last move from history (for undo)
    getLastMove() {
        try {
            const history = this.getHistory();
            return history.length > 0 ? history[history.length - 1] : null;
        } catch (error) {
            console.error('Error getting last move:', error);
            return null;
        }
    }

    // Remove last move from history
    removeLastMove() {
        try {
            let history = this.getHistory();
            if (history.length > 0) {
                history.pop();
                localStorage.setItem(this.STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing last move:', error);
            return false;
        }
    }

    // Clear history
    clearHistory() {
        try {
            localStorage.removeItem(this.STORAGE_KEYS.GAME_HISTORY);
            return true;
        } catch (error) {
            console.error('Error clearing history:', error);
            return false;
        }
    }

    // Save settings
    saveSettings(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    // Load settings
    loadSettings() {
        try {
            const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            return settings ? JSON.parse(settings) : {
                soundEnabled: true,
                animationsEnabled: true,
                gridLines: true
            };
        } catch (error) {
            console.error('Error loading settings:', error);
            return {
                soundEnabled: true,
                animationsEnabled: true,
                gridLines: true
            };
        }
    }

    // Clear all storage data
    clearAll() {
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            const info = {};
            Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
                const value = localStorage.getItem(key);
                info[name] = {
                    size: value ? value.length : 0,
                    exists: !!value
                };
            });
            return info;
        } catch (error) {
            console.error('Error getting storage info:', error);
            return {};
        }
    }
}

// Global storage instance
const storage = new StorageManager();
