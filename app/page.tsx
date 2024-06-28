import WebsiteDropZone from '#/components/WebsiteDropZone';
import Sidebar from '#/components/Sidebar';

export default function Home() {
  return (
    <div className="h-dvh flex overflow-hidden">
        <Sidebar />

        <div className="flex-1">
            <div className="p-12">
                <WebsiteDropZone />        
            </div>
        </div>
    </div>
  );
}
