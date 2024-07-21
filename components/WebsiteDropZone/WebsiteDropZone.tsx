'use client';

import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect, useRef } from 'react';
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { useLayoutElementsStore, pushNewLayoutElement, insertNewLayoutElmement } from '#/stores/useLayoutElementsStore';
import { twMerge } from 'tailwind-merge'; import LayoutPreview from '#/components/LayoutPreview';

type DropState = 
    | { type: 'idle' }
    | { type: 'is-dropzone-over' };

const idle = { type: 'idle' } as const;
const isDropzoneOver = { type: 'is-dropzone-over' } as const;

export default function WebsiteBuilder() {
    const layoutElements = useLayoutElementsStore(state => state.elements);
    const [dropState, setDropState] = useState<DropState>(idle);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current!;

        const cleanup = dropTargetForElements({
            element: element,
            onDragEnter: () => setDropState(isDropzoneOver),
            onDragLeave: () => setDropState(idle),
            onDrop: () => setDropState(idle)
        }); 

        return () => cleanup();
    }, []);

    useEffect(() => {
        // control the element drop on Dropzone
        const cleanup = monitorForElements({
            // source: the element drag
            // location the element for drop
            onDrag: ({ source, location }) => {
                // console.log({location});
            },
            // handle drop
            // 1. remove element from original position
            // 2. move to new position
            // The `location.current` property will accurately contain the final drop targets.
            onDrop: ({ location, source }) => {
                const target = location.current.dropTargets[0];

                // didn't drop on anything
                if (!target) {
                    return;
                }

                const sourceData = source.data as LayoutElement;
                const targetData = target.data as LayoutElement;
                console.log('targetId: ', targetData.id);

                const indexOfTarget = layoutElements.findIndex(element => element.id === targetData.id);
                const indexOfExistElement = layoutElements.findIndex(el => el.id === sourceData.id);
                const isNewElement = indexOfExistElement === -1;

                // console.log('indexOfTarget:', indexOfTarget);

                // drop new component in dropzone
                if (indexOfTarget < 0 && target) {
                    pushNewLayoutElement(sourceData);
                    return;
                } 

                // insert new component to specify position
                if (indexOfTarget >= 0 && isNewElement) {
                    console.log('[insert new component at specify position]');

                    const closestEdge  = extractClosestEdge(targetData);

                    insertNewLayoutElmement({
                        element: sourceData,
                        targetIndex: closestEdge === 'bottom' ? indexOfTarget + 1 : indexOfTarget
                    });
                    return;
                }


               console.log('reorder componet'); 
                

                // if (indexOfExistElement > 0 && indexOfTarget > 0) {
                //     const closestEdge = extractClosestEdge(targetData);
                // }

                // the element dragging, it can be new elemnet from sidebar or exist one
                // const existElementIndex = layoutElements.findIndex(el => el.id === sourceData.id);
                // const isNewElement = existElementIndex === -1;
                //
                // if (isNewElement) {
                //     pushNewLayoutElement(sourceData);
                // }
                
                // NOTE: not sure if there is other way to sync data with ui
                // const layoutElement = isNewElement ? (source.data as LayoutElement) : layoutElements[existElementIndex];

                // drop element on dropzone, just push to array
                // if (isNewElement && location.current.dropTargets.length === 1) {
                    // pushNewLayoutElement(sourceData);
                    // return;
                // }

                // drop element relative to another element
                // if (location.current.dropTargets.length === 2) {
                //     // get first element from dropTargets, it will be the relative layoutElement
                //     // second element will be dropzone, we don't care about it
                //     const [destinationElement] = location.current.dropTargets;
                //     
                //     const indexOfTarget = layoutElements.findIndex(el => el.id === destinationElement.data.id);
                //     const closestEdgeOfTarget = extractClosestEdge(destinationElement.data);
                //
                //     let indexToInsert: number; 
                //      
                //     // only check top & bottom for now
                //     if (closestEdgeOfTarget === 'top') {
                //         indexToInsert = indexOfTarget;
                //     } else {
                //         indexToInsert = indexOfTarget + 1;
                //     }
                //     
                //     // drag on same position
                //     if (!isNewElement && indexToInsert === existElementIndex) {
                //         return;
                //     } 
                //
                //     const orderedLayoutElements = [...layoutElements];
                //
                //     // reorder with exist element, remove old element in old position first
                //     if (!isNewElement) {
                //         orderedLayoutElements.splice(existElementIndex, 1);                    
                //         
                //         if (indexToInsert > existElementIndex) {
                //             indexToInsert--;
                //         }
                //     } 
                //
                //     orderedLayoutElements.splice(indexToInsert, 0, layoutElement);
                //     setLayoutElements(orderedLayoutElements);
                // }
            }
        });

        return () => cleanup();
    }, [layoutElements]);

    return (
        <div
            ref={ref} 
            className={twMerge(
                "ml-72 relative mx-auto max-w-7xl p-4 min-h-64 bg-white text-slate-700 transition", 
                dropState.type === 'is-dropzone-over' && 'bg-blue-300/90'
            )} 
        >
            {layoutElements.length === 0 && (
                <div className="h-64 grid place-items-center text-slate-600/60">
                    {dropState.type === 'idle' && <p className="text-center">Drop Componnets Here</p>}
                </div>
            )}

            <LayoutPreview />
        </div>
    );
}

