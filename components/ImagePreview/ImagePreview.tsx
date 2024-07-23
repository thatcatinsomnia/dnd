import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useRef } from 'react';
import Image from 'next/image';
import { cn } from '#/lib/utils';
import { useLayoutElementsStore, selectLayoutElement, updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import { Label } from '#/components/ui/label';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent } from '#/components/ui/sheet';
import { AspectRatio } from '#/components/ui/aspect-ratio';
import PreviewWrapper from '#/components/PreviewWrapper';
import DropIndicator from '#/components/DropIndicator';

type Props = Extract<LayoutElement, { type: 'image' }>;

export default function ImagePreview({ id, type, content }: Props) {
    const { src, alt } = content;
    const hasSource = src.length > 0;
    const hasAltText = alt.length > 0;
    
    const selectedId = useLayoutElementsStore(state => state.selectedId);
    const isSelected = selectedId === id;

    const ref = useRef<HTMLDivElement>(null);
    const srcInputRef = useRef<HTMLInputElement>(null);
    const altInputRef = useRef<HTMLInputElement>(null);

    const data = { id, type, content };

    const { dragState } = useDraggable({
        ref,
        initialData: data
    });

    const { dropState } = useDropTarget({
        ref,
        data 
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
            <PreviewWrapper layoutId={id}>
                <AspectRatio 
                    ratio={16 / 9} 
                    ref={ref}
                    className={cn(
                        {
                            'opacity-30': dragState.type === 'is-dragging'
                        }
                    )}
                >
                    <Image 
                        className="object-cover rounded pointer-events-none"
                        src={hasSource ? src : '/placeholder.svg'} 
                        alt={hasAltText ? alt : 'image placeholder'} 
                        fill
                    />
                </AspectRatio>

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
                        <SheetDescription>make changes to your text component here. click save when you're done.</SheetDescription>
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

