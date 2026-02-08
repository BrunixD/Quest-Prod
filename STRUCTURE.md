# 📁 Complete Folder Structure

```
quest-productivity-system/
│
├── 📄 package.json                 # Project dependencies and scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 tailwind.config.js          # Tailwind CSS configuration
├── 📄 next.config.js              # Next.js configuration
├── 📄 postcss.config.js           # PostCSS configuration
├── 📄 .eslintrc.json              # ESLint rules
├── 📄 .gitignore                  # Git ignore patterns
│
├── 📖 README.md                   # Full documentation
├── 📖 SETUP.md                    # Installation instructions
├── 📖 QUICKSTART.md               # Quick start guide
├── 📖 STRUCTURE.md                # This file
│
└── 📂 src/                        # Source code directory
    │
    ├── 📂 app/                    # Next.js App Router
    │   ├── 📄 layout.tsx          # Root layout with providers
    │   ├── 📄 page.tsx            # Main application page
    │   └── 📄 globals.css         # Global styles with Tailwind
    │
    ├── 📂 components/             # React components
    │   ├── 📄 XPBar.tsx           # Level progress bar component
    │   ├── 📄 StatsDashboard.tsx  # Stats cards (streak, tasks, XP)
    │   ├── 📄 ScheduleTimeline.tsx # Daily schedule with task slots
    │   ├── 📄 WeeklyRotation.tsx  # Weekly task selection interface
    │   ├── 📄 RewardsShop.tsx     # Reward shop and purchasing
    │   ├── 📄 SettingsPanel.tsx   # Settings and preferences
    │   └── 📄 CelebrationAnimation.tsx # Victory animations
    │
    ├── 📂 lib/                    # Utilities and context
    │   ├── 📄 GameContext.tsx     # Global state management (React Context)
    │   └── 📄 storage.ts          # LocalStorage helper functions
    │
    ├── 📂 types/                  # TypeScript type definitions
    │   └── 📄 index.ts            # All interfaces and types
    │
    └── 📂 data/                   # Static data and constants
        └── 📄 constants.ts        # Initial tasks, rewards, XP rules, levels
```

## 📋 File Descriptions

### Root Configuration Files

