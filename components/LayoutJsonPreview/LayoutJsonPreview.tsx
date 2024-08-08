"use client";

import type { LayoutElement } from "#/stores/useLayoutElementsStore";
import { useState, useEffect, Suspense } from "react";

export default function LayoutJsonPreview() {
    const [isLoading, setIsLoading] = useState(true);
    const [layout, setLayout] = useState<LayoutElement[]>([]);

    useEffect(() => {
        const localLayout = localStorage.getItem("layout");
        if (localLayout) {
            setLayout(JSON.parse(localLayout));
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="h-44 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div>
            {layout.length > 0 ? <pre>{JSON.stringify(layout, null, 2)}</pre> : <div>No layout found !!</div>}
        </div>
    );
}
