'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { TypeIcon } from 'lucide-react';
import DraggableComponent from '#/components/DraggableComponent';
import ComponentName from '#/components/ComponentName';

type DraggableState = {
    type: 'idle' | 'preview' | 'is-dragging';
    container?: HTMLElement;
};

function DragPreviewText() {
    return <TypeIcon className="p-2 size-10 bg-slate-800 rounded" />
}

export default function TextComponent() {
    const ref = useRef(null);
    const [dragState, setDragState] = useState<DraggableState>({ type: 'idle' });

    useEffect(() => {
        const element = ref.current!;

        const cleanup = draggable({ 
            element,

            // you can pass your custom data here, otherwise delete this function
            getInitialData: () => {
                return {
                    id: crypto.randomUUID(),
                    type: 'text',
                    children: 'Default Text'
                }; 
            },
            onGenerateDragPreview({ nativeSetDragImage }) {
                setCustomNativeDragPreview({
                    nativeSetDragImage,
                    getOffset: pointerOutsideOfPreview({
                      x: '8px',
                      y: '16px',
                    }),
                    render({ container }) {
                        setDragState({ type: 'preview', container })
                    },
                });
            },
            onDragStart: () => setDragState({ type: 'is-dragging'}),
            onDrop: () => setDragState({ type: 'idle' })
        });

        return () => cleanup();
    }, []);

    return (
        <DraggableComponent containerRef={ref}>
            <TypeIcon size={20} className="pointer-events-none" />
            <ComponentName>Text</ComponentName>
            {dragState.type === 'preview' && dragState.container && createPortal(<DragPreviewText />, dragState.container)}
        </DraggableComponent>
    );
}

