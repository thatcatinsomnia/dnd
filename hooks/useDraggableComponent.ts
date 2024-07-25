import type { RefObject } from 'react';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';

type DraggableState = 
    | { type: 'idle' }
    | { type: 'preview', container: HTMLElement }
    | { type: 'is-dragging' };

type PxString = `${number}px`;

type Args = {
    ref: RefObject<HTMLDivElement> | undefined;
    type: LayoutElement['type'];
    previewOffset?: { x: PxString, y: PxString };
};

function generateInitialData(type: LayoutElement['type']): LayoutElement {
    const id = crypto.randomUUID();

    if (type === 'text') {
        return {
            id: id,
            type,
            content: 'Default Text'
        }
    }

    if (type === 'product-list') {
        return {
            id,
            type,
            content: []
        };
    }

    if (type === 'image') {
        return {
            id,
            type,
            content: {
                src: '',
                alt: ''
            }
        }
    }

    if (type === 'featured-products') {
        return {
            id,
            type,
            content: []
        };
    }

    const errorMessage = `unhandle component initial data: "${type}"`;
    toast.error(errorMessage);
    throw new Error(errorMessage);
}

const useDraggableComponent = ({ 
    ref, 
    type,
    previewOffset = { x: '8px', y: '16px' } 
}: Args) => {
    const [dragState, setDragState] = useState<DraggableState>({ type: 'idle' });

    useEffect(() => {
        const element = ref?.current;

        if (!element) {
            const errorMessage = 'useDraggableComponent must provide ref';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }

        const cleanup = draggable({ 
            element,
            getInitialData: () => {
                return generateInitialData(type);   
            },
            onGenerateDragPreview({ nativeSetDragImage }) {
                setCustomNativeDragPreview({
                    nativeSetDragImage,
                    getOffset: pointerOutsideOfPreview({
                      x: previewOffset.x,
                      y: previewOffset.y,
                    }),
                    render({ container }) {
                        setDragState({ type: 'preview', container })
                    },
                });
            },
            onDragStart: () => setDragState({ type: 'is-dragging'}),
            onDrop: () => setDragState({ type: 'idle' })
        });

        return () => cleanup();
    }, []);

    return { dragState };
};

export default useDraggableComponent;

