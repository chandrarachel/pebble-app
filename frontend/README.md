# 🪨 Pebble - Location-Based Reminders & Collaboration

A modern, intuitive mobile app for location-based reminders and collaboration built with React Native and AWS.

## ✨ Features

- **📍 Location-Based Reminders**: Set reminders that trigger when you arrive at specific locations
- **🗺️ Interactive Map**: View all your reminders on a beautiful map with custom pebble pins
- **📋 Card-Style List**: Manage reminders in an organized, priority-based list view
- **👥 Collaboration**: Share reminders with friends and create group reminders
- **🔔 Smart Notifications**: Get notified when you're near reminder locations
- **🎨 Beautiful Design**: Nature-inspired palette with playful, rounded UI elements

## 🎨 Design System

### Colors
- **Pebble Green**: `#5C8374` - Primary brand color
- **Aqua**: `#6EC6CA` - Secondary actions and accents
- **Mint White**: `#F2F7F5` - Background and light elements
- **Slate**: `#232D3F` - Text and dark elements
- **Warm Yellow**: `#FFD166` - Highlights and priority indicators

### Design Principles
- Mobile-first responsive design
- Accessibility compliant (WCAG 2.1 AA)
- Rounded shapes and smooth animations
- Ripple effects for interactive elements
- Clean, playful, and supportive tone

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **NativeWind** - Utility-first styling (Tailwind for React Native)
- **React Navigation** - Navigation and routing
- **React Native Maps** - Interactive map component

### Backend (AWS)
- **AWS Amplify** - Full-stack development platform
- **Amazon Cognito** - User authentication and management
- **AWS AppSync** - GraphQL API with real-time subscriptions
- **Amazon DynamoDB** - NoSQL database for scalable data storage
- **Amazon S3** - File storage for user avatars and media
- **Amazon Location Service** - Maps, geocoding, and geofencing
- **Amazon SNS** - Push notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- AWS CLI configured
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pebble-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS configuration
   ```

4. **Initialize AWS Amplify**
   ```bash
   amplify init
   amplify push
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

### AWS Setup

1. **Configure Amplify**
   ```bash
   amplify configure
   ```

2. **Add Authentication**
   ```bash
   amplify add auth
   ```

3. **Add API (GraphQL)**
   ```bash
   amplify add api
   ```

4. **Add Storage**
   ```bash
   amplify add storage
   ```

5. **Add Geo (Location Services)**
   ```bash
   amplify add geo
   ```

6. **Deploy to AWS**
   ```bash
   amplify push
   ```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   └── PebbleButton.js  # Custom button component
├── screens/             # Main app screens
│   ├── MapScreen.js     # Interactive map with pebble pins
│   ├── ListScreen.js    # Card-style reminder list
│   └── ProfileScreen.js # User profile and settings
├── services/            # API and external services
│   ├── amplifyConfig.js # AWS Amplify configuration
│   └── reminderService.js # GraphQL operations
├── utils/               # Utility functions
│   └── notifications.js # Push notification handling
└── types/               # Type definitions
    └── index.js         # App-wide type constants
```

## 🔧 Key Components

### MapScreen
- Interactive map with custom pebble pins
- Color-coded priority indicators
- Add new reminders by tapping locations
- Real-time location tracking

### ListScreen
- Card-based reminder layout
- Priority indicators and completion status
- Filter and sort options
- Swipe actions for quick operations

### ProfileScreen
- User account management
- Group and sharing settings
- Statistics and achievements
- App preferences

## 🔔 Notifications

The app supports two types of notifications:

1. **Location-Based**: Triggered when entering geofenced areas
2. **Time-Based**: Scheduled notifications for due dates

## 🤝 Collaboration Features

- **Groups**: Create and manage reminder groups
- **Sharing**: Share individual reminders with specific users
- **Permissions**: Control edit access for shared reminders
- **Real-time Updates**: See changes from collaborators instantly

## 🔒 Security & Privacy

- End-to-end encryption for sensitive data
- AWS Cognito for secure authentication
- Fine-grained access controls
- GDPR compliant data handling

## 📈 Performance

- Optimized for 60fps animations
- Efficient map rendering with clustering
- Background location processing
- Offline-first data synchronization

## 🧪 Testing

```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact [support@pebbleapp.com](mailto:support@pebbleapp.com)

---

Made with 💚 by the Pebble Team