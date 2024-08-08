import { create } from 'zustand';

type Product = {
    id: string;
};

export type LayoutElement = 
    | {
        id: string;
        type: 'text';
        content: string;
      }
    | {
        id: string;
        type: 'product-list';
        content: Product[];
      }
    | {
        id: string;
        type: 'image';
        content: {
            alt: string;
            src: string;
        }
      }
    | {
        id: string;
        type: 'featured-products';
        content: Product[];
      };

type LayoutElementsStore = {
    elements: LayoutElement[];
    selectedId: LayoutElement['id'] | null;
};

type LayoutElementContentMap = {
    [K in LayoutElement as K['type']]: K['content']
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

export function selectLayoutElement(id: string | null) {
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
        const cloned = [...state.elements];

        const [moved] = cloned.splice(sourceIndex, 1);
        cloned.splice(targetIndex, 0, moved);

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
