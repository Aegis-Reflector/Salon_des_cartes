import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";
import ChampModifiable from "../components/ChampModifiable.tsx";

type UtilisateurSecurite = {
  nomUtilisateur: string;
  motDePasse: string;
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

  function changerTwoFactor() {
    if (!user) return;

    setUser({
      ...user,
      twoFactorEnabled: !user.twoFactorEnabled,
    });
  }

  function changerCookies() {
    if (!user) return;

    setUser({
      ...user,
      cookiesAccepted: !user.cookiesAccepted,
    });
  }

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
          <div className="d-flex justify-content-between align-items-center mb-0">
            <ChampModifiable
              label="Username"
              valeurAffichee={user.nomUtilisateur || "N/A"}
              placeholder="New username"
              onConfirm={(nouveauNom) => {
                setUser({
                  ...user,
                  nomUtilisateur: nouveauNom,
                });
              }}
            />
          </div>

          {/* Password */}
          <div className="d-flex justify-content-between align-items-center mb-0">
            <ChampModifiable
              label="Password"
              valeurAffichee="*************"
              placeholder="New password"
              type="password"
              onConfirm={(nouveauMotDePasse) => {
                console.log("Nouveau mot de passe:", nouveauMotDePasse);
              }}
            />
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
                onChange={changerTwoFactor}
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
                onChange={changerCookies}
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
