import Sidebar from "./Sidebar";
import type { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
};

function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="container-fluid vh-100 px-0 overflow-hidden">
      <div className="row g-0 h-100">
        <Sidebar />

        <main className="col-10 col-sm-9 col-xl-10 bg-light d-flex flex-column h-100">
          <div className="container-fluid px-0">
            <nav className="navbar navbar-light bg-light border-bottom flex-shrink-0">
              <div className="container-fluid justify-content-center">
                <span className="navbar-brand mb-0 h1 ">{title}</span>
              </div>
            </nav>

            <div className="p-3">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
