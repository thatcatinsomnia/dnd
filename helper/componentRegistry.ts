import TextPreview from '#/components/TextPreview';
import ProductListPreview from '#/components/ProductListPreview'

export const componentMap = {
    text: TextPreview,
    'product-list': ProductListPreview
};

export type AvailableComponentType = keyof typeof componentMap;

export function getComponent(type: AvailableComponentType) {
  const component = componentMap[type];

  if (!component) {
    throw new Error(`unhandle component type: ${type}`);
  }

  return component;
}

