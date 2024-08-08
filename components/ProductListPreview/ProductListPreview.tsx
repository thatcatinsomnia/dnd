import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useRef } from 'react';
import { selectLayoutElement, useLayoutElementsStore, updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import DropIndicator from '#/components/DropIndicator';
import PreviewWrapper from '#/components/PreviewWrapper';
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetDescription } from '#/components/ui/sheet';
import { Label } from '#/components/ui/label';
import { Button } from '#/components/ui/button';
import { Textarea } from '#/components/ui/textarea';
import ProductListPrimitive from '../ProductListPrimitive';

// ? how to set correct type 
export type Props = Extract<LayoutElement, { type: 'product-list' }>;

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

    return (
        <>
            <PreviewWrapper 
                ref={ref}
                layoutId={id}
                className={dragState.type === 'is-dragging' ? 'opacity-30' : ''}
            >
                <ProductListPrimitive content={content} />

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
