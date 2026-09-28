import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideBottomNav?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  hideHeader = false,
  hideBottomNav = false
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface">
      {!hideHeader && <Header />}
      
      <main className={`flex-1 w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-margin ${
        !hideHeader ? 'pt-28' : 'pt-4'
      } ${!hideBottomNav ? 'pb-24' : 'pb-6'}`}>
        {children}
      </main>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
};
