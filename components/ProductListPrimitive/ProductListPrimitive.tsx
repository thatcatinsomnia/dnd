import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import Image from 'next/image';
import { formatOrGenerateProductList } from '#/helper/productUtils';

type Props = { 
    content: Extract<LayoutElement, { type: 'product-list' }>['content'];
};

// show product list with data, display default data if content is empty
export default function ProductListPrimitive({ content }: Props) {
    const products = formatOrGenerateProductList(content);

    return (
        <div className="py-4 flex gap-4 overflow-y-hidden">
            {products.map(product => (
                <div key={product.id} className="w-48 flex-shrink-0 text-gray-600 bg-white border border-slate-200 shadow-sm rounded overflow-hidden">
                    <div className="w-full size-48 grid place-items-center bg-slate-700/50 relative">
                        <Image src={product.image} alt={product.name} fill />
                    </div>
                    <div className="p-2">
                        <h3 className="pb-4 text-lg font-bold">{product.name}</h3>
                        <span className="text-lg text-red-500">${product.price}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
