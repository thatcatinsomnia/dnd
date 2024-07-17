import type { FocusEvent } from 'react';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import DropIndicator from '#/components/DropIndicator';
import PreviewWrapper from '#/components/PreviewWrapper';

export type Props = {
    id: string;
    content: string;
};

export default function TextPreview({ id, content }: Props) {
    const ref = useRef<HTMLParagraphElement>(null);
    const { dragState } = useDraggable({
        ref,
        data: { 
            id,
            type: 'text',
            content 
        }
    });

    const { dropState } = useDropTarget({
        ref,
        data: { 
            id, 
            type: 'text',
            content 
        }
    });

    const handleContentChange = () => {
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
                {id}
            </p>

            {dropState.type === 'is-dragging-over' && dropState.closestEdge && (
                <DropIndicator edge={dropState.closestEdge} />
            )}
        </PreviewWrapper>
    );
}

