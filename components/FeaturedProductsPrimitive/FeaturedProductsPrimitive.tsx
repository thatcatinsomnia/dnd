import type { LayoutElement } from '#/stores/useLayoutElementsStore';
import Image from 'next/image';
import { cn } from '#/lib/utils'
import { AspectRatio } from '#/components/ui/aspect-ratio';
import { formatOrGenerateFeaturedProducts } from '#/helper/productUtils';


type Props = {
    content: Extract<LayoutElement, { type: 'product-list' }>['content'];
};

// layout limitation:
// the first product is featured(the biggest one)
// the next 4 products are 2 x 2 grid display on right side
// other products after 6 (include 6) is ignored
export default function FeaturedProductsPrimitive({ content }: Props) {
    const products = formatOrGenerateFeaturedProducts(content);

    return (
        <div
            className="py-2 grid grid-cols-8 grid-rows-2 gap-6"
        >
            <ProductPrimitive
                className="col-span-4 row-span-2"
                product={products[0]}
                isFeatured
            />

            {products.slice(1, 6).map(product => (
                <ProductPrimitive
                    key={product.id}
                    className="col-span-2 bg-blue-500"
                    product={product}
                />
            ))}
        </div>
    );
}

function ProductPrimitive({ 
    product,
    isFeatured = false,
    className
}: { 
    product: ReturnType<typeof formatOrGenerateFeaturedProducts>[number];
    isFeatured?: boolean;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col border border-gray-300 rounded shadow-sm overflow-hidden", className)}>
            <AspectRatio className="relative">
                <Image 
                    className="object-cover pointer-events-none"
                    src={product.image ? product.image : '/placeholder.svg'}
                    alt="product-4 placeholder" 
                    fill
                />
            </AspectRatio>

            <div className="p-2 flex-1 flex flex-col justify-between bg-white">
                <h3 className="mb-4 text-gray-600 font-bold text-lg">{product.name}</h3>

                {isFeatured && (
                    <p className="mb-4 text-gray-500">{product.description}</p>
                )}

                <span className="mt-auto text-red-500 text-xl">
                    <small className="text-sm">$</small>
                    {product.price}
                </span>
            </div>
        </div>
    );
}
