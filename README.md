# DarkCTF - Cryptographic Puzzle Challenge

Welcome to DarkCTF, a cryptographic puzzle challenge platform built with modern web technologies. Test your cryptography skills by solving a series of increasingly difficult cipher challenges.

![DarkCTF Screenshot](./docs/screenshot.png) *(Screenshot placeholder - add actual screenshot)*

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Challenge Structure](#challenge-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## About

DarkCTF is a web-based cryptographic challenge platform that presents users with a series of cipher puzzles to solve. Players progress through stages, each with increasing difficulty, unlocking new challenges as they successfully solve the previous ones.

The application features a sleek dark-themed UI inspired by terminal/console interfaces with matrix green and cyber red accents.

## Features

- 🧩 Three progressive cryptographic challenges:
  - Stage 1: Caesar Cipher
  - Stage 2: XOR Hexadecimal
  - Stage 3: Vigenère Cipher
- 🔐 Progressive unlocking system (solve stages in order)
- 🏆 Master flag achievement upon completing all challenges
- 💾 Persistent session progress tracking
- 🎨 Modern dark theme UI with responsive design
- 📱 Mobile-friendly interface with collapsible sidebar
- ⚡ Real-time feedback on submissions

## Tech Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Reusable component library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Vite** - Fast build tool (configured via Craco)

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database for session storage
- **Motor** - Asynchronous MongoDB driver for Python
- **Pydantic** - Data validation and settings management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB instance (local or cloud)
- Yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=darkctf
   ```

5. Start the backend server:
   ```bash
   python server.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn server:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   yarn start
   ```

5. Open your browser to `http://localhost:3000`

## Usage

1. Open the application in your browser
2. Start with Stage 1 (Caesar Cipher)
3. Enter the decrypted phrase to solve the challenge
4. Receive a flag upon successful completion
5. Progress to the next unlocked stage
6. Solve all three stages to unlock the Master Flag

## Challenge Structure

| Stage | Cipher Type    | Difficulty | Color Code |
|-------|----------------|------------|------------|
| 1     | Caesar Cipher  | Easy       | #00FF41    |
| 2     | XOR Hex        | Medium     | #F78166    |
| 3     | Vigenère Cipher| Hard       | #FF0040    |

Each stage provides:
- A descriptive prompt
- An encrypted payload to decrypt
- Validation against the expected answer
- A unique flag upon successful completion

## Development

### Project Structure

```
.
├── backend/
│   ├── server.py         # Main FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── mock/         # Mock data for frontend
│   │   └── hooks/        # Custom React hooks
│   ├── public/           # Static assets
│   └── .env             # Environment variables
└── README.md
```

### API Endpoints

| Endpoint            | Method | Description                        |
|---------------------|--------|------------------------------------|
| `/api/puzzles`      | GET    | Retrieve puzzle metadata           |
| `/api/session`      | POST   | Create or retrieve a game session  |
| `/api/session/{id}` | GET    | Get session progress               |
| `/api/submit`       | POST   | Submit an answer for validation    |
| `/api/reset`        | POST   | Reset session progress             |

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