import { create } from 'zustand';

export type TextComponent = {
    id: string;
    type: 'text';
    content: string;
};

export type ColumnComponent = {
    id: string;
    type: 'column';
    columns: number;
    content: LayoutElement[];
};

export type BoxComponent = {
    id: string;
    type: 'box',
    content: LayoutElement[];
};

export type LayoutElement = TextComponent | ColumnComponent | BoxComponent;

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
        return { elements: [...state.elements, newElement]}
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