#### `package.json`
- Lists all project dependencies
- Defines npm scripts (dev, build, start)
- Project metadata

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases (@/* for src/*)
- Strict type checking enabled

#### `tailwind.config.js`
- Custom color palette (fantasy theme)
- Custom animations (float, shimmer, sparkle)
- Font families (Fredoka, Nunito, Playfair Display)
- Extended theme with cozy colors

#### `next.config.js`
- Next.js framework configuration
- React strict mode enabled

#### `postcss.config.js`
- PostCSS plugins for Tailwind CSS
- Autoprefixer configuration

#### `.eslintrc.json`
- Extends Next.js ESLint config
- Code quality rules

#### `.gitignore`
- Excludes node_modules, .next, build files
- Prevents committing environment files

### Documentation Files

#### `README.md` (8,825 bytes)
- Complete project documentation
- Features overview
- XP system details
- Technology stack
- Future upgrade suggestions
- Troubleshooting guide

#### `SETUP.md` (5,612 bytes)
- Step-by-step installation
- Deployment guides (Vercel, Netlify, Docker)
- Troubleshooting installation issues
- Browser compatibility
- Security notes

#### `QUICKSTART.md` (3,441 bytes)
- 3-minute setup guide
- Your first quest walkthrough
- Pro tips
- Interface overview
- Common commands

### Source Code (`src/`)

#### `app/layout.tsx` (460 bytes)
- Root layout component
- Wraps entire app with GameProvider
- Sets up HTML structure
- Metadata configuration

#### `app/page.tsx` (5,231 bytes)
- Main application page
- Tab navigation system
- Header with XP display
- Renders different views based on active tab
- Footer component

#### `app/globals.css` (1,437 bytes)
- Tailwind directives
- Custom CSS animations
- Google Fonts imports
- Dark mode transitions
- Scrollbar styling

### Components (`src/components/`)

#### `XPBar.tsx` (2,890 bytes)
**Purpose**: Display user level and XP progress
- Shows current level and title
- Animated progress bar
- XP to next level calculation
- Sparkle animations
- Level badge display

#### `StatsDashboard.tsx` (2,314 bytes)
**Purpose**: Overview of key statistics
- Day streak counter with fire emoji
- Tasks completed today
- XP earned today
- Weekly tasks count
- Color-coded stat cards

#### `ScheduleTimeline.tsx` (7,456 bytes)
**Purpose**: Daily schedule management
- 11 time slots (meals, breaks, tasks, free time)
- Assign tasks to task slots
- Complete or skip tasks
- Visual time slot indicators
- Task selection dropdown
- Difficulty badges

#### `WeeklyRotation.tsx` (9,816 bytes)
**Purpose**: Select and manage weekly tasks
- Task selection (4-6 tasks)
- Create custom tasks
- Category grouping
- Task details form
- Completion status
- Save selection button

#### `RewardsShop.tsx` (7,981 bytes)
**Purpose**: Reward purchasing system
- Display available rewards
- Purchase with XP
- Create custom rewards
- Claimed rewards collection
- XP balance display
- Reward cards with icons

#### `SettingsPanel.tsx` (4,502 bytes)
**Purpose**: App settings and preferences
- Dark mode toggle
- Sound effects toggle
- Progress statistics display
- Reset progress option
- Animated toggle switches

#### `CelebrationAnimation.tsx` (3,916 bytes)
**Purpose**: Victory animations
- Triggers on all tasks complete
- Floating stars and particles
- Confetti effect
- Bonus XP display
- Auto-dismiss after 5 seconds

### Library (`src/lib/`)

#### `GameContext.tsx` (8,349 bytes)
**Purpose**: Global state management
- React Context for game state
- Task completion logic
- XP calculation and updates
- Level progression
- Streak tracking
- Weekly task selection
- Reward purchasing
- Settings management
- LocalStorage persistence

**Key Functions**:
- `completeTask()` - Mark task complete, award XP
- `skipTask()` - Apply skip penalty
- `quitTask()` - Apply quit penalty
- `addCustomTask()` - Create new task
- `addCustomReward()` - Create new reward
- `purchaseReward()` - Buy reward with XP
- `selectWeeklyTasks()` - Set weekly focus tasks
- `toggleDarkMode()` - Switch theme
- `resetProgress()` - Clear all data

#### `storage.ts` (2,297 bytes)
**Purpose**: LocalStorage helper functions
- Save game state to browser
- Load game state from browser
- Initialize default state
- Level calculation utilities
- XP progress calculation

**Key Functions**:
- `saveGameState()` - Persist to LocalStorage
- `loadGameState()` - Retrieve from LocalStorage
- `getInitialGameState()` - Default state
- `getCurrentLevel()` - Calculate level from XP
- `getXPForNextLevel()` - Next level requirement
- `getXPProgress()` - Progress percentage

### Types (`src/types/`)

#### `index.ts` (1,519 bytes)
**Purpose**: TypeScript type definitions

**Main Interfaces**:
```typescript
Task                 # Individual task details
TaskCategory         # Task category types
TimeSlot            # Schedule time slot
DailyProgress       # Daily completion data
WeeklyRotation      # Weekly task selection
Reward              # Reward shop item
UserProgress        # User XP and stats
Level               # Level progression data
GameState           # Complete app state
Settings            # User preferences
```

### Data (`src/data/`)

#### `constants.ts` (3,220 bytes)
**Purpose**: Static game data

**Exports**:
- `INITIAL_TASKS` - 22 pre-defined tasks
- `DEFAULT_REWARDS` - 5 starter rewards
- `LEVELS` - 5 level progression tiers
- `DAILY_SCHEDULE` - 11 time slots
- `XP_RULES` - XP rewards and penalties

**Task Categories**:
1. Creative / Art (9 tasks)
2. Craft / Sewing (3 tasks)
3. Writing / Learning (4 tasks)
4. Content / Online (4 tasks)
5. Gaming / Fun (1 task)
6. Life Skills (1 task)

## 🔄 Data Flow

```
User Action
    ↓
Component (e.g., ScheduleTimeline)
    ↓
GameContext (state management)
    ↓
storage.ts (persist to LocalStorage)
    ↓
Re-render components with new state
```

## 🎨 Styling System

### Tailwind Configuration
- **Primary Colors**: Purple/Lavender theme
- **Fantasy Palette**: Cream, Peach, Lavender, Sage, Gold, Rose
- **Dark Mode**: Midnight and Deep purple shades
- **Fonts**: Fredoka (headings), Nunito (body), Playfair (accent)

### Custom Animations
1. **float** - Gentle up/down motion
2. **shimmer** - Sliding shine effect
3. **pulse-glow** - Pulsing glow
4. **bounce-slow** - Slow bounce
5. **wiggle** - Subtle rotation
6. **sparkle** - Scale pulse

## 📦 Dependencies

### Core
- `next` (14.2.3) - React framework
- `react` (18.3.1) - UI library
- `react-dom` (18.3.1) - React DOM renderer

### UI/Styling
- `tailwindcss` (3.4.3) - Utility-first CSS
- `framer-motion` (11.2.6) - Animations
- `lucide-react` (0.263.1) - Icon library

### Utilities
- `date-fns` (3.6.0) - Date manipulation

### Development
- `typescript` (5.0) - Type safety
- `eslint` (8) - Code linting
- `autoprefixer` (10.4.19) - CSS prefixing

## 💾 Storage Structure

LocalStorage key: `quest-productivity-system`

```json
{
  "userProgress": {
    "totalXP": 0,
    "currentLevel": 1,
    "streak": 0,
    "lastActiveDate": "2026-02-08",
    "weeklyProgress": {},
    "history": []
  },
  "tasks": [...],
  "weeklyRotation": {
    "weekStart": "2026-02-03",
    "selectedTasks": []
  },
  "rewards": [...],
  "schedule": [...],
  "settings": {
    "soundEnabled": true,
    "darkMode": false,
    "dailyStartTime": "09:30",
    "dailyEndTime": "16:30"
  }
}
```

## 🚀 Build Output

After `npm run build`:
```
.next/
├── cache/                # Build cache
├── server/              # Server-side code
│   ├── app/            # App router pages
│   └── chunks/         # Code chunks
├── static/             # Static assets
│   ├── chunks/        # JS chunks
│   └── css/           # Compiled CSS
└── BUILD_ID           # Unique build identifier
```

## 📊 File Sizes

| File | Size | Purpose |
|------|------|---------|
| package.json | 670 B | Dependencies |
| tsconfig.json | 578 B | TS config |
| tailwind.config.js | 2.7 KB | Styling |
| README.md | 8.8 KB | Documentation |
| SETUP.md | 5.6 KB | Installation |
| layout.tsx | 460 B | Root layout |
| page.tsx | 5.2 KB | Main page |
| GameContext.tsx | 8.3 KB | State management |
| ScheduleTimeline.tsx | 7.5 KB | Schedule UI |
| WeeklyRotation.tsx | 9.8 KB | Task selection |
| RewardsShop.tsx | 8.0 KB | Rewards UI |

**Total Source Code**: ~55 KB (excluding node_modules)

## 🎯 Key Features by File

### Task Management
- `WeeklyRotation.tsx` - Select tasks
- `ScheduleTimeline.tsx` - Assign & complete
- `GameContext.tsx` - Task logic

### Progression System
- `XPBar.tsx` - Visual progress
- `GameContext.tsx` - XP calculation
- `constants.ts` - Level definitions

### Gamification
- `RewardsShop.tsx` - Reward system
- `CelebrationAnimation.tsx` - Victory effects
- `StatsDashboard.tsx` - Motivation stats

### User Experience
- `SettingsPanel.tsx` - Customization
- `page.tsx` - Navigation
- `globals.css` - Animations

This structure provides a clean, modular architecture that's easy to understand, maintain, and extend!
