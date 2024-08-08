import { toast } from 'sonner';
import TextPreview from '#/components/TextPreview';
import TextPrimitive from '#/components/TextPrimitive';
import ProductListPreview from '#/components/ProductListPreview';
import ProductListPrimitive from '#/components/ProductListPrimitive';
import ImagePreview from '#/components/ImagePreview';
import ImagePrimitive from '#/components/ImagePrimitive';
import FeaturedProductsPreview from '#/components/FeaturedProductsPreview';
import FeaturedProductsPrimitive from '#/components/FeaturedProductsPrimitive';

export const registeredDraggableComponents = {
    text: TextPreview,
    'product-list': ProductListPreview,
    image: ImagePreview,
    'featured-products': FeaturedProductsPreview
};

export const registeredPrimitiveComponents = {
    text: TextPrimitive,
    'product-list': ProductListPrimitive,
    image: ImagePrimitive,
    'featured-products': FeaturedProductsPrimitive
};

export type AvailableComponentType = keyof typeof registeredDraggableComponents;

export function getComponent(type: AvailableComponentType, isDraggable: boolean = false) {
  const component = isDraggable ? registeredDraggableComponents[type] : registeredPrimitiveComponents[type];

  if (!component) {
    const errorMessage = `the component type is not registered: ${type}`;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  return component;
}

