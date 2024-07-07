import type { ReactNode, RefObject } from 'react';

export default function DraggableComponent({ children, containerRef }: { 
    children: ReactNode;
    containerRef?: RefObject<HTMLDivElement>; 
}) {
    return (
        <div
            className="p-4 h-22 flex flex-col items-center gap-2 bg-slate-700 rounded cursor-grab"
            ref={containerRef}
        >
            {children}
        </div> 
    );
}
