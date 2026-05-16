import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";
import ChampModifiable from "../components/ChampModifiable.tsx";

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

  async function changerTwoFactor() {
    if (!user) return;

    const nouvelEtat = !user.twoFactorEnabled;

    try {
      const res = await fetch("http://localhost:4000/test/updateSecurite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          twoFactorEnabled: nouvelEtat,
          cookiesAccepted: user.cookiesAccepted,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la modification");
      }

      setUser({
        ...user,
        twoFactorEnabled: nouvelEtat,
      });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de la sécurité");
    }
  }

  async function changerCookies() {
    if (!user) return;

    const nouvelEtat = !user.cookiesAccepted;

    try {
      const res = await fetch("http://localhost:4000/test/updateSecurite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          twoFactorEnabled: user.twoFactorEnabled,
          cookiesAccepted: nouvelEtat,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la modification");
      }

      setUser({
        ...user,
        cookiesAccepted: nouvelEtat,
      });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification des cookies");
    }
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
              onConfirm={async (nouveauNom) => {
                try {
                  const res = await fetch(
                    "http://localhost:4000/test/updateProfil",
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify({
                        nomUtilisateur: nouveauNom,
                      }),
                    },
                  );

                  const data = await res.json();

                  if (!res.ok) {
                    throw new Error(data.message || "Erreur");
                  }

                  setUser({
                    ...user,
                    nomUtilisateur: nouveauNom,
                  });
                } catch (err) {
                  console.error(err);
                  setError("Erreur lors de la modification du nom utilisateur");
                }
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
              onConfirm={async (nouveauMotDePasse) => {
                try {
                  const res = await fetch(
                    "http://localhost:4000/test/changePassword",
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify({
                        nouveauMotDePasse,
                      }),
                    },
                  );

                  const data = await res.json();

                  if (!res.ok) {
                    throw new Error(data.message || "Erreur");
                  }

                  alert("Mot de passe modifié avec succès");
                } catch (err) {
                  console.error(err);
                  setError("Erreur lors de la modification du mot de passe");
                }
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
