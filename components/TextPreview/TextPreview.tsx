import type { ReactNode, FocusEvent } from 'react';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { updateLayoutElementById } from '#/stores/useLayoutElementsStore';
import DropIndicator from '#/components/DropIndicator';

type DragState = 
    | { type: 'idle' }
    | { type: 'preview', container: HTMLElement }
    | { type: 'is-dragging' }
    | { type: 'is-dragging-over', closestEdge: Edge | null };

const idle = { type: 'idle' } as const;

export default function TextPreview({ id, children }: {
    id: string;
    children: ReactNode;
}) {
    const [dragState, setDragState] = useState<DragState>(idle);
    const ref = useRef<HTMLParagraphElement>(null);

    const handleContentChange = (e: FocusEvent<HTMLParagraphElement>) => {
        const element = ref.current!;
        updateLayoutElementById(id, element.innerText);
    };

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            throw new Error('element not found !!!')
        }

        const cleanupDraggable = draggable({ 
            element,

            getInitialData: (data) => {
                return { type: 'text', id: id };
            },
            // you can pass your custom data here, otherwise delete this function
            // getInitialData: () => {
            //     return {
            //         id: crypto.randomUUID(),
            //         type: 'text',
            //         children: 'Default Text'
            //     }; 
            // },
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
                return attachClosestEdge({}, { input, element, allowedEdges: ['top', 'bottom'] })
            },

            // prevent drop on self
            canDrop: ({ source }) => {
                return source.data.id === id ? false : true;
            },

             // fired when this drop target is entered into
            onDragEnter: ({ self }) => {
                const closestEdge = extractClosestEdge(self.data);
                setDragState({ type: 'is-dragging-over', closestEdge: closestEdge });
            },

            // A throttled update of where the the user is currently dragging.
            onDrag: ({ self }) => {
                const closestEdge = extractClosestEdge(self.data);

                setDragState(current => {
                    if (current.type === 'is-dragging-over' && current.closestEdge === closestEdge) {
                        return current;
                    }

                    return { type: 'is-dragging-over', closestEdge };
                })  
            },

            onDragLeave: () => {
                setDragState(idle);
            },

            onDrop: () => {
                setDragState(idle);
            }
        });

        return () => {
            cleanupDraggable();
            cleaupDropTargetForElements();
        };
    }, []);

    return (
        <div className="relative">
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
                {children}
            </p>

            {dragState.type === 'is-dragging-over' && dragState.closestEdge && (
                <DropIndicator edge={dragState.closestEdge} />
            )}
        </div>
    );
}

