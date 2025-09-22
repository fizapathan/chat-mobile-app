# Install dependencies
npm install

# Run development server
npm run start

# Build for production
npm run build

# Start iOS simulator
npm run ios

# Start Android emulator 
npm run android

# Generate production build for iOS
npm run build:ios

# Generate production build for Android
npm run build:android

* Folder Structure:
There are limited number of features in the app so it follows conventional mvc kind of folder structure, which makes it easy to understand and maintain.
```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom hooks
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API and backend services
├── store/          # Global state management
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Uses Zustand for Store management
    - Simple and lightweight state management with less boilerplate code as compared to Redux.
    - doesn't use providers concept like redux and context api. hence reducing re-renders.

## Note:
    - This app uses single chatroom, where all the users can send messages. It doesn't support individual chatting among users.