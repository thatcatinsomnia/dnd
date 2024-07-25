import { toast } from 'sonner';
import TextPreview from '#/components/TextPreview';
import ProductListPreview from '#/components/ProductListPreview';
import ImagePreview from '#/components/ImagePreview';
import FeaturedProductsPreview from '#/components/FeaturedProductsPreview';

export const registeredComponents = {
    text: TextPreview,
    'product-list': ProductListPreview,
    image: ImagePreview,
    'featured-products': FeaturedProductsPreview
};

export type AvailableComponentType = keyof typeof registeredComponents;

export function getComponent(type: AvailableComponentType) {
  const component = registeredComponents[type];

  if (!component) {
    const errorMessage = `the component type is not registered: ${type}`;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  return component;
}

