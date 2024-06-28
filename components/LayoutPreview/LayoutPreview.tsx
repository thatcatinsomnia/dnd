import type { ComponentType } from 'react';
import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import TextPreview from '#/components/TextPreview';
import { useLayoutElementsStore } from '#/stores/useLayoutElementsStore';

type PreviewComponentProps = Omit<LayoutElement, 'type'>; 

type PreviewComponents = {
  [key: string]: ComponentType<PreviewComponentProps>;
};

const previewComponents: PreviewComponents = {
    'text': TextPreview
};

export default function LayoutPreview() {
    const layoutElements = useLayoutElementsStore(state => state.elements);

    if (layoutElements.length === 0) {
        return null;
    }

    return (
        <>
            {layoutElements.map(layout => {
               const Component = previewComponents[layout.type];

                if (!Component) {
                    throw new Error('unhandle block component type: ' + layout.type);
                }

                return (
                    <Component key={layout.id} id={layout.id}>{layout.children}</Component>
                );
            })}
        </>
    );
}

