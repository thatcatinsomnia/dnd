'use client';

import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect, useRef } from 'react';
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { twMerge } from 'tailwind-merge'; import LayoutPreview from '#/components/LayoutPreview';
import { useLayoutElementsStore, pushNewLayoutElement } from '#/stores/useLayoutElementsStore';

type DragState = 
    | { type: 'idle' }
    | { type: 'is-block-over' };

const idle = { type: 'idle' } as const;
const isBlockOver = { type: 'is-block-over' } as const;

export default function WebsiteBuilder() {
    const layoutElements = useLayoutElementsStore(state => state.elements);
    const [dragState, setDragState] = useState<DragState>(idle);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current!;

        const cleanup = dropTargetForElements({
            element: element,
            onDragEnter: () => setDragState(isBlockOver),
            onDragLeave: () => setDragState(idle),
            onDrop: () => setDragState(idle)
        }); 

        return () => cleanup();
    }, []);

    useEffect(() => {
        const cleanup = monitorForElements({
            // there are two possible case:
            // 1. dorp component from side bar
            // 2. reorder component already in website builder
            // The `location.current` property will accurately contain the final drop targets.
            onDrop: ({ location, source }) => {
                const layoutElement = source.data as LayoutElement;
                const target = location.current.dropTargets[0]?.element;                 
                const existLayoutElement = layoutElements.find(el => el.id === layoutElement.id);

                if (!existLayoutElement && location.current.dropTargets[0]?.element === ref.current) {
                    // TODO: update layout elements with correct order
                    pushNewLayoutElement(layoutElement);
                } 
            }
        });

        return () => cleanup();
    }, []);

    return (
        <div
            ref={ref} 
            className={twMerge(
                "mx-auto max-w-7xl p-4 min-h-64 bg-white text-slate-700 transition", 
                dragState.type === 'is-block-over' && 'bg-blue-500/80'
            )} 
        >
            {layoutElements.length === 0 && (
                <div className="h-64 grid place-items-center text-slate-600/60">
                    {dragState.type === 'idle' && <p>Drop Componnets Here</p>}
                </div>
            )}

            <LayoutPreview />
        </div>
    );
}

