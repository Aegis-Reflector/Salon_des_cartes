import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Type représentant les informations du profil utilisateur
type ProfilUtilisateur = {
  courriel: string;
  nomUtilisateur?: string;
  telephone?: string;
  compteActive?: boolean;
};

export default function PageProfil() {
  // Hook utilisé pour rediriger l'utilisateur vers une autre page
  const naviguer = useNavigate();

  // État qui contient les informations actuelles de l'utilisateur
  const [utilisateur, setUtilisateur] = useState<ProfilUtilisateur | null>(
    null,
  );

  // État qui contient le message d'erreur, s'il y en a un
  const [erreur, setErreur] = useState("");

  // État qui contient les informations modifiées temporairement
  const [utilisateurModifie, setUtilisateurModifie] =
    useState<ProfilUtilisateur | null>(null);

  // État qui indique si le mode modification est activé ou non
  const [modeModification, setModeModification] = useState(false);

  // Charge les informations du profil lorsque la page est affichée
  useEffect(() => {
    async function prendreInformation() {
      try {
        // Envoie une requête au backend pour obtenir les informations de l'utilisateur connecté
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

        // Stocke les données originales de l'utilisateur
        setUtilisateur(donnees);

        // Stocke aussi une copie modifiable des données
        setUtilisateurModifie(donnees);
      } catch (erreur) {
        console.log(erreur);
        setErreur("Erreur lors du chargement du profil");
      }
    }

    prendreInformation();
  }, []);

  // Fonction appelée quand l'utilisateur modifie un champ du formulaire
  function gererChangement(e: React.ChangeEvent<HTMLInputElement>) {
    if (!utilisateurModifie) return;

    setUtilisateurModifie({
      ...utilisateurModifie,
      [e.target.name]: e.target.value,
    });
  }

  // Fonction appelée lorsque l'utilisateur confirme les modifications
  async function confirmerModification() {
    if (!utilisateurModifie) return;

    try {
      // Envoie les nouvelles informations du profil au backend
      const reponse = await fetch("http://localhost:4000/test/updateProfil", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nomUtilisateur: utilisateurModifie.nomUtilisateur,
          courriel: utilisateurModifie.courriel,
          telephone: utilisateurModifie.telephone,
        }),
      });

      // Convertit la réponse en objet JavaScript
      const donnees = await reponse.json();

      // Si la modification échoue, on lance une erreur
      if (!reponse.ok) {
        throw new Error(donnees.message || "Erreur lors de la modification");
      }

      // Met à jour les données affichées avec les nouvelles informations
      setUtilisateur(utilisateurModifie);

      // Désactive le mode modification
      setModeModification(false);
    } catch (erreur) {
      console.log(erreur);
      setErreur("Erreur lors de la modification du profil");
    }
  }

  // Fonction appelée lorsque l'utilisateur annule les modifications
  function annulerModification() {
    // Remet les valeurs modifiées aux anciennes valeurs de l'utilisateur
    setUtilisateurModifie(utilisateur);

    // Désactive le mode modification
    setModeModification(false);
  }

  // Affiche un message d'erreur s'il y a un problème
  if (erreur) {
    return <SidebarLayout title="Account Information">{erreur}</SidebarLayout>;
  }

  // Affiche un message de chargement pendant la récupération des données
  if (!utilisateur || !utilisateurModifie) {
    return (
      <SidebarLayout title="Account Information">Loading...</SidebarLayout>
    );
  }

  return (
    <SidebarLayout title="Account Information">
      <div className="card mt-1 shadow-sm">
        <div className="card-body">
          <div>
            {/* Champ du nom d'utilisateur */}
            <div className="d-flex align-items-center mb-3 gap-2">
              <label className="form-label mb-0">
                <strong>Username:</strong>
              </label>

              {modeModification ? (
                <input
                  type="text"
                  className="form-control"
                  name="nomUtilisateur"
                  value={utilisateurModifie.nomUtilisateur || ""}
                  onChange={gererChangement}
                />
              ) : (
                <p className="mb-0">
                  {utilisateur.nomUtilisateur || "N/A"}
                </p>
              )}
            </div>

            {/* Champ du courriel */}
            <div className="d-flex align-items-center mb-3 gap-2">
              <label className="form-label mb-0">
                <strong>Courriel:</strong>
              </label>

              {modeModification ? (
                <input
                  type="text"
                  className="form-control"
                  name="courriel"
                  value={utilisateurModifie.courriel || ""}
                  onChange={gererChangement}
                />
              ) : (
                <p className="mb-0">{utilisateur.courriel || "N/A"}</p>
              )}
            </div>

            {/* Champ du numéro de téléphone */}
            <div className="d-flex align-items-center mb-3 gap-2">
              <label className="form-label mb-0">
                <strong>Telephone:</strong>
              </label>

              {modeModification ? (
                <input
                  type="text"
                  className="form-control"
                  name="telephone"
                  value={utilisateurModifie.telephone || ""}
                  onChange={gererChangement}
                />
              ) : (
                <p className="mb-0">{utilisateur.telephone || "N/A"}</p>
              )}
            </div>

            {/* Statut du compte */}
            <div className="d-flex align-items-center mb-3 gap-2">
              <p className="mb-0">
                <strong>Account status:</strong>
              </p>

              <p className="mb-0">
                {utilisateur.compteActive ? "Actif" : "Inactif"}
              </p>
            </div>
          </div>

          {/* Boutons affichés lorsque le mode modification est désactivé */}
          {!modeModification ? (
            <>
              <button
                className="btn btn-primary mt-3"
                onClick={() => setModeModification(true)}
              >
                Edit Profile
              </button>

              <button
                className="btn btn-outline-secondary mt-3 ms-2"
                onClick={() => naviguer("/Securite")}
              >
                Change Password
              </button>
            </>
          ) : (
            <>
              {/* Bouton pour confirmer les modifications */}
              <button
                className="btn btn-success mt-3"
                onClick={confirmerModification}
              >
                Confirm
              </button>

              {/* Bouton pour annuler les modifications */}
              <button
                className="btn btn-outline-danger mt-3 ms-2"
                onClick={annulerModification}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}