import SidebarLayout from "../components/SidebarLayout";

export default function PageProfil() {
  return (
    <SidebarLayout title="Settings">
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          {/* Preferences */}
          <h5 className="mb-3">Preferences</h5>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              Theme :
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
          <p>
            Time Zone: America/Montreal
          </p>

          <hr />

          {/* Notifications */}
          <h5 className="mb-3">Notifications</h5>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
             Email Notification:
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              SMS Notification:
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

          <hr />

          {/* Personal Data */}
          <h5 className="mb-3">Personal Data</h5>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              Profile Visibility:
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              Data Sharing:
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

          <div className="d-flex justify-content-end">
            <button className="btn btn-primary mt-3">Save Changes</button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
