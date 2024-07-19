import type { ReactNode } from 'react';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import useDraggableComponent from '#/hooks/useDraggableComponent';

type Props = {
    type: LayoutElement['type'];
    icon?: ReactNode; 
    text: string;
    preview?: ReactNode;
};

export default function DraggableComponent({ type, icon, text, preview }: Props) {
    const ref = useRef(null);
    const { dragState } = useDraggableComponent({ 
        ref,
        type
    });

    return (
        <div
            className="p-4 h-22 flex flex-col items-center gap-2 bg-slate-700 rounded cursor-grab"
            ref={ref}
        >
            {icon}
            <p className="text-sm">{text}</p>

            {dragState.type === 'preview' && dragState.container && createPortal(preview, dragState.container)}
        </div> 
    );
}
