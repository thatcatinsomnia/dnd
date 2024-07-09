import type { RefObject } from 'react';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/closest-edge';
import type { AvailableComponentType } from '#/helper/componentRegistry';
import { useState, useEffect } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';

type DraggableState = 
    | { type: 'idle' }
    | { type: 'preview', container: HTMLElement }
    | { type: 'is-dragging', closestEdge?: Edge | null };

type PxString = `${number}px`;

type Params = {
    ref: RefObject<HTMLDivElement> | undefined;
    type: AvailableComponentType;
    previewOffset?: { x: PxString, y: PxString };
};

const idle = { type: 'idle' } as const;

function generateInitialData(type: AvailableComponentType) {
    if (type === 'column') {
        return {
            id: crypto.randomUUID(),
            type: 'column',
            columns: 2,
            content: [{ id: crypto.randomUUID(), type: 'box' }, { id: crypto.randomUUID(), type: 'box' }]
        };
    }

    if (type === 'text') {
        return {
            id: crypto.randomUUID(),
            type: 'text',
            content: 'Default Text'
        };
    }

    throw Error('unhandle compoennt type when generate initial data');
}

const useDraggableComponent = ({ 
    ref, 
    type,
    previewOffset = { x: '8px', y: '16px' } 
}: Params) => {
    const [dragState, setDragState] = useState<DraggableState>(idle);

    useEffect(() => {
        const element = ref?.current;

        if (!element) {
            throw Error('useDraggableComponent must provide ref');
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

    return dragState;
};

export default useDraggableComponent;

