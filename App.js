import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LinearGradient } from 'react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

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

  const winner = calculateWinner(board);
  const isBoardFull = board.every((square) => square !== null);

  const handlePress = (index) => {
    if (board[index] !== null || winner) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isBoardFull) {
    status = "It's a Draw!";
  } else {
    status = `Current Player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <ExpoLinearGradient colors={['#667eea', '#764ba2', '#f093fb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <View style={styles.content}>
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
          <ExpoLinearGradient colors={['#ff6b6b', '#ff8787']} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>New Game</Text>
          </ExpoLinearGradient>
        </TouchableOpacity>

        <StatusBar style="light" />
      </View>
    </ExpoLinearGradient>
  );
}
alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
    fontWeight: '600',
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
    fontWeight: '7
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
