# DarkCTF - Cryptographic Puzzle Challenge

Welcome to DarkCTF, a cryptographic puzzle challenge platform built with FastAPI that serves both frontend UI and API endpoints through a single port. Test your cryptography skills by solving a series of increasingly difficult cipher challenges.

## 🚀 Quick Start (Integrated Single Server)

The application now runs on a single FastAPI server that serves both the frontend UI and API endpoints.

### Prerequisites

- Python 3.8+
- MongoDB instance (local or cloud)

### Setup & Run

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   Create a `.env` file with:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=darkctf
   ```

4. **Start the integrated server**:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```

5. **Access the application**:
   - Frontend UI: http://localhost:8000/
   - API Documentation: http://localhost:8000/docs

## ✨ Features

- 🔗 **Single Server**: Both UI and API served through one port
- 🧩 **Three Progressive Challenges**:
  - Stage 1: Caesar Cipher (Easy)
  - Stage 2: XOR Hexadecimal (Medium)
  - Stage 3: Vigenère Cipher (Hard)
- 🔐 **Sequential Unlocking**: Solve stages in order
- 🏆 **Master Flag**: Complete all challenges
- 💾 **Session Persistence**: Track progress with MongoDB
- 🎨 **Modern UI**: TailwindCSS with cyberpunk theme
- 📱 **Responsive**: Works on desktop and mobile

## 🏗️ Architecture

### Single Server Approach
- **FastAPI** serves both static files (HTML/CSS/JS) and API endpoints
- **Static file middleware** handles frontend assets
- **API routes** prefixed with `/api` for clean separation
- **Single port** (8000) for all services

### Technology Stack
- **Backend**: FastAPI, Python 3.8+, Motor (MongoDB)
- **Frontend**: HTML5, TailwindCSS (CDN), Vanilla JavaScript
- **Database**: MongoDB for session storage
- **Deployment**: Single server instance

## 🎯 Challenge Details

| Stage | Cipher Type | Difficulty | Payload Example |
|-------|-------------|------------|-----------------|
| 1 | Caesar Cipher | Easy | `QHRQ PDWULA` |
| 2 | XOR Hex | Medium | Dynamic hex generation |
| 3 | Vigenère | Hard | Custom cipher text |

## 🔌 API Endpoints

### Frontend
- `GET /` - Serves the main UI (index.html)

### API Routes (prefixed with `/api`)
- `GET /api/puzzles` - Get all challenge puzzles
- `POST /api/session` - Create or resume a session  
- `GET /api/session/{session_id}` - Get session progress
- `POST /api/submit` - Submit answer for a challenge
- `POST /api/reset` - Reset session progress

## 🛠️ Development

### Project Structure
```
.
├── backend/
│   ├── server.py         # Main FastAPI application
│   ├── static/
│   │   └── index.html    # Frontend UI with TailwindCSS
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Environment variables
└── README.md
```

### Key Changes from Multi-Server Setup
- ✅ **Single server** instead of separate frontend/backend
- ✅ **TailwindCSS via CDN** instead of npm package
- ✅ **Vanilla JavaScript** instead of React
- ✅ **Static file serving** instead of separate dev server
- ✅ **Simplified deployment** with one process

### Development Tips
- Use `--reload` flag for auto-restart on code changes
- Check `/docs` endpoint for interactive API documentation
- Monitor terminal logs for debugging
- Test API endpoints with curl or browser dev tools

## 🚀 Production Deployment

```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🔧 Configuration

Environment variables in `.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=darkctf
```

---

**Note**: This is the integrated single-server version. For the original multi-server React + FastAPI setup, please check the git history.
| `/api/session`      | POST   | Create or retrieve a game session  |
| `/api/session/{id}` | GET    | Get session progress               |
| `/api/submit`       | POST   | Submit an answer for validation    |
| `/api/reset`        | POST   | Reset session progress             |

### NPM Scripts

The root package.json includes several helpful scripts:

| Script        | Description                                    |
|---------------|------------------------------------------------|
| `npm start`   | Run both backend and frontend (Unix/Linux/macOS)|
| `npm run start:win` | Run both backend and frontend (Windows)  |
| `npm run backend`   | Run only the backend server              |
| `npm run frontend`  | Run only the frontend server (Unix/Linux/macOS)|
| `npm run frontend:win` | Run only the frontend server (Windows)|
| `npm run dev`       | Run both servers in development mode (Unix/Linux/macOS)|
| `npm run dev:win`   | Run both servers in development mode (Windows)|
| `npm run build`     | Build the frontend application (Unix/Linux/macOS)|
| `npm run build:win` | Build the frontend application (Windows)|

For more detailed information about running the application, see [RUNNING.md](RUNNING.md).

### Component Architecture

The frontend uses a component-based architecture with:
- `CTF.jsx` - Main application page
- `TerminalCard.jsx` - Interactive puzzle interface
- Shadcn/ui components for UI elements
- Custom hooks for state management

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for cryptographic enthusiasts and cybersecurity learners.