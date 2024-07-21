import WebsiteDropZone from '#/components/WebsiteDropZone';
import Sidebar from '#/components/Sidebar';

export default function Home() {
  return (
    <div className="pl-72 h-dvh">
        <Sidebar />

        <div className="">
            <div className="p-12">
                <WebsiteDropZone />        
            </div>
        </div>
    </div>
  );
}
