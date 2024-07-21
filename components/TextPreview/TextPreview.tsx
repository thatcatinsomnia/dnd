import { useRef, useState, useEffect } from 'react';
import { cn } from '#/lib/utils';
import { useLayoutElementsStore, selectLayoutElement, setLayoutElements } from '#/stores/useLayoutElementsStore';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import DropIndicator from '#/components/DropIndicator';
import PreviewWrapper from '#/components/PreviewWrapper';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetContent } from '#/components/ui/sheet';

export type Props = {
    id: string | number;
    type: 'text',
    content: string;
};

export default function TextPreview({ id, type, content }: Props) {
    const ref = useRef<HTMLParagraphElement>(null);
    const selectedId = useLayoutElementsStore(state => state.selectedId);
    const isSelected = selectedId === id;
    const [opened, setOpened] = useState(isSelected);

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

    // useEffect(() => {
    //     setOpened(isSelected);
    // }, [isSelected]);

    return (
        <>
            <PreviewWrapper layoutId={id}>
                <p 
                    ref={ref}
                    className={cn(
                        "p-1 bg-white text-gray-700 relative", 
                        {
                            'opacity-30': dragState.type === 'is-dragging'
                        }
                    )}
                >
                    {content}
                </p>

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
                    <div>
                        content
                    </div>
                </SheetContent>
            </Sheet> 
        </>
    );
}

