import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useRef } from 'react';
import Image from 'next/image';
import { cn } from '#/lib/utils';
import { useLayoutElementsStore, selectLayoutElement, updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from '#/components/ui/sheet';
import { Label } from '#/components/ui/label';
import { Button } from '#/components/ui/button';
import { Textarea } from '#/components/ui/textarea';
import { AspectRatio } from '#/components/ui/aspect-ratio';
import PreviewWrapper from '#/components/PreviewWrapper';
import DropIndicator from '#/components/DropIndicator';
import placeholderImage from '/public/placeholder.svg';

type Props = Extract<LayoutElement, { type: 'featured-products' }>;
type ProductData = ReturnType<typeof generateProducts>[number];

function generateProducts(content: Props['content']) {
    if (content.length === 0) {
        return Array.from({ length: 5 }).map((_, i) => ({
            id: `product-${i}`,
            name: i === 0 ? `Featured Product` : `Product-${i}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque a, maiores quidem similique ipsam quasi! Alias eos dolorum vitae sapiente eveniet in architecto numquam id',
            image: placeholderImage,
            price: i === 0 ? 9999 : 999
        }));
    }

    return content.map(p => ({
        id: p.id,
        name: p.id,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque a, maiores quidem similique ipsam quasi! Alias eos dolorum vitae sapiente eveniet in architecto numquam id',
        image: placeholderImage,
        price: 999
    }));
}

function ProductPreview({ 
    product,
    isFeatured = false,
    className
}: { 
    product: ProductData;
    isFeatured?: boolean;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col border border-gray-300 rounded shadow-sm overflow-hidden", className)}>
            <AspectRatio>
                <Image 
                    className="object-cover pointer-events-none"
                    src={placeholderImage}
                    alt="product-4 placeholder" 
                />
            </AspectRatio>

            <div className="p-2 flex-1 flex flex-col justify-between bg-white">
                <h3 className="mb-4 text-gray-600 font-bold text-lg">{product.name}</h3>
                {isFeatured && (
                    <p className="mb-4 text-gray-500">{product.description}</p>
                )}
                <span className="mt-auto text-red-500 text-xl">
                    <small className="text-sm">$</small>
                    {product.price}
                </span>
            </div>
        </div>
    );
}

export default function FeaturedProductPreview({ id, type, content }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const selectedId = useLayoutElementsStore(state => state.selectedId);
    const isSelected = selectedId === id;

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
        data: { 
            id, 
            type, 
            content 
        }
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            selectLayoutElement(null);
        }
    };
    
    const handleContentSave = () => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        };

        const delimiters = /[:;,|\s+]/;
        const listOfIdString = textarea.value.split(delimiters).map(str => str.trim()).filter(Boolean);
        const productIdData = listOfIdString.map(id => ({ id }));

        updateLayoutElementById(id, productIdData);
        selectLayoutElement(null);

    };

    const products = generateProducts(content);
    const featured = products[0];
    const otherProducts = products.slice(1, 5); // ignore other products after fifth 

    return (
        <>
            <PreviewWrapper layoutId={id}>
                <div 
                    className={cn(
                        "py-2 grid grid-cols-8 grid-rows-2 gap-6",
                        {
                            'opacity-30': dragState.type === 'is-dragging'
                        }
                    )}
                    ref={ref}
                >
                    <ProductPreview
                        className="col-span-4 row-span-2"
                        product={featured} 
                        isFeatured 
                    />

                    {otherProducts.map(p => (
                        <ProductPreview 
                            key={p.id} 
                            className="col-span-2 bg-blue-500"
                            product={p}
                        />
                    ))}
                </div>

                {dropState.type === 'is-dragging-over' && dropState.closestEdge && (
                    <DropIndicator edge={dropState.closestEdge} />
                )}
            </PreviewWrapper>
            <Sheet
                open={isSelected}
                onOpenChange={handleOpenChange}
            >
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Featured Products Component</SheetTitle>
                        <SheetDescription>make changes to your text component here. click save when you&apos;re done.</SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-6 grid gap-8">
                        <div>
                            <Label className="block mb-1.5">ID:</Label>
                            <p className="text-sm text-slate-200">{id}</p>
                        </div>

                        <div>
                            <Label className="block mb-1.5" htmlFor="content">Product Id List</Label>
                            <Textarea 
                                id="content"
                                className="min-h-[140px]" 
                                defaultValue={content.map(data => data.id).join(', ')}
                                ref={textareaRef}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-6">
                        <Button onClick={handleContentSave}>Save</Button>
                    </div>
                </SheetContent>
            </Sheet> 
        </>
    );
}

