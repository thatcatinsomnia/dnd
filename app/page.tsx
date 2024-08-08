import Sidebar from '#/components/Sidebar';
import WebsiteDropzone from '#/components/WebsiteDropzone';

export default function Home() {
  return (
    <div className="pl-72 h-dvh">
        <Sidebar />

        <div className="p-8">
            <WebsiteDropzone />        
        </div>
    </div>
  );
}
