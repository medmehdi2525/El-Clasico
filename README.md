# ⚽ Football Goals Tracker

A comprehensive football/soccer goals tracking web application with a Champions League-inspired design.

## Features

- **Player Management**: Add, delete, and manage players with permanent/temporary status
- **Goals Tracking**: Track monthly and all-time goals for each player
- **Statistics**: View streaks, matches played, and comprehensive statistics
- **Top Scorer**: Prominent banner showcasing the monthly top scorer
- **Team Division**: Divide players into balanced teams (Team A vs Team B)
- **Payment Tracker**: Log stadium rental payments
- **Data Import/Export**: Save and load your data as JSON files
- **Persistent Storage**: All data automatically saves and persists

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd football-goals-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Adding Players
Click the "➕ Add Player" button and enter the player's name. Players are marked as "Permanent" by default, but you can toggle this status by clicking the badge icon on their card.

### Tracking Goals
Use the "➕ Add Goal" and "➖ Remove Goal" buttons on each player card to track goals. Goals are automatically tracked by month and year.

### Viewing Statistics
Click "📊 Show Statistics" to view comprehensive statistics including total players, goals this month, all-time goals, average goals per player, and matches played.

### Dividing Teams
1. Click "👥 Divide Teams"
2. Select players using checkboxes (or use "Select All")
3. Click "⚖️ Balance Teams" for balanced division or "🎲 Random Shuffle" for random division
4. Click "🏟️ Log Match" to record a match (increments matches played for all participants)

### Payment Tracking
Click "💰 Show Payments" to track stadium rental payments. Add payments with amount and date, and view the total amount paid.

### Import/Export Data
- **Export**: Click "📤 Export" to download all data as a JSON file
- **Import**: Click "📥 Import" and select a previously exported JSON file

## Technology Stack

- React 18
- Vite
- CSS3 (with Champions League theme)
- Browser Storage API (with localStorage fallback)

## Design

The application features a Champions League-inspired design with:
- Green grass pattern background
- Gold/yellow accents for top scorer
- Blue and red team colors
- Clean white cards with transparency
- Smooth animations and hover effects
- Responsive design for mobile and desktop

## License

This project is open source and available for personal use.
