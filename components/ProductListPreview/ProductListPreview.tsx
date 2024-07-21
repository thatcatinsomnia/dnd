import { useRef } from 'react';
import { cn } from '#/lib/utils';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import DropIndicator from '#/components/DropIndicator';
import PreviewWrapper from '#/components/PreviewWrapper';

type Product = {
    id: string;
};

// TODO: set content to correct type
export type Props = {
    id: string | number;
    type: 'product-list';
    content: Array<Product>; 
};

const PRODUCT_TEMP_SIZE = 10;

function generateProducts(content: Props['content']) {
    if (content.length === 0) {
        return Array.from({ length: PRODUCT_TEMP_SIZE }).map((_, i) => ({
            id: `product-${i + 1}`,
            name: `Product-${i + 1}`,
            image: '/product-placeholder.svg',
            price: 999
        }));
    }

    return content.map(p => ({
        id: p.id,
        name: p.id,
        image: '/product-placeholder.svg',
        price: 999
    }));
}

export default function ProductListPreview({ id, type, content }: Props) {
    const ref = useRef(null);
    const { dragState } = useDraggable({
        ref,
        initialData: {
            id,
            type,
            content
        }
    });

    const { dropState } = useDropTarget({
        ref,
        data: { id: 'test', type, content }
    });

    const products = generateProducts(content);

    return (
        <PreviewWrapper layoutId={id}>
            <div 
                ref={ref}
                className={cn(
                    "p-4 mb-6 flex gap-4 overflow-y-auto",
                    {
                        'opacity-30': dragState.type === 'is-dragging'
                    }
                )}
            >
                {products.map(p => (
                    <div key={p.id} className="w-48 flex-shrink-0 text-slate-600 border shadow-sm rounded overflow-hidden">
                        <img 
                            src={p.image}
                            className="object-cover rounded pointer-events-none"
                        /> 
                        <div className="p-2">
                            <h3 className="pb-4 text-lg font-bold">{p.name}</h3>
                            <span className="text-lg text-red-500">${p.price}</span>
                        </div>
                    </div>
                ))}
            </div>

            {dropState.type === 'is-dragging-over' && dropState.closestEdge && (
                <DropIndicator edge={dropState.closestEdge} />
            )}
        </PreviewWrapper>
    );
}

