import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="p-6 min-h-screen bg-white text-slate-700">{children}</div>
    );
}
