'use client';

import { useRef } from 'react';
import DraggableComponent from '#/components/DraggableComponent';

import { GalleryHorizontalIcon } from 'lucide-react';

export default function ProductListComponent() {
    const ref = useRef(null);

    return (
        <DraggableComponent 
            icon={<GalleryHorizontalIcon className="pointer-events-none" />}
            type="product-list"
            text="Product List"
        />
    );
}

