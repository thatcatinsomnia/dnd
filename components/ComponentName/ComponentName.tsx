import type { ReactNode } from 'react';

export default function ComponentName({ children }: { children: ReactNode }) {
    return <span className="text-sm pointer-events-none">{children}</span>;
}

