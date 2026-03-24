import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen bg-gradient-mesh">
    <Sidebar />
    <main className="flex-1 ml-[280px] p-8 lg:p-10">
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </main>
  </div>
);

export default AppLayout;
