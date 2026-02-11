# Running TicTacToeApp with Docker

This guide explains how to run the Tic Tac Toe app using Docker and Docker Compose.

## Prerequisites

- Docker installed ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)

## Quick Start with Docker Compose

### 1. Build and Start the Container

```bash
docker-compose up -d
```

This command will:
- Build the Docker image
- Start the container in background mode
- Mount your project files for live updates

### 2. Access the App

Once the container is running, you should see output indicating that Expo is running. You can access it in multiple ways:

#### Option A: Via Web Browser
```
http://localhost:19000
```

#### Option B: Via Expo Go App
1. Install Expo Go from [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Open Expo Go app
3. Scan the QR code from the terminal output

#### Option C: Via Web
```
http://localhost:19000/web
```

### 3. View Logs

To see the app logs and Expo output:

```bash
docker-compose logs -f tictactoe
```

### 4. Stop the Container

To stop the running container:

```bash
docker-compose down
```

## Manual Docker Commands (Without Docker Compose)

If you prefer to use Docker directly without Compose:

### Build the Image

```bash
docker build -t tictactoe-app .
```

### Run the Container

```bash
docker run -it \
  -p 19000:19000 \
  -p 19001:19001 \
  -p 19002:19002 \
  -v "$(pwd)":/app \
  -v /app/node_modules \
  -e EXPO_HOST=0.0.0.0 \
  --name tictactoe-container \
  tictactoe-app
```

### Stop the Container

```bash
docker stop tictactoe-container
```

### Remove the Container

```bash
docker rm tictactoe-container
```

## Troubleshooting

### Port Already in Use
If ports 19000-19002 are already in use, modify the docker-compose.yml:

```yaml
ports:
  - "19100:19000"
  - "19101:19001"
  - "19102:19002"
```

Then access via `http://localhost:19100`

### Permission Denied Error (Linux)
You might need to add your user to the docker group:

```bash
sudo usermod -aG docker $USER
```

### Container Exits Immediately
Check logs with:

```bash
docker-compose logs tictactoe
```

## Environment Variables

The following environment variables are configured in docker-compose.yml:

- `EXPO_HOST=0.0.0.0` - Allows connections from outside the container
- `NODE_ENV=production` - Sets Node environment to production

## Notes

- The app runs with hot reload enabled, so changes to your code will be reflected immediately
- Volume mounts ensure that:
  - Code changes sync to the container
  - node_modules persist and don't get overwritten
- The container uses Alpine Linux for a smaller image size

## Accessing Different Platforms

- **Web**: Press `w` in the terminal or visit the URL shown
- **iOS**: Press `i` in the terminal (macOS only with Xcode)
- **Android**: Press `a` in the terminal (requires Android emulator)
- **iOS/Android via Expo Go**: Scan the QR code with Expo Go app
