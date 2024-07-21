import type { Props as TextPreviewProps } from '#/components/TextPreview';
import type { Props as ProductListPreviewProps } from '#/components/ProductListPreview';
import { create } from 'zustand';

export type LayoutElement = 
    | TextPreviewProps
    | ProductListPreviewProps;

type LayoutElementsStore = {
    elements: LayoutElement[];
};

type UpdateData<T extends LayoutElement> = Omit<Partial<T>, 'type' | 'id'>;

export const useLayoutElementsStore = create<LayoutElementsStore>()(() => ({
    elements: []
}));

export function setLayoutElements(layoutElements: LayoutElement[]) {
    useLayoutElementsStore.setState(state => ({
        elements: layoutElements
    }));
}

export function pushNewLayoutElement(newElement: LayoutElement) {
    useLayoutElementsStore.setState(state => {
        const layoutElements = [...state.elements, newElement];
        console.log({ layoutElements });

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

        console.log({ newLayoutElements });
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

