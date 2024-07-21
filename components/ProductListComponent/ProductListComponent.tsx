'use client';

import DraggableComponent from '#/components/DraggableComponent';
import { GalleryHorizontalIcon } from 'lucide-react';

export default function ProductListComponent() {
    return (
        <DraggableComponent 
            icon={<GalleryHorizontalIcon className="pointer-events-none" />}
            type="product-list"
            text="Product List"
        />
    );
}

