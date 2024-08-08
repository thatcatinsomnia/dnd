import LayoutJsonPreview from "#/components/LayoutJsonPreview";

export default function LayoutDataPage() {
    return (
        <div>
            <h2 className="p-6 text-2xl font-semibold text-center text-slate-300">Layout Data</h2>

            <div className="max-w-md mx-auto">
                <LayoutJsonPreview />
            </div>
        </div>
    );
}
