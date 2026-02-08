import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import { GameProvider } from '@/lib/GameContext';

export const metadata: Metadata = {
  title: 'Quest Productivity System',
  description: 'Gamified productivity tracker - Turn your daily tasks into epic quests!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
