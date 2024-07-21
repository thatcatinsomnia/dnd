import type { ReactNode } from 'react';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { cn } from '#/lib/utils';
import { selectLayoutElement, useLayoutElementsStore } from '#/stores/useLayoutElementsStore';

export default function PreviewWrapper({ children, layoutId }: {
    children: ReactNode;
    layoutId: LayoutElement['id'];
}) {
    const selectedId = useLayoutElementsStore(state => state.selectedId);
    const isSelected = selectedId === layoutId;

    const handleClick = () => {
       selectLayoutElement(layoutId); 
    };

    return (
        <div
            className={cn(
                "mt-4 relative after:content-[''] after:absolute after:inset-0 after:border after:border-transparent after:pointer-events-none hover:after:border-blue-600",
                {
                    'after:border-2': isSelected,
                    'after:border-dashed': isSelected,
                    'after:border-blue-700': isSelected
                }
            )}
            onClick={handleClick}
        >
            {children}
        </div>
    );
}

