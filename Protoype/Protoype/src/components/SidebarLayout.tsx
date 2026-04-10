import Sidebar from "./Sidebar";

function SidebarLayout() {
  return (
    <div className="container-fluid px-0 min-vh-100">
      <div className="row g-0 min-vh-100">
        {/* sidebar */}
        <aside className="col-12 bg-dark text-white">
          <Sidebar />
        </aside>

        {/* main */}
        <main className="col-9 bg-light p-3">

            
        </main>
      </div>
    </div>
  );
}
export default SidebarLayout;
