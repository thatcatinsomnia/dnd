import type { Props as TextPreviewProps } from '#/components/TextPreview';
import type { Props as ProductListPreviewProps } from '#/components/ProductListPreview';
import { create } from 'zustand';

export type LayoutElement = 
    | TextPreviewProps
    | ProductListPreviewProps;

type LayoutElementsStore = {
    elements: LayoutElement[];
    selectedId: LayoutElement['id'] | null;
};

type LayoutElementContentMap = {
    [L in LayoutElement as L['type']]: L['content']
};

export const useLayoutElementsStore = create<LayoutElementsStore>()(() => ({
    elements: [],
    selectedId: null
}));

export function setLayoutElements(layoutElements: LayoutElement[]) {
    useLayoutElementsStore.setState(state => ({
        elements: layoutElements
    }));
}

export function selectLayoutElement(id: string | number | null) {
    useLayoutElementsStore.setState(state => ({
        selectedId: id
    }));
}

export function pushNewLayoutElement(newElement: LayoutElement) {
    useLayoutElementsStore.setState(state => {
        const layoutElements = [...state.elements, newElement];
        return { elements: layoutElements}
    });
}

export function insertNewLayoutElmement({ element, targetIndex }: {
    element: LayoutElement;
    targetIndex: number;
}) {
    useLayoutElementsStore.setState(state => {
        const newLayoutElements = [
            ...state.elements.slice(0, targetIndex), 
            element, 
            ...state.elements.slice(targetIndex)
        ];

        return { elements: newLayoutElements };
    });

}

export function reorderLayoutElements({ sourceIndex, targetIndex }: {
    sourceIndex: number;
    targetIndex: number;
}) {
    useLayoutElementsStore.setState(state => {
        console.log({ elements: state.elements });

        const cloned = [...state.elements];

        const [moved] = cloned.splice(sourceIndex, 1);
        cloned.splice(targetIndex, 0, moved);

        console.log({ elements: cloned });

        return {
            elements: cloned
        }
    });
}

export function updateLayoutElementById<T extends LayoutElement['type']>(
    id: string | number, 
    data: LayoutElementContentMap[T]
) {
    useLayoutElementsStore.setState(state => {
        const updatedElements = state.elements.map(element => {
            if (element.id === id) {
                return {
                    ...element,
                    content: data
                } as LayoutElement;
            }

            return element;
        });

        return {
            elements: updatedElements
        };
    });
}

