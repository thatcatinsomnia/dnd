import type { MutableRefObject } from 'react';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

type DropState = 
    | { type: 'idle' }
    | { type: 'is-dragging-over', closestEdge: Edge | null };

export default function useDropTarget({
    ref,
    data = {} as LayoutElement
}: { 
    ref: MutableRefObject<HTMLElement | null>;
    data: LayoutElement; // passing data, so we can extract data from LayoutElementsStore
}) {
    const [dropState, setDropState] = useState<DropState>({ type: 'idle' });

    useEffect(() => {
        const element = ref.current;
        
        if (!element) {
            const errorMessage = 'element not found !!';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }

        const cleanup = dropTargetForElements({
            element,

            // return the object data you want to attach to drop target
            getData: ({ input, source, element }) => {
                return attachClosestEdge(data, { input, element, allowedEdges: ['top', 'bottom'] })
            },

            // prevent drop on self
            canDrop: ({ source }) => {
                return source.data.id === data.id ? false : true;
            },

             // fired when this drop target is entered into
            onDragEnter: ({ location, source, self }) => {
                const closestEdge = extractClosestEdge(self.data);

                setDropState({ type: 'is-dragging-over', closestEdge: closestEdge });
            },

            // A throttled update of where the the user is currently dragging.
            onDrag: ({ location, source, self }) => {
                const closestEdge = extractClosestEdge(self.data);

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

