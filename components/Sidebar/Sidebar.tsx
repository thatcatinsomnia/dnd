import TextComponent from '#/components/TextComponent';

export default function Sidebar() {
    return (
        <div className="px-10 pb-6 h-screen w-72 bg-slate-800 shadow-sm overflow-y-auto">
            <p className="py-4 text-sm text-gray-100/50">Components:</p>

            <ul className="w-full text-gray-100">
                <li className="w-full">
                    <TextComponent />
                </li>
            </ul>
        </div>
    );
}

