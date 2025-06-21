class SmartGuessor {
            constructor() {
                this.secretNumber = this.generateSecretNumber();
                this.attempts = 0;
                this.gameHistory = [];
                this.stats = {
                    totalGames: 0,
                    gamesWon: 0,
                    bestScore: null
                };
                this.loadStats();
                this.initializeEventListeners();
                this.updateStatsDisplay();
            }

            generateSecretNumber() {
                return Math.floor(Math.random() * 100) + 1;
            }

            initializeEventListeners() {
                const submitBtn = document.getElementById('submitBtn');
                const resetBtn = document.getElementById('resetBtn');
                const guessInput = document.getElementById('guessInput');

                submitBtn.addEventListener('click', () => this.submitGuess());
                resetBtn.addEventListener('click', () => this.resetGame());
                
                guessInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.submitGuess();
                    }
                });

                guessInput.addEventListener('input', () => {
                    const value = parseInt(guessInput.value);
                    if (value < 1 || value > 100) {
                        guessInput.style.borderColor = '#ff6b6b';
                    } else {
                        guessInput.style.borderColor = '#e0e0e0';
                    }
                });
            }

            submitGuess() {
                const guessInput = document.getElementById('guessInput');
                const guess = parseInt(guessInput.value);

                if (isNaN(guess) || guess < 1 || guess > 100) {
                    this.showFeedback('Please enter a valid number between 1 and 100!', 'neutral');
                    return;
                }

                this.attempts++;
                this.updateAttemptsDisplay();

                const result = this.checkGuess(guess);
                this.addToHistory(guess, result);
                this.showFeedback(result.message, result.type);

                if (result.type === 'correct') {
                    this.endGame(true);
                }

                guessInput.value = '';
                guessInput.focus();
            }

            checkGuess(guess) {
                if (guess === this.secretNumber) {
                    return {
                        message: `🎉 Congratulations! You guessed it in ${this.attempts} attempts!`,
                        type: 'correct'
                    };
                } else if (guess > this.secretNumber) {
                    const diff = guess - this.secretNumber;
                    if (diff > 20) {
                        return {
                            message: '📉 Too high! Try going much lower.',
                            type: 'too-high'
                        };
                    } else if (diff > 10) {
                        return {
                            message: '📉 Too high! Try going lower.',
                            type: 'too-high'
                        };d
                    } else {
                        return {
                            message: "📉 Too high! You're getting close!",
                            type: 'too-high'
                        };
                    }
                } else {
                    const diff = this.secretNumber - guess;
                    if (diff > 20) {
                        return {
                            message: "📈 Too low! Try going much higher.",
                            type: 'too-low'
                        };
                    } else if (diff > 10) {
                        return {
                            message: "📈 Too low! Try going higher.",
                            type: 'too-low'
                        };
                    } else {
                        return {
                            message: "📈 Too low! You're getting close!",
                            type: 'too-low'
                        };
                    }
                }
            }

            showFeedback(message, type) {
                const feedback = document.getElementById('feedback');
                feedback.textContent = message;
                feedback.className = `feedback ${type}`;
            }

            addToHistory(guess, result) {
                this.gameHistory.push({
                    guess: guess,
                    result: result.type,
                    attempt: this.attempts
                });
                this.updateHistoryDisplay();
            }

            updateHistoryDisplay() {
                const historyList = document.getElementById('historyList');
                if (this.gameHistory.length === 0) {
                    historyList.innerHTML = '<div class="history-item">No guesses yet...</div>';
                    return;
                }

                const historyHTML = this.gameHistory.map(item => {
                    let icon = '';
                    if (item.result === 'correct') icon = '🎯';
                    else if (item.result === 'too-high') icon = '⬇️';
                    else if (item.result === 'too-low') icon = '⬆️';
                    
                    return `<div class="history-item">${icon} Attempt ${item.attempt}: ${item.guess}</div>`;
                }).join('');

                historyList.innerHTML = historyHTML;
                historyList.scrollTop = historyList.scrollHeight;
            }

            updateAttemptsDisplay() {
                document.getElementById('attempts').textContent = this.attempts;
            }

            endGame(won) {
                if (won) {
                    this.stats.gamesWon++;
                    if (this.stats.bestScore === null || this.attempts < this.stats.bestScore) {
                        this.stats.bestScore = this.attempts;
                    }
                }
                this.stats.totalGames++;
                this.saveStats();
                this.updateStatsDisplay();
            }

            resetGame() {
                this.secretNumber = this.generateSecretNumber();
                this.attempts = 0;
                this.gameHistory = [];
                
                this.updateAttemptsDisplay();
                this.updateHistoryDisplay();
                this.showFeedback('New game started! Make your first guess.', 'neutral');
                
                document.getElementById('guessInput').value = '';
                document.getElementById('guessInput').focus();
            }

            updateStatsDisplay() {
                document.getElementById('totalGames').textContent = this.stats.totalGames;
                document.getElementById('bestScore').textContent = this.stats.bestScore || '-';
                
                const winRate = this.stats.totalGames > 0 
                    ? Math.round((this.stats.gamesWon / this.stats.totalGames) * 100)
                    : 0;
                document.getElementById('winRate').textContent = `${winRate}%`;
            }

            saveStats() {
                // In a real implementation, this would save to localStorage
                // For the artifact, we'll just keep stats in memory
            }

            loadStats() {
                // In a real implementation, this would load from localStorage
                // For the artifact, we'll start with default stats
            }
        }

        // Initialize the game when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new SmartGuessor();
        });