# Safety Intelligence Hub - UI Prototype

A React-based safety monitoring and emergency response platform with AI-powered features.

## Features

- **AI-Powered Safety Monitoring**: Anomaly detection, predictive alerts, and intelligent dashboard summaries
- **Digital ID Management**: Secure digital identity cards with QR codes
- **Location Services**: Real-time location sharing, geofencing, and mesh relay networks
- **Emergency Response**: SOS functionality, guardian mode, and safety status tracking
- **Multi-language Support**: AI-powered multilingual interface

## Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Real-time Communication**: Socket.IO Client
- **AI Integration**: Google Gemini API
- **Maps**: Turf.js for geospatial operations
- **Security**: Crypto-JS for encryption

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd sihUI
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp ../.env.example .env.local
```
Edit `.env.local` and add your Gemini API key.

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
cd frontend
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
4. Deploy automatically

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

## Environment Variables

- `VITE_GEMINI_API_KEY`: Google Gemini API key for AI features

## Project Structure

```
sihUI/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ai/         # AI-related components
│   │   │   ├── demo/       # Demo functionality
│   │   │   └── safety/     # Safety features
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.