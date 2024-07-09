import type { MutableRefObject } from 'react';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { DragLocationHistory, DropTargetRecord, DropTargetGetFeedbackArgs, AllDragTypes } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { useState, useEffect } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';

type DragState = 
    | { type: 'idle' }
    | { type: 'preview', container: HTMLElement }
    | { type: 'is-dragging' }
    | { type: 'is-dragging-over', closestEdge: Edge | null };

const idle = { type: 'idle' } as const;

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

const useDraggableLayout = ({ 
    ref,
    data = {}
}: { 
    ref: MutableRefObject<HTMLElement | null>;
    data?: Record<string, any>;
}) => {
    const [dragState, setDragState] = useState<DragState>(idle);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            throw new Error('element not found !!!')
        }

        const cleanupDraggable = draggable({ 
            element,
            getInitialData: () => {
                return data;
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
            onDrop: () => setDragState(idle)
        });

        const cleaupDropTargetForElements = dropTargetForElements({
            element,

            // return the object data you want to attach to drop target
            getData: ({ input, element }) => {
                return attachClosestEdge(data, { input, element, allowedEdges: ['top', 'bottom'] })
            },

            // prevent drop on self
            canDrop: ({ source }) => {
                return source.data.id === data.id ? false : true;
            },

             // fired when this drop target is entered into
            onDragEnter: ({ location, source, self }) => {
                const closestEdge = calculateClosestEdge({ location, self });

                setDragState({ type: 'is-dragging-over', closestEdge: closestEdge });
            },

            // A throttled update of where the the user is currently dragging.
            onDrag: ({ location, source, self }) => {
                const closestEdge = calculateClosestEdge({ location, self });

                setDragState(current => {
                    if (current.type === 'is-dragging-over' && current.closestEdge === closestEdge) {
                        return current;
                    }

                    return { type: 'is-dragging-over', closestEdge };
                })  
            },
            onDragLeave: () => setDragState(idle),
            onDrop: () => setDragState(idle)
        });

        return () => {
            cleanupDraggable();
            cleaupDropTargetForElements();
        };
    }, []);

    return {
        dragState,
        closestEdge
    };
};

export default useDraggableLayout

