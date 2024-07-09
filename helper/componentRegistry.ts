import TextPreview from '#/components/TextPreview';
import ColumnPreview from '#/components/ColumnPreview';
import Box from '#/components/Box';

export const componentMap = {
    text: TextPreview,
    column: ColumnPreview,
    box: Box
};

export type AvailableComponentType = keyof typeof componentMap;

export function getComponent(type: AvailableComponentType) {
  const component = componentMap[type];

  if (!component) {
    throw new Error(`unhandle component type: ${type}`);
  }

  return component;
}

