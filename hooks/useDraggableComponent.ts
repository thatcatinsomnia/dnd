import type { RefObject } from 'react';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';

type DraggableState = 
    | { type: 'idle' }
    | { type: 'preview', container: HTMLElement }
    | { type: 'is-dragging' };

type PxString = `${number}px`;

type Params = {
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
            content: id.split('-')[0]
        }
    }

    if (type === 'product-list') {
        return {
            id,
            type,
            content: [
            ]
        };
    }

    throw Error(`unhandle component type "${type}" when generate initial data`);
}

const useDraggableComponent = ({ 
    ref, 
    type,
    previewOffset = { x: '8px', y: '16px' } 
}: Params) => {
    const [dragState, setDragState] = useState<DraggableState>({ type: 'idle' });

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

    return { dragState };
};

export default useDraggableComponent;

