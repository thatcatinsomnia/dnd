'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { TypeIcon } from 'lucide-react';
import DraggableComponent from '#/components/DraggableComponent';
import ComponentName from '#/components/ComponentName';
import useDraggableComponent from '#/hooks/useDraggableComponent';

function DragPreviewText() {
    return <TypeIcon className="p-2 size-10 bg-slate-800 rounded" />
}

export default function TextComponent() {
    const ref = useRef(null);
    const dragState = useDraggableComponent({ 
        ref,
        type: 'text'
    });

    return (
        <DraggableComponent containerRef={ref}>
            <TypeIcon size={20} className="pointer-events-none" />
            <ComponentName>Text</ComponentName>
            {dragState.type === 'preview' && dragState.container && createPortal(<DragPreviewText />, dragState.container)}
        </DraggableComponent>
    );
}

