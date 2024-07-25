import TextComponent from '#/components/TextComponent';
import ProductListComponent from '#/components/ProductListComponent';
import ImageComponent from '#/components/ImageComponent';
import FeaturedProductsComponent from '#/components/FeaturedProductsComponent';

export default function Sidebar() {
    return (
        <div className="px-10 pb-6 w-72 h-full bg-[--bg-sidebar] shadow-sm fixed top-0 left-0">
            <p className="py-4 text-sm text-slate-200">Components:</p>

            <ul className="w-full text-gray-100 space-y-4">
                <li>
                    <TextComponent />
                </li>
                
                <li>
                    <ProductListComponent />
                </li>

                <li>
                    <ImageComponent />
                </li>

                <li>
                    <FeaturedProductsComponent />
                </li>
            </ul>
        </div>
    );
}

