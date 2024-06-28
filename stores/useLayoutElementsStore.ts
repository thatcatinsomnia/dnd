import type { ReactNode } from 'react';
import { create } from 'zustand';

export type LayoutElement = {
    id: string;
    type: string;
    children: ReactNode
};

type LayoutDataState = {
    elements: LayoutElement[];
};

export const useLayoutElementsStore = create<LayoutDataState>()(() => ({
    elements: []
}));

export const pushNewLayoutElement = (newElement: LayoutElement) => useLayoutElementsStore.setState(state => ({
    elements: [...state.elements, newElement]
}));

export const updateLayoutElementById = (id: string, data: ReactNode) => useLayoutElementsStore.setState(state => {
    const updatedElements = state.elements.map(element => {
        if (element.id === id) {
            return {
                ...element,
                children: data
            };
        }

        return element;
    });

    return {
        elements: updatedElements
    };
});

