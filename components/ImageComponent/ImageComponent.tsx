"use client";

import DraggableComponent from '#/components/DraggableComponent';
import { ImageIcon } from 'lucide-react';

function DragPreviewImage() {
    return <ImageIcon className="p-2 size-10 bg-[--bg-sidebar-component] rounded" />
}

export default function ImageComponent() {
    return (
        <DraggableComponent
            type="image"
            text="Image"
            icon={<ImageIcon className="pointer-events-none" />}
            preview={<DragPreviewImage />}
        />
    );
}

