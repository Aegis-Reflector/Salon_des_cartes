import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";
import ChampModifiable from "../components/ChampModifiable.tsx";

// Type représentant les informations de sécurité de l'utilisateur
type SecuriteUtilisateur = {
  nomUtilisateur: string;
  twoFactorEnabled: boolean;
  cookiesAccepted: boolean;
};

export default function PageProfil() {
  // État contenant les informations de l'utilisateur connecté
  const [utilisateur, setUtilisateur] = useState<SecuriteUtilisateur | null>(
    null,
  );

  // État contenant le message d'erreur
  const [erreur, setErreur] = useState("");

  // Charge les informations de sécurité de l'utilisateur au chargement de la page
  useEffect(() => {
    async function prendreInformation() {
      try {
        // Requête pour récupérer les informations de l'utilisateur connecté
        const reponse = await fetch("http://localhost:4000/test/me", {
          method: "GET",
          credentials: "include",
        });

        // Convertit la réponse en objet JavaScript
        const donnees = await reponse.json();

        // Si la requête échoue, on lance une erreur
        if (!reponse.ok) {
          throw new Error(donnees.message || "Erreur");
        }

        // Enregistre les informations de l'utilisateur dans le state
        setUtilisateur(donnees);
      } catch (erreur) {
        if (erreur instanceof Error) {
          setErreur(erreur.message);
        } else {
          setErreur("Erreur inconnue");
        }
      }
    }

    prendreInformation();
  }, []);

  // Fonction appelée lorsque l'utilisateur active ou désactive le 2FA
  async function changerDoubleAuthentification() {
    if (!utilisateur) return;

    // Inverse l'état actuel du 2FA
    const nouvelEtat = !utilisateur.twoFactorEnabled;

    try {
      // Envoie le nouvel état de sécurité au backend
      const reponse = await fetch("http://localhost:4000/test/updateSecurite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          twoFactorEnabled: nouvelEtat,
          cookiesAccepted: utilisateur.cookiesAccepted,
        }),
      });

      // Si la modification échoue, on lance une erreur
      if (!reponse.ok) {
        throw new Error("Erreur lors de la modification");
      }

      // Met à jour l'affichage avec le nouvel état du 2FA
      setUtilisateur({
        ...utilisateur,
        twoFactorEnabled: nouvelEtat,
      });
    } catch (erreur) {
      console.error(erreur);
      setErreur("Erreur lors de la modification de la sécurité");
    }
  }

  // Fonction appelée lorsque l'utilisateur accepte ou refuse les cookies
  async function changerCookies() {
    if (!utilisateur) return;

    // Inverse l'état actuel des cookies
    const nouvelEtat = !utilisateur.cookiesAccepted;

    try {
      // Envoie le nouvel état des cookies au backend
      const reponse = await fetch("http://localhost:4000/test/updateSecurite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          twoFactorEnabled: utilisateur.twoFactorEnabled,
          cookiesAccepted: nouvelEtat,
        }),
      });

      // Si la modification échoue, on lance une erreur
      if (!reponse.ok) {
        throw new Error("Erreur lors de la modification");
      }

      // Met à jour l'affichage avec le nouvel état des cookies
      setUtilisateur({
        ...utilisateur,
        cookiesAccepted: nouvelEtat,
      });
    } catch (erreur) {
      console.error(erreur);
      setErreur("Erreur lors de la modification des cookies");
    }
  }

  // Affiche un message d'erreur si une erreur est présente
  if (erreur) {
    return <SidebarLayout title="Securite">{erreur}</SidebarLayout>;
  }

  // Affiche un message de chargement pendant la récupération des données
  if (!utilisateur) {
    return <SidebarLayout title="Securite">Loading...</SidebarLayout>;
  }

  return (
    <SidebarLayout title="Securite">
      <div className="card mt-1 shadow-sm">
        <div className="card-body">
          {/* Champ pour modifier le nom d'utilisateur */}
          <div className="d-flex justify-content-between align-items-center mb-0">
            <ChampModifiable
              label="Username"
              valeurAffichee={utilisateur.nomUtilisateur || "N/A"}
              placeholder="New username"
              onConfirm={async (nouveauNom) => {
                try {
                  // Envoie le nouveau nom d'utilisateur au backend
                  const reponse = await fetch(
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

                  // Convertit la réponse en objet JavaScript
                  const donnees = await reponse.json();

                  // Si la modification échoue, on lance une erreur
                  if (!reponse.ok) {
                    throw new Error(donnees.message || "Erreur");
                  }

                  // Met à jour l'affichage avec le nouveau nom
                  setUtilisateur({
                    ...utilisateur,
                    nomUtilisateur: nouveauNom,
                  });
                } catch (erreur) {
                  console.error(erreur);
                  setErreur("Erreur lors de la modification du nom utilisateur");
                }
              }}
            />
          </div>

          {/* Champ pour modifier le mot de passe */}
          <div className="d-flex justify-content-between align-items-center mb-0">
            <ChampModifiable
              label="Password"
              valeurAffichee="*************"
              placeholder="New password"
              type="password"
              onConfirm={async (nouveauMotDePasse) => {
                try {
                  // Envoie le nouveau mot de passe au backend
                  const reponse = await fetch(
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

                  // Convertit la réponse en objet JavaScript
                  const donnees = await reponse.json();

                  // Si la modification échoue, on lance une erreur
                  if (!reponse.ok) {
                    throw new Error(donnees.message || "Erreur");
                  }

                  alert("Mot de passe modifié avec succès");
                } catch (erreur) {
                  console.error(erreur);
                  setErreur("Erreur lors de la modification du mot de passe");
                }
              }}
            />
          </div>

          {/* Interrupteur pour la double authentification */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              <strong>Two-Factor Authentication:</strong>
            </p>

            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="twoFactorSwitch"
                checked={utilisateur.twoFactorEnabled}
                onChange={changerDoubleAuthentification}
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>

          {/* Interrupteur pour accepter ou refuser les cookies */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              <strong>Delete Cookies:</strong>
            </p>

            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="cookieSwitch"
                checked={utilisateur.cookiesAccepted}
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