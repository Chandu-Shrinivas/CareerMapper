import type { RoadmapDefinition } from '../types/roadmap';

export const ANDROID_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "android",
  "slug": "android",
  "title": "Android Developer",
  "version": "2026.1",
  "description": "Step by step guide to becoming an Android Developer in 2026: Kotlin, Jetpack Compose, Coroutines, Architecture (MVVM/MVI), Room, and Retrofit.",
  "nodes": [
    {
      "id": "android-main-header",
      "title": "Android Developer",
      "type": "main",
      "description": "Step by step guide to becoming an Android Developer in 2026: Kotlin, Jetpack Compose, Coroutines, Architecture (MVVM/MVI), Room, and Retrofit.",
      "statusEnabled": false
    },
    {
      "id": "android-topic-1",
      "title": "Kotlin Language Fundamentals",
      "type": "topic",
      "description": "Mastering Kotlin syntax, null safety, extension functions, lambdas, and object-oriented concepts.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "android-subtopic-1-1",
      "title": "Kotlin Null Safety",
      "type": "subtopic",
      "description": "Key subtopic concept: Kotlin Null Safety",
      "parentId": "android-topic-1",
      "parentTitle": "Kotlin Language Fundamentals",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-1-2",
      "title": "Coroutines & Flows",
      "type": "subtopic",
      "description": "Key subtopic concept: Coroutines & Flows",
      "parentId": "android-topic-1",
      "parentTitle": "Kotlin Language Fundamentals",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-1-3",
      "title": "Extension Functions & Lambdas",
      "type": "subtopic",
      "description": "Key subtopic concept: Extension Functions & Lambdas",
      "parentId": "android-topic-1",
      "parentTitle": "Kotlin Language Fundamentals",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-1-4",
      "title": "Data Classes & Sealed Interfaces",
      "type": "subtopic",
      "description": "Key subtopic concept: Data Classes & Sealed Interfaces",
      "parentId": "android-topic-1",
      "parentTitle": "Kotlin Language Fundamentals",
      "statusEnabled": true
    },
    {
      "id": "android-topic-2",
      "title": "Android UI & Jetpack Compose",
      "type": "topic",
      "description": "Building modern Android user interfaces with declarative Jetpack Compose, state, and themes.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "android-subtopic-2-1",
      "title": "Composable Functions & State",
      "type": "subtopic",
      "description": "Key subtopic concept: Composable Functions & State",
      "parentId": "android-topic-2",
      "parentTitle": "Android UI & Jetpack Compose",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-2-2",
      "title": "Layouts (Column, Row, Box, LazyColumn)",
      "type": "subtopic",
      "description": "Key subtopic concept: Layouts (Column, Row, Box, LazyColumn)",
      "parentId": "android-topic-2",
      "parentTitle": "Android UI & Jetpack Compose",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-2-3",
      "title": "Material Design 3 Components",
      "type": "subtopic",
      "description": "Key subtopic concept: Material Design 3 Components",
      "parentId": "android-topic-2",
      "parentTitle": "Android UI & Jetpack Compose",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-2-4",
      "title": "Compose Animations & Navigation",
      "type": "subtopic",
      "description": "Key subtopic concept: Compose Animations & Navigation",
      "parentId": "android-topic-2",
      "parentTitle": "Android UI & Jetpack Compose",
      "statusEnabled": true
    },
    {
      "id": "android-topic-3",
      "title": "Android Architecture (MVVM & MVI)",
      "type": "topic",
      "description": "Structuring scalable Android apps with ViewModel, LiveData/StateFlow, Repository, and Clean Architecture.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "android-subtopic-3-1",
      "title": "ViewModel & StateFlow",
      "type": "subtopic",
      "description": "Key subtopic concept: ViewModel & StateFlow",
      "parentId": "android-topic-3",
      "parentTitle": "Android Architecture (MVVM & MVI)",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-3-2",
      "title": "Repository Pattern",
      "type": "subtopic",
      "description": "Key subtopic concept: Repository Pattern",
      "parentId": "android-topic-3",
      "parentTitle": "Android Architecture (MVVM & MVI)",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-3-3",
      "title": "Clean Architecture Layers",
      "type": "subtopic",
      "description": "Key subtopic concept: Clean Architecture Layers",
      "parentId": "android-topic-3",
      "parentTitle": "Android Architecture (MVVM & MVI)",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-3-4",
      "title": "Hilt / Koin Dependency Injection",
      "type": "subtopic",
      "description": "Key subtopic concept: Hilt / Koin Dependency Injection",
      "parentId": "android-topic-3",
      "parentTitle": "Android Architecture (MVVM & MVI)",
      "statusEnabled": true
    },
    {
      "id": "android-topic-4",
      "title": "Data Persistence & Networking",
      "type": "topic",
      "description": "Local database storage with Room DB, DataStore preferences, and HTTP networking with Retrofit.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "android-subtopic-4-1",
      "title": "Room DB & DAO Interfaces",
      "type": "subtopic",
      "description": "Key subtopic concept: Room DB & DAO Interfaces",
      "parentId": "android-topic-4",
      "parentTitle": "Data Persistence & Networking",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-4-2",
      "title": "Retrofit & OkHttp API Integration",
      "type": "subtopic",
      "description": "Key subtopic concept: Retrofit & OkHttp API Integration",
      "parentId": "android-topic-4",
      "parentTitle": "Data Persistence & Networking",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-4-3",
      "title": "Preferences DataStore",
      "type": "subtopic",
      "description": "Key subtopic concept: Preferences DataStore",
      "parentId": "android-topic-4",
      "parentTitle": "Data Persistence & Networking",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-4-4",
      "title": "Offline-First Synchronization",
      "type": "subtopic",
      "description": "Key subtopic concept: Offline-First Synchronization",
      "parentId": "android-topic-4",
      "parentTitle": "Data Persistence & Networking",
      "statusEnabled": true
    },
    {
      "id": "android-topic-5",
      "title": "Testing, Deployment & Play Store",
      "type": "topic",
      "description": "Unit testing, UI testing with Espresso/Compose Test, CI/CD, and publishing on Google Play Store.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "android-subtopic-5-1",
      "title": "JUnit & Mockk Unit Tests",
      "type": "subtopic",
      "description": "Key subtopic concept: JUnit & Mockk Unit Tests",
      "parentId": "android-topic-5",
      "parentTitle": "Testing, Deployment & Play Store",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-5-2",
      "title": "Compose UI Testing",
      "type": "subtopic",
      "description": "Key subtopic concept: Compose UI Testing",
      "parentId": "android-topic-5",
      "parentTitle": "Testing, Deployment & Play Store",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-5-3",
      "title": "Play Console Publishing",
      "type": "subtopic",
      "description": "Key subtopic concept: Play Console Publishing",
      "parentId": "android-topic-5",
      "parentTitle": "Testing, Deployment & Play Store",
      "statusEnabled": true
    },
    {
      "id": "android-subtopic-5-4",
      "title": "App Performance & LeakCanary",
      "type": "subtopic",
      "description": "Key subtopic concept: App Performance & LeakCanary",
      "parentId": "android-topic-5",
      "parentTitle": "Testing, Deployment & Play Store",
      "statusEnabled": true
    },
    {
      "id": "android-nav-1",
      "title": "Full Stack Developer",
      "type": "navigation",
      "description": "Explore the Full Stack Developer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/fullstack"
    }
  ],
  "badges": [],
  "relatedRoadmaps": []
};
