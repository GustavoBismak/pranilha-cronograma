import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent mb-2">Bismak Life Manager</h1>
          <p className="text-gray-400">Gerencie sua rotina, Uber e metas</p>
        </div>
        {children}
      </div>
    </div>
  );
}
