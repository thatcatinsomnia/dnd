"use client";

import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LayoutPreview from '#/components/LayoutPreview';

export default function StoredLayoutPreview() {
    const [isLoading, setIsLoading] = useState(true)
    const [layout, setLayout] = useState<LayoutElement[]>([]);

    useEffect(() => {
        const layoutStr = localStorage.getItem('layout');

        if (layoutStr) {
            setLayout(JSON.parse(layoutStr));
        }

        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="h-dvh flex items-center justify-center">Loading...</div>;
    }

    if (layout.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-6">
                <h2 className="text-4xl font-bold text-slate-600">No layout found</h2>
                <Link href="/" className="text-blue-600">Go back</Link>
            </div>
        );
    }

    return <LayoutPreview layout={layout} />;
}
