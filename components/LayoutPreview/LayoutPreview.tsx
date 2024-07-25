import { toast } from 'sonner';
import { useLayoutElementsStore } from '#/stores/useLayoutElementsStore';
import { registeredComponents } from '#/helper/componentRegistry';

export default function LayoutPreview() {
    const layoutElements = useLayoutElementsStore(state => state.elements);

    if (layoutElements.length === 0) {
        return null;
    }

    return (
        <>
            {layoutElements.map(layout => {
                const Component = registeredComponents[layout.type];

                if (!Component) {
                    const errorMessage = `unhandle block component type: ${layout.type}`;
                    toast.error(errorMessage);
                    throw new Error(errorMessage);
                }

                // HACK: use any to prevent typescript yell, change to correct type if find solution.
                return <Component key={layout.id} {...layout as any} />;
            })}
        </>
    );
}

