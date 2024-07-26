import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useRef } from 'react';
import { cn } from '#/lib/utils';
import { SnailIcon } from 'lucide-react';
import { selectLayoutElement, useLayoutElementsStore, updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import DropIndicator from '#/components/DropIndicator';
import PreviewWrapper from '#/components/PreviewWrapper';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from '#/components/ui/sheet';
import { Label } from '#/components/ui/label';
import { Button } from '#/components/ui/button';
import { Textarea } from '#/components/ui/textarea';

// TODO: set content to correct type
export type Props = Extract<LayoutElement, { type: 'product-list' }>;

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

    return (
        <>
            <PreviewWrapper layoutId={id}>
                <div 
                    ref={ref}
                    className={cn(
                        "py-4 flex gap-4 overflow-y-hidden",
                        {
                            'opacity-30': dragState.type === 'is-dragging'
                        }
                    )}
                >
                    {products.map(p => (
                        <div key={p.id} className="w-48 flex-shrink-0 text-gray-600 bg-white border border-slate-200 shadow-sm rounded overflow-hidden">
                            <div className="w-full size-48 grid place-items-center bg-slate-700/50">
                                <SnailIcon className="text-gray-300 size-8" />
                            </div>
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

            <Sheet
                open={isSelected}
                onOpenChange={handleOpenChange}
            >
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Product List Component</SheetTitle>
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

