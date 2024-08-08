import type { ReactNode } from 'react';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { forwardRef } from 'react';
import { cn } from '#/lib/utils';
import { selectLayoutElement, useLayoutElementsStore } from '#/stores/useLayoutElementsStore';

type Props = {
    children: ReactNode;
    layoutId: LayoutElement['id'];
    className?: string;
};

const PreviewWrapper = forwardRef<HTMLDivElement, Props>(function PreviewWrapper({ children, layoutId, className}, ref) {
    const selectedId = useLayoutElementsStore(state => state.selectedId);
    const isSelected = selectedId === layoutId;

    const handleClick = () => {
       selectLayoutElement(layoutId); 
    };

    return (
        <div
            ref={ref}
            className={cn(
                "relative after:content-[''] after:absolute after:inset-0 after:border after:border-transparent after:pointer-events-none hover:after:border-blue-600",
                {
                    'after:border-2': isSelected,
                    'after:border-dashed': isSelected,
                    'after:border-blue-700': isSelected
                },
                className
            )}
            onClick={handleClick}
        >
            {children}
        </div>
    );
});

export default PreviewWrapper;
