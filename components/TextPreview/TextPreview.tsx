import type { FocusEvent } from 'react';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import useDraggableLayout from '#/hooks/useDraggableLayout';
import DropIndicator from '#/components/DropIndicator';
import PreviewWrapper from '#/components/PreviewWrapper';

export type Props = {
    id: string;
    content: string;
};

export default function TextPreview({ id, content }: Props) {
    const ref = useRef<HTMLParagraphElement>(null);
    const { dragState }  = useDraggableLayout({
        ref,
        data: { id, content }
    });

    const handleContentChange = (e: FocusEvent<HTMLParagraphElement>) => {
        const element = ref.current!;
        updateLayoutElementById(id, { content: element.innerText });
    };

    return (
        <PreviewWrapper>
            <p 
                ref={ref}
                className={twMerge(
                    "p-1 bg-white text-gray-700 relative", 
                    dragState.type === 'is-dragging' && 'opacity-30'
                )}
                onBlur={handleContentChange}
                contentEditable 
                suppressContentEditableWarning
            >
                {content}
            </p>

            {dragState.type === 'is-dragging-over' && dragState.closestEdge && (
                <DropIndicator edge={dragState.closestEdge} />
            )}
        </PreviewWrapper>
    );
}

