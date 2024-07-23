'use client';

import { TypeIcon } from 'lucide-react';
import DraggableComponent from '#/components/DraggableComponent';

function DragPreviewText() {
    return <TypeIcon className="p-2 size-10 bg-[--bg-sidebar-component] rounded" />
}

export default function TextComponent() {
    return (
        <DraggableComponent 
            type="text"
            icon={<TypeIcon className="pointer-events-none" />}
            text="Text"
            preview={<DragPreviewText />}
        />
    );
}

