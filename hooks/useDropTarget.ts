import { MutableRefObject } from 'react';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { DragLocationHistory, DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

type DropState = 
    | { type: 'idle' }
    | { type: 'is-dragging-over', closestEdge: Edge | null };

// check if we are drop element on box, if so, do not extract closest edge
function calculateClosestEdge({ location, self }: { 
    location: DragLocationHistory,
    self: DropTargetRecord
}) {
    const [destination] = location.current.dropTargets;

    if (destination.data.type === 'box') {
        return null;
    }

    return extractClosestEdge(self.data); 
}

export default function useDropTarget({
    ref,
    data = {} as LayoutElement
}: { 
    ref: MutableRefObject<HTMLElement | null>;
    data?: LayoutElement;
}) {
    const [dropState, setDropState] = useState<DropState>({ type: 'idle' });

    useEffect(() => {
        const element = ref.current;
        
        if (!element) {
            throw new Error('element not found!!');
        }

        const cleanup = dropTargetForElements({
            element,

            // return the object data you want to attach to drop target
            getData: ({ input, element }) => {
                return attachClosestEdge(data, { input, element, allowedEdges: ['top', 'bottom'] })
            },

            // prevent drop on self
            canDrop: ({ source }) => {
                if (source.data.id === data.id) {
                    return false;
                }

                // column can't drop in to aonother column
                if (source.data.type === 'column' && data.type === 'column') {
                    console.log('column can not drop in column');
                    return false;
                }

                return true;
            },

             // fired when this drop target is entered into
            onDragEnter: ({ location, source, self }) => {
                const closestEdge = calculateClosestEdge({ location, self });

                setDropState({ type: 'is-dragging-over', closestEdge: closestEdge });
            },

            // A throttled update of where the the user is currently dragging.
            onDrag: ({ location, source, self }) => {
                const closestEdge = calculateClosestEdge({ location, self });

                setDropState(current => {
                    if (current.type === 'is-dragging-over' && current.closestEdge === closestEdge) {
                        return current;
                    }

                    return { type: 'is-dragging-over', closestEdge };

                })  
            },
            onDragLeave: () => setDropState({ type: 'idle' }),
            onDrop: () => setDropState({ type: 'idle' })
        });

        return cleanup;
    }, []);

    return { dropState };
}
