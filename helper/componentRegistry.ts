import TextPreview from '#/components/TextPreview';
import ProductListPreview from '#/components/ProductListPreview';
import ImagePreview from '#/components/ImagePreview';

export const registeredComponents = {
    text: TextPreview,
    'product-list': ProductListPreview,
    image: ImagePreview
};

export type AvailableComponentType = keyof typeof registeredComponents;

export function getComponent(type: AvailableComponentType) {
  const component = registeredComponents[type];

  if (!component) {
    throw new Error(`the component type is not registered: ${type}`);
  }

  return component;
}

