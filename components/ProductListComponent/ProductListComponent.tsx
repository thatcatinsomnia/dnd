"use client";

import DraggableComponent from '#/components/DraggableComponent';
import { GalleryHorizontalIcon } from 'lucide-react';

function DragPreviewProductList() {
    return <GalleryHorizontalIcon className="p-2 size-10 bg-[--bg-sidebar-component] rounded" />
}

export default function ProductListComponent() {
    return (
        <DraggableComponent 
            icon={<GalleryHorizontalIcon className="pointer-events-none" />}
            type="product-list"
            text="Product List"
            preview={<DragPreviewProductList />}
        />
    );
}

