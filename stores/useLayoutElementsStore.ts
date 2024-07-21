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

type UpdateData<T extends LayoutElement> = Omit<Partial<T>, 'type' | 'id'>;

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

export function updateLayoutElementById<T extends LayoutElement>(
    id: string, 
    data: UpdateData<T>
) {
    useLayoutElementsStore.setState(state => {
        const updatedElements = state.elements.map(element => {
            if (element.id === id) {
                return {
                    ...element,
                    ...data
                };
            }

            return element;
        });

        return {
            elements: updatedElements
        };
    });
}

