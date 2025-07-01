# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClippingKK (Tanjong) is a React Native mobile application for managing book clippings and highlights. The app supports iOS and Android platforms with features including social sharing, premium subscriptions, and multi-language support.

## Common Development Commands

### Running the Application
```bash
# iOS
npm run ios
# or for specific device
npm run ios -- --device "iPhone 16 Pro"

# Android
npm run android
# or for release build
npm run android -- --mode release
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Quality
```bash
# Run linting
npm run lint

# Run type checking
npm run ts:check
```

### GraphQL Code Generation
```bash
# Generate TypeScript types from GraphQL schema
npm run codegen
```

### Release Management
```bash
# Prepare a new release
npm run release
```

## High-Level Architecture

### Technology Stack
- **Framework**: React Native 0.79.3 with TypeScript
- **State Management**: 
  - Jotai for global client state
  - React Query (v5) for server state caching
  - XState for complex state machines (authentication flows)
- **API**: GraphQL with Apollo Client
- **UI Framework**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation with bottom tabs and nested stacks
- **Testing**: Jest with React Native Testing Library

### Code Organization

The application follows a feature-based organization with clear separation of concerns:

- **Navigation Structure**: Bottom tab navigation with 5 main tabs (Home, Square, AI, Collections, Profile), each containing nested stack navigators
- **State Management Pattern**: 
  - Jotai atoms in `/src/atoms/` for global state
  - React Query hooks in `/src/hooks/` for server data
  - XState machines in `/src/machines/` for complex workflows
- **API Integration**: 
  - GraphQL operations defined in `/src/schema/`
  - Generated types in `/src/schema/generated.ts`
  - Apollo Client configuration in `/src/apollo.ts`

### Key Architectural Decisions

1. **Authentication**: Multi-method authentication (email, phone, Apple Sign In, Web3) managed through XState state machines
2. **Styling**: Utility-first approach using NativeWind with component library from Gluestack UI
3. **Internationalization**: Multi-language support (EN, ZH, KO) using i18next
4. **Native Integration**: iOS widget extension for home screen widgets
5. **Premium Features**: Stripe integration for subscription management

### Development Workflow

When making changes:
1. For UI changes, check existing components in `/src/components/` and follow the established patterns
2. For new API operations, add GraphQL queries/mutations to `/src/schema/` and run `npm run codegen`
3. For state management, prefer Jotai atoms for client state and React Query for server state
4. Always run `npm run lint` and `npm run ts:check` before committing

### Important Files and Patterns

- **Environment Configuration**: `.env` file required with API endpoints and keys
- **Navigation Types**: Strongly typed navigation in `/src/types.ts`
- **Theme Configuration**: Design tokens and theme setup in `/src/theme/`
- **API Error Handling**: Centralized error handling through Apollo Client error links

### Platform-Specific Considerations

- iOS: Requires CocoaPods installation (`cd ios && pod install`)
- Android: Gradle configuration in `/android/` directory
- Both platforms share the same React Native codebase with minimal platform-specific code