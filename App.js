import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authScreen, setAuthScreen] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState({});

  // Game states
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerXName, setPlayerXName] = useState('');
  const [playerOName, setPlayerOName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState(null); // null, 'twoPlayer', or 'vsBot'
  const [gameScreen, setGameScreen] = useState('mode'); // 'mode', 'names', or 'playing'

  // Load users from storage on app start
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.log('Error loading users:', error);
    }
  };

  const saveUsers = async (usersData) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(usersData));
      setUsers(usersData);
    } catch (error) {
      console.log('Error saving users:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = () => {
    setErrorMessage('');
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    if (!password.trim()) {
      setErrorMessage('Please enter a password');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (users[email]) {
      setErrorMessage('Email already registered');
      return;
    }
    
    // Create new user
    const newUsers = {
      ...users,
      [email]: { email, password }
    };
    
    saveUsers(newUsers);
    setCurrentUser({ email });
    setIsLoggedIn(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handleLogin = () => {
    setErrorMessage('');
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      return;
    }
    
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    if (!users[email]) {
      setErrorMessage('Email not found');
      return;
    }
    
    if (users[email].password !== password) {
      setErrorMessage('Incorrect password');
      return;
    }
    
    setCurrentUser({ email });
    setIsLoggedIn(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthScreen('login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setPlayerXName('');
    setPlayerOName('');
    setGameStarted(false);
    setGameMode(null);
    setGameScreen('mode');
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // Minimax algorithm for bot AI
  const minimax = (board, depth, isMaximizing) => {
    const winner = calculateWinner(board);
    
    if (winner === 'O') return 10 - depth; // Bot wins
    if (winner === 'X') return depth - 10; // Human wins
    if (board.every((square) => square !== null)) return 0; // Draw
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Get best move for bot
  const getBotMove = (board) => {
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  };

  // Handle game mode selection
  const selectGameMode = (mode) => {
    setGameMode(mode);
    setGameScreen('names');
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  // Handle press with bot logic
  const handlePress = (index) => {
    const winner = calculateWinner(board);
    if (board[index] !== null || winner) return;

    const newBoard = board.slice();
    newBoard[index] = 'X'; // Human is X

    // Check if human won or board is full
    if (calculateWinner(newBoard) === 'X' || newBoard.every((square) => square !== null)) {
      setBoard(newBoard);
      setIsXNext(true);
      return;
    }

    // Bot's turn (if playing vs bot)
    if (gameMode === 'vsBot') {
      setBoard(newBoard);
      setTimeout(() => {
        const boardCopy = newBoard.slice();
        const botMove = getBotMove(boardCopy);
        if (botMove !== null) {
          boardCopy[botMove] = 'O'; // Bot is O
          setBoard(boardCopy);
        }
        setIsXNext(true);
      }, 500); // Delay for better UX
    } else {
      setBoard(newBoard);
      setIsXNext(!isXNext); // Two player mode
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const changeSettings = () => {
    setGameScreen('names');
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const changeMode = () => {
    setGameScreen('mode');
    setGameStarted(false);
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const startGame = () => {
    if (gameMode === 'vsBot') {
      if (playerXName.trim()) {
        setGameStarted(true);
        setGameScreen('playing');
        setBoard(Array(9).fill(null));
        setIsXNext(true);
      }
    } else if (gameMode === 'twoPlayer') {
      if (playerXName.trim() && playerOName.trim()) {
        setGameStarted(true);
        setGameScreen('playing');
        setBoard(Array(9).fill(null));
        setIsXNext(true);
      }
    }
  };

  const winner = calculateWinner(board);
  const isBoardFull = board.every((square) => square !== null);

  let status;
  if (winner) {
    const winnerName = winner === 'X' ? playerXName : playerOName;
    status = `Winner: ${winnerName}! 🎉`;
  } else if (isBoardFull) {
    status = "It's a Draw!";
  } else {
    if (gameMode === 'vsBot') {
      const currentPlayerName = isXNext ? playerXName : 'Bot';
      status = `${currentPlayerName}'s Turn`;
    } else {
      const currentPlayerName = isXNext ? playerXName : playerOName;
      status = `${currentPlayerName}'s Turn`;
    }
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <View style={styles.content}>
        {!isLoggedIn ? (
          // Authentication Screen
          <ScrollView style={styles.authContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Tic Tac Toe</Text>
            <Text style={styles.authSubtitle}>
              {authScreen === 'login' ? 'Login to Play' : 'Create Account'}
            </Text>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {authScreen === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={authScreen === 'login' ? handleLogin : handleSignup}
            >
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>
                  {authScreen === 'login' ? 'Login' : 'Sign Up'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setAuthScreen(authScreen === 'login' ? 'signup' : 'login');
              setErrorMessage('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}>
              <Text style={styles.toggleAuthText}>
                {authScreen === 'login'
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        ) : !isLoggedIn ? null : gameScreen === 'mode' && !gameStarted ? (
          // Game Mode Selection Screen
          <View style={styles.modeSelectionContainer}>
            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{currentUser?.email}</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logoutButton}>Logout</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Tic Tac Toe</Text>
            <Text style={styles.subtitle}>Select Game Mode</Text>

            <TouchableOpacity
              style={[styles.modeButton, styles.modeButtonTwo]}
              onPress={() => selectGameMode('twoPlayer')}
            >
              <LinearGradient colors={['#42a5f5', '#1e88e5']} style={styles.modeButtonGradient}>
                <Text style={styles.modeButtonText}>👥 Two Players</Text>
                <Text style={styles.modeButtonSubtext}>Play with a friend</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeButton, styles.modeButtonBot]}
              onPress={() => selectGameMode('vsBot')}
            >
              <LinearGradient colors={['#ec407a', '#c2185b']} style={styles.modeButtonGradient}>
                <Text style={styles.modeButtonText}>🤖 vs Bot</Text>
                <Text style={styles.modeButtonSubtext}>Challenge the AI</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : gameScreen === 'names' ? (
          // Player Names Input Screen
          <View style={styles.nameInputContainer}>
            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{currentUser?.email}</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logoutButton}>Logout</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Tic Tac Toe</Text>
            <Text style={styles.subtitle}>Enter Player Names</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={playerXName}
                onChangeText={setPlayerXName}
              />
            </View>

            {gameMode === 'twoPlayer' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Opponent Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter opponent name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={playerOName}
                  onChangeText={setPlayerOName}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={startGame}
              disabled={gameMode === 'twoPlayer' ? (!playerXName.trim() || !playerOName.trim()) : !playerXName.trim()}
            >
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Start Game</Text>
              </LinearGradient>
            </TouchableOpacity>

            {!gameStarted && (
              <TouchableOpacity
                style={[styles.button, { marginTop: 10 }]}
                onPress={() => {
                  setGameScreen('mode');
                  setGameMode(null);
                }}
              >
                <LinearGradient colors={['#90a4ae', '#78909c']} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Back</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : gameScreen === 'playing' ? (
          // Game Playing Screen
          <View style={styles.gamePlayingContainer}>
            <View style={styles.gameHeaderWithSettings}>
              <View style={styles.leftHeader}>
                <Text style={styles.userEmailGame}>{currentUser?.email}</Text>
                <Text style={styles.modeLabel}>
                  {gameMode === 'vsBot' ? '🤖 vs Bot' : '👥 Two Players'}
                </Text>
              </View>
              <View style={styles.rightHeader}>
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={changeSettings}
                >
                  <Text style={styles.settingsButtonText}>⚙ Names</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={changeMode}
                >
                  <Text style={styles.settingsButtonText}>⚙ Mode</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.logoutButtonGame}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.title}>Tic Tac Toe</Text>
            <Text style={styles.status}>{status}</Text>
            
            <View style={styles.board}>
              {board.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.square, value === 'X' ? styles.squareX : value === 'O' ? styles.squareO : styles.squareEmpty]}
                  onPress={() => handlePress(index)}
                >
                  <Text style={[styles.squareText, value && styles.squareTextFilled]}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={resetGame}>
              <LinearGradient colors={['#ff6b6b', '#ff8787']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>New Game</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}

        <StatusBar style="light" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
  },
  nameInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modeSelectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  gamePlayingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  authSubtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  userEmail: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoutButton: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  gameHeaderWithSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  leftHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  userEmailGame: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButtonGame: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 6,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  square: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  squareX: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  squareO: {
    backgroundColor: 'rgba(100, 200, 255, 0.2)',
  },
  squareText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  squareTextFilled: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleAuthText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 15,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  modeButtonGradient: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  modeButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modeButtonTwo: {
    marginTop: 30,
  },
  modeButtonBot: {
    marginBottom: 10,
  },
});
