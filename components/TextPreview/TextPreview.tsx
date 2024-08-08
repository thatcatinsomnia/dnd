import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useRef } from 'react';
import { useLayoutElementsStore, selectLayoutElement, updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import DropIndicator from '#/components/DropIndicator';
import PreviewWrapper from '#/components/PreviewWrapper';
import TextPrimitive from '#/components/TextPrimitive';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent } from '#/components/ui/sheet';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { Button } from '#/components/ui/button';

type Props = Extract<LayoutElement, { type: 'text' }>;

export default function TextPreview({ id, type, content }: Props) {
    const ref = useRef<HTMLParagraphElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
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
        if(!open) {
            selectLayoutElement(null);
        } 
    };

    const handleContentSave = () => {
        const input = inputRef.current;

        if (!input) {
            return;
        }

        updateLayoutElementById(id, input.value || 'Default Text');
        selectLayoutElement(null);
    };

    return (
        <>
            <PreviewWrapper 
              layoutId={id} ref={ref}
              className={dragState.type === 'is-dragging' ? 'opacity-30' : ''}
            >
                <TextPrimitive content={content} />

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
                        <SheetTitle>Edit Text Component</SheetTitle>
                        <SheetDescription>make changes to your text component here. click save when you&apos;re done.</SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-6 grid gap-8">
                        <div>
                            <Label className="block mb-1.5">ID:</Label>
                            <p className="text-sm text-slate-200">{id}</p>
                        </div>

                        <div>
                            <Label className="block mb-1.5" htmlFor="content">Content</Label>
                            <Input id="content" defaultValue={content} ref={inputRef} autoComplete="off" />
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
