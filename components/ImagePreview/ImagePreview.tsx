import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useRef } from 'react';
import { useLayoutElementsStore, selectLayoutElement, updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import ImagePrimitive from '#/components/ImagePrimitive';
import { Label } from '#/components/ui/label';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent } from '#/components/ui/sheet';
import PreviewWrapper from '#/components/PreviewWrapper';
import DropIndicator from '#/components/DropIndicator';

type Props = Extract<LayoutElement, { type: 'image' }>;

export default function ImagePreview({ id, type, content }: Props) {
    const { src, alt } = content;

    const selectedId = useLayoutElementsStore(state => state.selectedId);
    const isSelected = selectedId === id;

    const ref = useRef<HTMLDivElement>(null);
    const srcInputRef = useRef<HTMLInputElement>(null);
    const altInputRef = useRef<HTMLInputElement>(null);

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
        const srcInput = srcInputRef.current;
        const altInput = altInputRef.current;

        if (!srcInput || !altInput) {
            return;
        }

        updateLayoutElementById(id, { src: srcInput.value, alt: altInput.value });
        selectLayoutElement(null);
    };

    return (
        <>
            <PreviewWrapper 
                layoutId={id} 
                ref={ref}
                className={dragState.type === 'is-dragging' ? 'opacity-30' : ''}
            >
                <ImagePrimitive src={content.src} alt={content.alt} />

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
                            <Label className="block mb-1.5" htmlFor="image-src">Image Src</Label>
                            <Input id="image-src" defaultValue={src} ref={srcInputRef} />
                        </div>

                        <div>
                            <Label className="block mb-1.5" htmlFor="image-alt">Image Alt</Label>
                            <Input id="image-alt" defaultValue={alt} ref={altInputRef} />
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
