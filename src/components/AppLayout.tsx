import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 p-8">{children}</main>
  </div>
);

export default AppLayout;
