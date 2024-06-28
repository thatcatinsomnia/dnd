import type { MutableRefObject } from 'react';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { useState, useEffect } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

type DraggableState = { 
    type: 'is-dragging-over' | 'preview' | 'is-dragging' | 'idle', 
    container?: HTMLElement, 
    closestEdge?: Edge | null
}; 

const idle = { type: 'idle' } as const;

const useDraggable = ({ 
    data = {},
    ref
}: { 
    data?: Record<string, any>;
    ref: MutableRefObject<HTMLElement | null>;
}) => {
    const [state, setState] = useState<DraggableState>(idle);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    useEffect(() => {
        const element = ref.current!;

        const cleanup = dropTargetForElements({
            element,

            // attatch data to closeEdge 
            // input is mouse position maybe...
            getData: ({ input }) => {
                return attachClosestEdge(data, {element, input, allowedEdges: ['top', 'bottom']});
            },

            // continus trigger when drag inside area
            // this make drag to closest edge smooth
            onDrag: ({ self }) => {
                const edge = extractClosestEdge(self.data);

                if (!state) {
                    return;
                }
                
                if (state.type === 'is-dragging-over' && closestEdge === edge) {
                    return;
                }

                setState({ type: 'is-dragging-over' });
                setClosestEdge(edge);
            },

            // trigger once element enter 
            onDragEnter: ({ self }) => {
                console.log('on drag enter')
                const edge = extractClosestEdge(self.data);
                setClosestEdge(edge);
                setState({ type: 'is-dragging-over' });
            },

            // invoke when leave avaliable area
            onDragLeave: () => {
                 console.log('on drag leave');
                 setState(idle);
            },

            // invoke when drop on avaliable position
            onDrop: () => {
                console.log('on drop');
                //set your layout
                setState(idle);
            }
        });

        return () => {
            cleanup();
        };
    }, []);

    return {
        state,
        closestEdge
    }
};

export default useDraggable;

