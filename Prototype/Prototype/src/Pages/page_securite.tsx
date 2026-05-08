import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";

type UtilisateurSecurite = {
  nomUtilisateur: string;
  twoFactorEnabled: boolean;
  cookiesAccepted: boolean;
};

export default function PageProfil() {
  const [user, setUser] = useState<UtilisateurSecurite | null>(null);
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
    return <SidebarLayout title="Securite">{error}</SidebarLayout>;
  }

  if (!user) {
    return <SidebarLayout title="Securite">Loading...</SidebarLayout>;
  }


  return (
    <SidebarLayout title="Securite">
      <div className="card mt-1 shadow-sm">
        <div className="card-body">
          {/* Username */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              <strong>Username:</strong> {user.nomUtilisateur || "N/A"}
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
                checked={user.twoFactorEnabled}

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
                checked={user.cookiesAccepted}
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
