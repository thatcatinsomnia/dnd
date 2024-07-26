"use client";

import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useState, useEffect, useRef } from 'react';
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { cn } from '#/lib/utils'; 
import { useLayoutElementsStore, pushNewLayoutElement, insertNewLayoutElmement, reorderLayoutElements } from '#/stores/useLayoutElementsStore';
import LayoutPreview from '#/components/LayoutPreview';

type DropState = 
    | { type: 'idle' }
    | { type: 'is-dropzone-over' };

const idle = { type: 'idle' } as const;
const isDropzoneOver = { type: 'is-dropzone-over' } as const;

export default function WebsiteDropzone() {
    const layoutElements = useLayoutElementsStore(state => state.elements);
    const [dropState, setDropState] = useState<DropState>(idle);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current!;

        const cleanupDropTarget = dropTargetForElements({
            element: element,
            getData: () => {
                return { type: 'dropzone' }
            },
            onDragEnter: () => setDropState(isDropzoneOver),
            onDragLeave: () => setDropState(idle),
            onDrop: () => setDropState(idle)
        }); 

        const cleanupAutoScroll = autoScrollWindowForElements();

        return () => {
            cleanupDropTarget();
            cleanupAutoScroll();
        };
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

                const indexOfTarget = layoutElements.findIndex(element => element.id === targetData.id);
                const indexOfSource = layoutElements.findIndex(element => element.id === sourceData.id);
                const isNewElement = indexOfSource === -1;

                // drop new component in dropzone
                if (isNewElement && target.data.type === 'dropzone') {
                    console.log('[push new component]')
                    pushNewLayoutElement(sourceData);
                    return;
                } 

                // insert new component to specify position
                if (indexOfTarget >= 0 && isNewElement) {
                    console.log('[insert new component at specify position]');

                    const closestEdge = extractClosestEdge(targetData);

                    insertNewLayoutElmement({
                        element: sourceData,
                        targetIndex: closestEdge === 'bottom' ? indexOfTarget + 1 : indexOfTarget
                    });
                    return;
                }

                // reorder
                if (indexOfSource >= 0 && indexOfTarget >= 0) {
                    console.log('[reorder componet]'); 

                    const closestEdge = extractClosestEdge(targetData);
                    let adjustTargetIndex;

                    if (closestEdge === 'top') {
                        adjustTargetIndex = indexOfTarget > indexOfSource ? indexOfTarget - 1 : indexOfTarget; 
                    } else {
                        adjustTargetIndex = indexOfTarget > indexOfSource ? indexOfTarget : indexOfTarget + 1;
                    }

                    reorderLayoutElements({
                        sourceIndex: indexOfSource,
                        targetIndex: adjustTargetIndex
                    });

                    return;
                }

                console.log('other case not handle...');
            }
        });

        return () => cleanup();
    }, [layoutElements]);

    return (
        <div
            ref={ref} 
            className={cn(
                "ml-72 relative mx-auto max-w-7xl p-4 min-h-64 transition bg-white shadow-sm", 
                {
                    'bg-blue-200': dropState.type === 'is-dropzone-over'
                }
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

