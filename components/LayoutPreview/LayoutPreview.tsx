import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import { toast } from 'sonner';
import { registeredDraggableComponents, registeredPrimitiveComponents } from '#/helper/componentRegistry';

export default function LayoutPreview({ 
    isDraggable = false,
    layout,
}: { 
    isDraggable?: boolean;
    layout: LayoutElement[];
}) {
    return (
        <>
            {layout.map(l => {
                // const Component = registeredDraggableComponents[l.type];
                const Component = isDraggable ? registeredDraggableComponents[l.type] : registeredPrimitiveComponents[l.type];

                if (!Component) {
                    const errorMessage = `unhandle block component type: ${l.type}`;
                    toast.error(errorMessage);
                    throw new Error(errorMessage);
                }

                // HACK: use any to prevent typescript yell, change to correct type if find solution.
                return <Component key={l.id} {...l as any} />;
            })}
        </>
    );
}
