# TicTacToeApp

A cross-platform Tic Tac Toe game built with React Native and Expo. Play on iOS, Android, or web!

## Features

- Play Tic Tac Toe on iPhone, Android, and Web
- Real-time game state management
- Win detection with multiple winning combinations
- Draw detection
- Reset game button for quick replays

## Project Structure

```
TicTacToeApp/
├── App.js              # Main game component
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration
├── package.json        # Dependencies and scripts
├── index.js            # Entry point
├── assets/             # App icons and splash screen (to be added)
└── .github/            # GitHub configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (installed globally)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Start Expo Server
```bash
npm start
```

#### Run on iOS
```bash
npm run ios
```
(Requires macOS and Xcode)

#### Run on Android
```bash
npm run android
```
(Requires Android Studio or Android SDK)

#### Run on Web
```bash
npm run web
```

## Game Instructions

1. Two players take turns marking spaces as X or O
2. First player to get 3 in a row (horizontal, vertical, or diagonal) wins
3. If all spaces are filled with no winner, it's a draw
4. Click "New Game" to play again

## Technologies Used

- **Expo**: Easy cross-platform development
- **React Native**: Native components for iOS and Android
- **React**: UI component library
- **React Native Web**: Web support

## Development

The main game logic is in [App.js](App.js) which includes:
- Board state management
- Win condition checking
- Player turn tracking
- Game reset functionality

## Future Enhancements

- Single player mode with AI opponent
- Game history and statistics
- Multiplayer mode with online play
- Animations and sound effects
- Theme customization

## License

MIT
