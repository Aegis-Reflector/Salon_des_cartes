import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";

// Type représentant les paramètres utilisateur
type ParametresUtilisateur = {
  notificationEmail: boolean;
  notificationSMS: boolean;
  visibiliteProfil: boolean;
  partageDonnees: boolean;
};

export default function PageProfil() {
  // État contenant les paramètres de l'utilisateur connecté
  const [utilisateur, setUtilisateur] =
    useState<ParametresUtilisateur | null>(null);

  // État contenant le message d'erreur
  const [erreur, setErreur] = useState("");

  // Charge les paramètres de l'utilisateur lorsque la page s'affiche
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

        // Enregistre les paramètres dans le state
        setUtilisateur(donnees);
      } catch (erreur) {
        console.log(erreur);
        setErreur("Erreur d'authentification");
      }
    }

    prendreInformation();
  }, []);

  // Sauvegarde les paramètres modifiés dans la base de données
  async function sauvegarderChangements() {
    if (!utilisateur) return;

    try {
      // Envoie les nouveaux paramètres au backend
      const reponse = await fetch("http://localhost:4000/test/updateSettings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          notificationEmail: utilisateur.notificationEmail,
          notificationSMS: utilisateur.notificationSMS,
          visibiliteProfil: utilisateur.visibiliteProfil,
          partageDonnees: utilisateur.partageDonnees,
        }),
      });

      // Convertit la réponse du serveur en objet JavaScript
      const donnees = await reponse.json();

      // Si la sauvegarde échoue, on lance une erreur
      if (!reponse.ok) {
        throw new Error(donnees.message || "Erreur lors de la sauvegarde");
      }
    } catch (erreur) {
      console.log(erreur);
      setErreur("Erreur lors de la sauvegarde des paramètres");
    }
  }

  // Active ou désactive les notifications par courriel
  function changerNotificationEmail() {
    if (!utilisateur) return;

    setUtilisateur({
      ...utilisateur,
      notificationEmail: !utilisateur.notificationEmail,
    });
  }

  // Active ou désactive les notifications par SMS
  function changerNotificationSMS() {
    if (!utilisateur) return;

    setUtilisateur({
      ...utilisateur,
      notificationSMS: !utilisateur.notificationSMS,
    });
  }

  // Active ou désactive la visibilité du profil
  function changerVisibiliteProfil() {
    if (!utilisateur) return;

    setUtilisateur({
      ...utilisateur,
      visibiliteProfil: !utilisateur.visibiliteProfil,
    });
  }

  // Active ou désactive le partage des données
  function changerPartageDonnees() {
    if (!utilisateur) return;

    setUtilisateur({
      ...utilisateur,
      partageDonnees: !utilisateur.partageDonnees,
    });
  }

  // Affiche un message d'erreur si une erreur est présente
  if (erreur) {
    return <SidebarLayout title="Settings">{erreur}</SidebarLayout>;
  }

  // Affiche un message de chargement pendant la récupération des données
  if (!utilisateur) {
    return <SidebarLayout title="Settings">Loading...</SidebarLayout>;
  }

  return (
    <SidebarLayout title="Settings">
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          {/* Section des préférences générales */}
          <h5 className="mb-3">Preferences</h5>
          <p>Time Zone: America/Montreal</p>

          <hr />

          {/* Section des notifications */}
          <h5 className="mb-3">Notifications</h5>

          {/* Interrupteur pour les notifications par courriel */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">Email Notification:</p>

            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={utilisateur.notificationEmail}
                id="notificationEmailSwitch"
                onChange={changerNotificationEmail}
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>

          {/* Interrupteur pour les notifications par SMS */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">SMS Notification:</p>

            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={utilisateur.notificationSMS}
                id="notificationSMSSwitch"
                onChange={changerNotificationSMS}
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>

          <hr />

          {/* Section des données personnelles */}
          <h5 className="mb-3">Personal Data</h5>

          {/* Interrupteur pour la visibilité du profil */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">Profile Visibility:</p>

            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={utilisateur.visibiliteProfil}
                id="visibiliteProfilSwitch"
                onChange={changerVisibiliteProfil}
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>

          {/* Interrupteur pour le partage des données */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">Data Sharing:</p>

            <div className="form-check form-switch me-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={utilisateur.partageDonnees}
                id="partageDonneesSwitch"
                onChange={changerPartageDonnees}
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>

          {/* Bouton pour sauvegarder les paramètres */}
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary mt-3"
              onClick={sauvegarderChangements}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}