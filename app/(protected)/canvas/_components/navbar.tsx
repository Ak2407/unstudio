import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./mobile-sidebar";
import ScreenRecord from "./screen-record";

const Navbar = () => {
  return (
    <div className="z-[10000] fixed top-0 w-full h-14 px-4  border-b bg-white border-gray-200 shadow-sm  flex items-center">
      <MobileSidebar />
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <h1 className="text-3xl font-extrabold">Unstudio</h1>
        <div className="space-x-4  flex items-center justify-between">
          <ScreenRecord />
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button size="sm" variant="destructive">
              Log Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
