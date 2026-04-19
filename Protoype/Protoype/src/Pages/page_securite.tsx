import SidebarLayout from "../components/SidebarLayout";

export default function PageProfil() {
  return (
    <SidebarLayout title="Securite">
      <div className="card mt-1 shadow-sm">
        <div className="card-body">
          {/* Username */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              <strong>Username:</strong> Test
            </p>
            <button className="btn btn-primary">Change</button>
          </div>

          {/* Password */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              <strong>Password:</strong> ********
            </p>
            <button className="btn btn-primary">Change </button>
          </div>

          {/* 2FA */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              <strong>Two-Factor Authentication:</strong>
            </p>
            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="twoFactorSwitch"
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>

          {/* Cookies */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              <strong>Delete Cookies:</strong>
            </p>
            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="cookieSwitch"
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
