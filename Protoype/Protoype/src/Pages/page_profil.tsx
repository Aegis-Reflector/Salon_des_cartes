export default function PageProfil() {
  return (
    <>
      <div className="container-fluid bg-grey min-vh-100 px-0 mx-0">
        <div className="row min-vh-100 g-0 mx-0">
          <div className="col-2 col-sm-3 col-xl-2 bg-dark">
            <div className="container">
              <nav className="navbar navbar-dark bg-dark border-bottom border-white">
                <div className="container-fluid">
                  <a className="navbar-brand" href="#">
                    Navbar
                  </a>
                </div>
              </nav>

              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Active
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Link
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Link
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Link
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Link
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-10 col-sm-9 col-xl-10">
            <div className="container">
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <i className="bi bi-arrow-bar-right me-2" />
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>

              <div className="px-3">
                <p>Hello</p>
                <p>Hello</p>
                <p>Hello</p>
                <p>Hello</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
