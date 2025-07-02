
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-brand-600"
              >
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <h1 className="text-xl font-bold text-foreground">Email Validate-Matic</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t bg-background/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto py-4 px-4 sm:px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Email Validate-Matic - Validate your email lists with ease
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
