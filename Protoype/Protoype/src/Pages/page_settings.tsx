import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";

type UserSettings = {
  notificationEmail: boolean;
  notificationSMS: boolean;
  visibiliteProfil: boolean;
  partageDonnees: boolean;
};

export default function PageProfil() {

  const [user, setUser] = useState<UserSettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function prendreInformation() {
      try {
        const res = await fetch("http://localhost:4000/test/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur");
        }

        setUser(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    prendreInformation();
  }, []);

  if (error) {
    return <SidebarLayout title="Settings">{error}</SidebarLayout>;
  }

  if (!user) {
    return <SidebarLayout title="Settings">Loading...</SidebarLayout>;
  }

  return (
    <SidebarLayout title="Settings">
      <div className="card mt-4 shadow-sm">
        <div className="card-body"> 
          {/* Preferences */}
          <h5 className="mb-3">Preferences</h5>
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
                checked={user.notificationEmail}
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
                checked={user.notificationSMS}
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
                checked={user.visibiliteProfil}
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
                checked={user.partageDonnees}
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
