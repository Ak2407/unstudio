import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="z-[10000] fixed top-0 w-full h-14 px-4  border-b bg-white border-gray-200 shadow-sm  flex items-center">
      <MobileSidebar />
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between  font-extrabold text-3xl">
        Unstudio
        <div className="space-x-4  flex items-center justify-between ">
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
