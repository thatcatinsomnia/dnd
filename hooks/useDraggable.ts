import type { MutableRefObject } from 'react';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';

type DragState = 
    | { type: 'idle' }
    | { type: 'preview', container: HTMLElement }
    | { type: 'is-dragging' };

export default function useDraggable({ 
    ref, 
    data = {} as LayoutElement 
}: {
    ref: MutableRefObject<HTMLElement | null>;
    data?: LayoutElement
}) {
    const [dragState, setDragState] = useState<DragState>({ type: 'idle' });

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            throw new Error('element not found !!!')
        }

        const cleanup = draggable({ 
            element,
            getInitialData: () => {
                return data;
            },
            canDrag: () => {
                if (data.type === 'box') {
                    console.log('block drag');
                    
                    return false;
                }

                return true;
            },
            onGenerateDragPreview({ nativeSetDragImage }) {
                setCustomNativeDragPreview({
                    nativeSetDragImage,
                    getOffset: pointerOutsideOfPreview({
                      x: '8px',
                      y: '16px',
                    }),
                    render({ container }) {
                        setDragState({ type: 'preview', container })
                    }
                });
            },
            onDragStart: () => setDragState({ type: 'is-dragging'}),
            onDrop: () => setDragState({ type: 'idle' })
        });

        return cleanup;
    }, []);

    return { dragState };
}

