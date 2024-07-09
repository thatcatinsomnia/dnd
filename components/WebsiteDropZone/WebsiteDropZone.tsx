'use client';

import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect, useRef } from 'react';
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { twMerge } from 'tailwind-merge'; import LayoutPreview from '#/components/LayoutPreview';
import { useLayoutElementsStore, pushNewLayoutElement, setLayoutElements } from '#/stores/useLayoutElementsStore';

type DragState = 
    | { type: 'idle' }
    | { type: 'is-dropzone-over' };

const idle = { type: 'idle' } as const;
const isDropzoneOver = { type: 'is-dropzone-over' } as const;

export default function WebsiteBuilder() {
    const layoutElements = useLayoutElementsStore(state => state.elements);
    const [dragState, setDragState] = useState<DragState>(idle);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current!;

        const cleanup = dropTargetForElements({
            element: element,
            onDragEnter: () => setDragState(isDropzoneOver),
            onDragLeave: () => setDragState(idle),
            onDrop: () => setDragState(idle)
        }); 

        return () => cleanup();
    }, []);

    useEffect(() => {
        // control the element drop on Dropzone
        const cleanup = monitorForElements({
            // source: the element drag
            // location the element for drop
            onDrag: ({ source, location }) => {
                
            },
            // handle drop
            // 1. remove element from original position
            // 2. move to new position
            // The `location.current` property will accurately contain the final drop targets.
            onDrop: ({ location, source }) => {
                // didn't drop on anything
                if (!location.current.dropTargets.length) {
                    return;
                }

                // the element dragging, it can be new elemnet from sidebar or exist one
                const existElementIndex = layoutElements.findIndex(el => el.id === source.data.id);
                const isNewElement = existElementIndex === -1;
                
                // NOTE: not sure if there is other way to sync data with ui
                const layoutElement = isNewElement ? (source.data as LayoutElement) : layoutElements[existElementIndex];

                // drop element on dropzone, just push to array
                if (isNewElement && location.current.dropTargets.length === 1) {
                    pushNewLayoutElement(layoutElement);
                    return;
                }

                // drop element relative to another element
                if (location.current.dropTargets.length === 2) {
                    // get first element from dropTargets, it will be the relative layoutElement
                    // second element will be dropzone, we don't care about it
                    const [destinationElement] = location.current.dropTargets;
                    
                    const indexOfTarget = layoutElements.findIndex(el => el.id === destinationElement.data.id);
                    const closestEdgeOfTarget = extractClosestEdge(destinationElement.data);

                    let indexToInsert: number; 
                     
                    // only check top & bottom for now
                    if (closestEdgeOfTarget === 'top') {
                        indexToInsert = indexOfTarget;
                    } else {
                        indexToInsert = indexOfTarget + 1;
                    }
                    
                    // drag on same position
                    if (!isNewElement && indexToInsert === existElementIndex) {
                        return;
                    } 

                    const orderedLayoutElements = [...layoutElements];

                    // reorder with exist element, remove old element in old position first
                    if (!isNewElement) {
                        orderedLayoutElements.splice(existElementIndex, 1);                    
                        
                        if (indexToInsert > existElementIndex) {
                            indexToInsert--;
                        }
                    } 

                    orderedLayoutElements.splice(indexToInsert, 0, layoutElement);
                    setLayoutElements(orderedLayoutElements);
                }
            }
        });

        return () => cleanup();
    }, [layoutElements]);

    return (
        <div
            ref={ref} 
            className={twMerge(
                "ml-72 relative mx-auto max-w-7xl p-4 min-h-64 bg-white text-slate-700 transition", 
                dragState.type === 'is-dropzone-over' && layoutElements.length === 0 && 'bg-blue-300/90'
            )} 
        >
            {layoutElements.length === 0 && (
                <div className="h-64 grid place-items-center text-slate-600/60">
                    {dragState.type === 'idle' && <p>Drop Componnets Here</p>}
                </div>
            )}

            <LayoutPreview />
        </div>
    );
}

