# 🎬 Mahmoud Badr | Cinematic Video Editor & Director Portfolio

Welcome to the official, state-of-the-art cinematic portfolio of **Mahmoud Badr**, a premium Video Editor, Motion Graphic Designer, and Director specializing in advertisements, music videos, social reels, and high-end visual storytelling.

This repository hosts a robust **Full-Stack Application** built with **React** on the frontend and an **ASP.NET Core Web API** on the backend.

## 🌟 Premium UX & Design Features
* **Spotlight Tracker Backdrop**: High-end interactive background overlay that tracks mouse movements on desktops for a theatrical feel.
* **Cinematic Ticker Banner**: High-impact horizontal metric banner showing stats like +500 Clients, +5000 Projects, 5 Years Experience, and 10M+ Views.
* **Scroll Count-Up Utility**: Dynamic ease-out numeric animation triggering as visitors scroll to the banner.
* **Space Grotesk Typography**: Premium modern geometry font layout styled via CSS variables.
* **Custom Laser Cursor**: Interactive red glowing ring cursor adding sleek modern depth to desktop browsing.

## 💻 Frontend Architecture & Tech Stack
* **React 18**: Main frontend UI library.
* **React Router v6**: Client-side single page application router.
* **Vite**: Ultra-fast hot-reloading development bundler.
* **Lucide Icons**: Clean, light SVG iconography.
* **CSS Custom Properties**: Harmonious vanilla styling system (no heavy utility libraries).

## 🗄️ Backend Architecture & Tech Stack
* **ASP.NET Core Web API (.NET 10.0)**: Production-grade REST API backend.
* **Entity Framework Core**: Code-First Object-Relational Mapper (ORM).
* **SQLite / SQL Server**: Production ready relational databases.
* **Swagger/OpenAPI**: Built-in interactive sandbox testing environment.

## 🚀 Frontend Local Setup
To run the React development server locally:
```bash
cd Frontend
npm install
npm run dev
```
The development server will spin up on `http://localhost:5173`.

## ⚙️ Backend Local Setup
To configure and run the .NET Core backend API:
1. Restore core dependencies:
   ```bash
   cd Backend/Portfolio.API
   dotnet restore
   ```
2. Apply database migrations:
   ```bash
   dotnet ef database update
   ```
3. Start the Web API server:
   ```bash
   dotnet run
   ```
The interactive Swagger playground will automatically open on `http://localhost:5000/swagger`.

## 🌐 Dynamic API Connection Configurations
To eliminate hardcoded routing errors during staging, the frontend is built with a dynamic central environment router (`src/config.js`):
```javascript
const API_BASE_URL = "https://mahmoudbadr.runasp.net";
```
This ensures the client automatically synchronizes with your live production cloud database!
