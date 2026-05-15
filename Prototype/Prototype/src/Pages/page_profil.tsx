import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";

type UtilisateurProfil = {
  courriel: string;
  nomUtilisateur?: string;
  telephone?: string;
  statutCompte?: string;
};

export default function PageProfil() {
  const [user, setUser] = useState<UtilisateurProfil | null>(null);
  const [error, setError] = useState("");

  const [utilisateurModifie, setUtilisateurModifie] =
    useState<UtilisateurProfil | null>(null);
  const [modeModification, setModeModification] = useState(false);

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
        setUtilisateurModifie(data);
      } catch (error) {
        console.log(error);
        setError("Erreur lors du chargement du profil");
      }
    }

    prendreInformation();
  }, []);

  function gererChangement(e: React.ChangeEvent<HTMLInputElement>) {
    if (!utilisateurModifie) return;

    setUtilisateurModifie({
      ...utilisateurModifie,
      [e.target.name]: e.target.value,
    });
  }

  function confirmerModification() {
  if (!utilisateurModifie) return;

  setUtilisateur(utilisateurModifie);
  setModeModification(false);
}

function annulerModification() {
  setUtilisateurModifie(utilisateur);
  setModeModification(false);
}

  if (error) {
    return <SidebarLayout title="Account Information">{error}</SidebarLayout>;
  }

  if (!user || !utilisateurModifie) {
    return (
      <SidebarLayout title="Account Information">Loading...</SidebarLayout>
    );
  }
  return (
    <SidebarLayout title="Account Information">
      <div className="card mt-1 shadow-sm">
        <div className="card-body">
          <div>
            <p>
              <strong>Username:</strong> {user.nomUtilisateur || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.courriel || "N/A"}
            </p>
            <p>
              <strong>Phone number:</strong> {user.telephone || "N/A"}
            </p>
            <p>
              <strong>Account status:</strong> {user.statutCompte || "Actif"}
            </p>
          </div>

          <button className="btn btn-primary mt-3">Edit Profile</button>
          <button className="btn btn-outline-secondary mt-3 ms-2">
            Change Password
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
}
