"use client";

import DraggableComponent from '#/components/DraggableComponent';
import { LayoutDashboardIcon } from 'lucide-react';

export default function FeaturedProductsComponent() {
    return (
        <DraggableComponent
            type="featured-products"
            text="Featured Products"
            icon={<LayoutDashboardIcon />}
        />
    );
}

