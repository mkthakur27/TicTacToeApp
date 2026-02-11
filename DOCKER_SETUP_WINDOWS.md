# Docker Setup for Windows - TicTacToeApp

## Docker Installation Guide

### Option 1: Install Docker Desktop (Recommended)

Docker Desktop is the easiest way to get Docker on Windows.

#### Steps:

1. **Download Docker Desktop**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - Choose your Windows version (Intel or Apple Silicon)

2. **Install Docker Desktop**
   - Run the downloaded installer
   - Follow the installation wizard
   - Accept the license agreement
   - Choose installation preferences:
     - ✅ Install required Windows components for WSL 2
     - ✅ Add Docker to PATH
   - Restart your computer when prompted

3. **Verify Installation**
   Open PowerShell or CMD and run:
   ```powershell
   docker --version
   docker run hello-world
   ```

4. **Start Docker Desktop**
   - Open "Docker Desktop" from Start Menu
   - Wait for it to fully start (check system tray)
   - You should see the Docker icon in the taskbar

---

### Option 2: Install Docker without Docker Desktop

If Docker Desktop doesn't work, you can use Docker with WSL 2:

1. **Enable WSL 2**
   ```powershell
   # Open PowerShell as Administrator and run:
   wsl --install
   wsl --set-default-version 2
   ```

2. **Install Docker in WSL 2**
   ```powershell
   # Access WSL terminal
   wsl
   
   # Then run in WSL:
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

---

## Troubleshooting

### Issue: Docker not found even after installation

1. **Restart PowerShell/CMD**
   - Close and reopen your terminal completely
   - Docker needs to update the PATH

2. **Check Docker is running**
   - Open Docker Desktop from Start Menu
   - Wait for the icon to appear in system tray
   - The app won't work until Docker Desktop is running

3. **Manually add Docker to PATH** (if needed)
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under User variables, click "New"
   - Variable name: `Path`
   - Variable value: `C:\Program Files\Docker\Docker\resources\bin`
   - Click OK and restart terminal

### Issue: WSL 2 errors

```powershell
# Check WSL version
wsl -l -v

# Update WSL kernel
wsl --update

# Set WSL 2 as default
wsl --set-default-version 2
```

---

## Running the App Without Docker

If you still can't get Docker working, here's how to run the app directly:

### Direct npm method:

```powershell
# Install dependencies
npm install

# Start the Expo dev server
npm start
```

Then:
- Press `w` for web
- Or scan the QR code with Expo Go app
- Or press `i` for iOS or `a` for Android

---

## Quick Comparison

| Method | Setup Time | Ease | Requirements |
|--------|-----------|------|--------------|
| Docker Desktop | ~10 min | Very Easy | Installation only |
| WSL 2 + Docker | ~15 min | Medium | Command line |
| Direct npm | ~2 min | Easiest | Node.js installed |

---

## After Docker is installed

Once Docker is working, use these commands:

```powershell
# Start the app
docker-compose up -d

# View logs
docker-compose logs -f tictactoe

# Stop the app
docker-compose down

# Or use the helper script
.\run-docker.ps1 start
.\run-docker.ps1 logs
.\run-docker.ps1 stop
```

Access at: http://localhost:19000
