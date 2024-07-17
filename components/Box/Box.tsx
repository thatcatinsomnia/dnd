import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import useDropTarget from '#/hooks/useDropTarget';

type Props = {
    id: string;
    content: LayoutElement[];
};

export default function ({ id, content }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const { dropState } = useDropTarget({
        ref,
        data: {
            id,
            type: 'box',
            content
        }
    });

    return (
        <div className="relative after:content-[''] after:absolute after:inset-0 after:border after:border-transparent after:pointer-events-none after:border-blue-600">
            <div 
                ref={ref}
                className={twMerge(
                    "h-44 flex items-center justify-center",
                    dropState.type === 'is-dragging-over' && 'bg-blue-200'
                )}
            >
                <div className="flex flex-col">
                    {/* <button className="py-2 bg-blue-500 text-white rounded">Add</button> */}
                    {id.split('-').at(0)}
                </div>
            </div>
        </div>
    );
}

