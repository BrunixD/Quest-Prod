# 🎮 Quest Productivity System

A gamified productivity tracker that transforms your daily tasks into epic quests! Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

![Quest Productivity System](https://img.shields.io/badge/Version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

### 🎯 Core Gameplay
- **Daily Schedule System**: Structured 09:30-16:30 day with 4 task slots
- **XP & Leveling**: Earn experience points and level up (5 levels)
- **Streak System**: Track consecutive productive days
- **Rewards Shop**: Spend XP on custom rewards
- **Weekly Rotation**: Select 4-6 focus tasks per week

### 🏆 Gamification
- Complete task: +15 XP
- Hard/Creative task: +20 XP
- Complete all 4 daily tasks: +25 XP bonus
- Weekly consistency (4+ days): +50 XP
- Penalties for skipping tasks

### 🎨 UI/UX
- **Cozy Fantasy RPG Theme**: Beautiful pastel colors and fantasy aesthetics
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: Powered by Framer Motion
- **Celebration Effects**: Epic animations when completing all daily tasks
- **Responsive Design**: Works on desktop, tablet, and mobile

### 📊 Progress Tracking
- Real-time XP bar with visual progress
- Daily statistics dashboard
- Streak counter with fire emoji
- Weekly task completion tracking
- Comprehensive settings panel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Extract the project files**
   ```bash
   cd quest-productivity-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
quest-productivity-system/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with GameProvider
│   │   ├── page.tsx             # Main application page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── XPBar.tsx            # Level progress bar
│   │   ├── StatsDashboard.tsx   # Stats overview cards
│   │   ├── ScheduleTimeline.tsx # Daily schedule with task slots
│   │   ├── WeeklyRotation.tsx   # Task selection interface
│   │   ├── RewardsShop.tsx      # Reward purchasing system
│   │   ├── SettingsPanel.tsx    # Settings and preferences
│   │   └── CelebrationAnimation.tsx # Victory animations
│   ├── lib/
│   │   ├── GameContext.tsx      # Global state management
│   │   └── storage.ts           # LocalStorage utilities
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── data/
│       └── constants.ts         # Game data and rules
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🎮 How to Use

### 1. Select Weekly Tasks
- Go to "Weekly Tasks" tab
- Select 4-6 tasks you want to focus on this week
- Click "Save Selection"
- You can create custom tasks with the "New Task" button

### 2. Assign Daily Tasks
- Go to "Dashboard" tab
- Click "Assign Task" on any of the 4 task slots
- Choose from your selected weekly tasks
- Each task slot is 1 hour long

### 3. Complete Tasks
- Click "Complete" when you finish a task
- Earn XP based on task difficulty
- Complete all 4 daily tasks for a bonus!

### 4. Manage Progress
- Track your XP and level in the progress bar
- View daily stats (streak, tasks completed, XP earned)
- Maintain your streak by completing tasks daily

### 5. Earn Rewards
- Go to "Rewards" tab
- Purchase rewards with earned XP
- Create custom rewards for yourself
- Claimed rewards appear in your collection

### 6. Customize Settings
- Toggle dark mode for nighttime use
- Enable/disable sound effects
- View your overall progress stats
- Reset progress if needed (with confirmation)

## 🎯 XP System

### Earning XP
| Action | XP Reward |
|--------|-----------|
| Complete Easy Task | +15 XP |
| Complete Medium Task | +20 XP |
| Complete Hard Task | +20 XP |
| Complete All 4 Daily Tasks | +25 XP Bonus |
| 4+ Days Weekly Consistency | +50 XP Bonus |

### Penalties
| Action | XP Loss |
|--------|---------|
| Skip Task | -5 XP |
| Skip Entire Day | -20 XP |
| Quit Mid-Task | -10 XP |

### Levels
1. **Level 1** - New Adventurer (0 XP)
2. **Level 2** - Hobbyist (100 XP)
3. **Level 3** - Creator (250 XP)
4. **Level 4** - Artisan (500 XP)
5. **Level 5** - Master Crafter (900 XP)

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Storage**: LocalStorage

## 🎨 Customization

### Adding Custom Tasks
1. Go to Weekly Tasks tab
2. Click "New Task"
3. Fill in task details
4. Choose category and difficulty
5. Click "Add Task"

### Creating Custom Rewards
1. Go to Rewards tab
2. Click "Custom Reward"
3. Enter reward details and XP cost
4. Choose an emoji icon
5. Click "Add Reward"

### Modifying Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  fantasy: {
    cream: '#fff8f0',
    peach: '#ffd6ba',
    lavender: '#c8b6e2',
    // ... customize colors
  }
}
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔧 Build & Deploy

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy Options

#### Vercel (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Deploy with one click

#### Netlify
1. Push code to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

#### Self-Host
```bash
npm run build
npm start
```

## 🆕 Future Upgrade Suggestions

### Phase 1: Enhanced Features
- [ ] Weekly consistency bonus automatic calculation
- [ ] Historical progress charts and graphs
- [ ] Export progress data to JSON/CSV
- [ ] Import/export custom tasks and rewards
- [ ] Task categories with custom icons
- [ ] Multiple daily schedule templates

### Phase 2: Social Features
- [ ] Share achievements on social media
- [ ] Compete with friends on leaderboards
- [ ] Team challenges and group quests
- [ ] Achievement badges system
- [ ] Profile customization

### Phase 3: Advanced Gamification
- [ ] Quest chains (multi-day tasks)
- [ ] Boss battles (major milestones)
- [ ] Power-ups and boosts
- [ ] Seasonal events
- [ ] Pet companion system
- [ ] Skill trees and specializations

### Phase 4: Productivity Enhancements
- [ ] Pomodoro timer integration
- [ ] Calendar sync (Google Calendar, etc.)
- [ ] Task dependencies
- [ ] Recurring tasks
- [ ] Time tracking per task
- [ ] Focus mode (distraction blocker)

### Phase 5: Data & Analytics
- [ ] Detailed productivity analytics
- [ ] Weekly/monthly reports
- [ ] Habit formation tracking
- [ ] Productivity heatmap
- [ ] AI-powered task suggestions
- [ ] Performance insights

### Phase 6: Technical Improvements
- [ ] Backend database (Firebase/Supabase)
- [ ] User authentication
- [ ] Cloud sync across devices
- [ ] Progressive Web App (PWA)
- [ ] Offline mode
- [ ] Push notifications

## 🐛 Troubleshooting

### Tasks not appearing?
- Make sure you've selected tasks in the Weekly Rotation tab
- Check that tasks aren't already completed

### XP not updating?
- Refresh the page
- Check browser console for errors
- Verify LocalStorage is enabled

### Dark mode not working?
- Clear browser cache
- Check that JavaScript is enabled

### Animation issues?
- Update to latest browser version
- Disable browser hardware acceleration if laggy

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 💬 Support

Need help? Have suggestions?
- Check the documentation above
- Open an issue on GitHub
- Review the code comments

## 🎉 Credits

Built with ❤️ for productive adventurers everywhere!

Special thanks to:
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling
- Framer Motion for smooth animations
- Lucide for beautiful icons

---

**Happy questing! May your productivity be legendary! ⚔️✨**
