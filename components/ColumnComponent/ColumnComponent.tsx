'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import DraggableComponent from '#/components/DraggableComponent';
import { ColumnsIcon } from 'lucide-react';
import ComponentName from '#/components/ComponentName';
import useDraggableComponent from '#/hooks/useDraggableComponent';

function DragPreviewColumn() {
    return <ColumnsIcon className="p-2 size-10 bg-slate-800 rounded" />
}

export default function ColumnComponent() {
    const ref = useRef(null);
    const dragState = useDraggableComponent({
        ref,
        type: 'column'
    });

    return (
        <DraggableComponent containerRef={ref}>
            <ColumnsIcon size={20} className="pointer-events-none" />
            <ComponentName>Column</ComponentName>
            {dragState.type === 'preview' && dragState.container && createPortal(<DragPreviewColumn />, dragState.container)}
        </DraggableComponent>
    );
}

