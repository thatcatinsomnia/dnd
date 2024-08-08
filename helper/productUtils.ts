import type { LayoutElement } from '#/stores/useLayoutElementsStore';

type ProductListContent = Extract<LayoutElement, { type: 'product-list' }>['content'];

export function formatOrGenerateProductList(content: ProductListContent) {
    return formatOrGenerateProducts(10, content);
}

export function formatOrGenerateFeaturedProducts(content: ProductListContent) {
    return formatOrGenerateProducts(5, content);
}

function formatOrGenerateProducts(size: number, content: ProductListContent) {
    if (content.length === 0) {
        return Array.from({ length:  size }).map((_, i) => {
            const product = {
                id: Math.random().toString(16).slice(2, 8).toString(),
                name: `Product ${i + 1}`,
                image: '/placeholder.svg',
                description: `This is product ${i + 1}`,
                price: 999
            };
            return product;
        });
    }

    return content.map(p => ({
        id: p.id,
        name: `P-${p.id}`,
        image: '/placeholder.svg',
        description: `This is product ${p.id}`,
        price: 999
    }));
}
