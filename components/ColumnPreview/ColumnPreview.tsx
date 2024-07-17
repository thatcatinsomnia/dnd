import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import useDraggable from '#/hooks/useDraggable';
import useDropTarget from '#/hooks/useDropTarget';
import { getComponent } from '#/helper/componentRegistry';
import DropIndicator from '#/components/DropIndicator';
import PreviewWrapper from '#/components/PreviewWrapper';

export type Props = {
    id: string;
    columns: number;
    content: LayoutElement[]
};

export default function ColumnPreview({ id, columns = 2, content }: Props) {
    const ref = useRef<HTMLParagraphElement>(null);
    const { dragState }  = useDraggable({
        ref,
        data: { 
            id, 
            type: 'column',
            columns, 
            content 
        }
    });

    const { dropState }  = useDropTarget({
        ref,
        data: { 
            id, 
            type: 'column',
            columns, 
            content 
        }
    });

    const styles = { "--grid-cols": columns } as React.CSSProperties;

    return (
        <PreviewWrapper>
            <div 
                ref={ref}
                style={styles}
                className={twMerge(
                    "grid grid-cols-dynamic gap-4 bg-white",
                    dragState.type === 'is-dragging' && 'opacity-30',
                )}
            >
                {content.map(layout => {
                    const Component = getComponent(layout.type);
                    
                    // HACK: use any to prevent typescript yell, change to correct type if find solution.
                    return <Component key={layout.id} {...layout as any} />;
                })} 
            </div>

            {dropState.type === 'is-dragging-over' && dropState.closestEdge && (
                <DropIndicator edge={dropState.closestEdge} />
            )}
        </PreviewWrapper>
    );
}

