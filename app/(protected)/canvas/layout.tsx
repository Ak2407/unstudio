
import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

const CanvasLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-20  px-4  ">
        <div className="flex gap-x-7">
          <div className="w-80 shrink-0 hidden md:block ">
            <Sidebar />
          </div>
          <div className="w-full"> {children}</div>
        </div>
      </main>
    </div>
  );
};

export default CanvasLayout;
