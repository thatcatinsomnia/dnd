import type { ReactNode } from 'react';

export default function PreviewWrapper({ children }: {
    children: ReactNode;
}) {
    return (
        <div className="mt-4 relative after:content-[''] after:absolute after:inset-0 after:border after:border-transparent after:pointer-events-none hover:after:border-blue-600">
            {children}
        </div>
    );
}

