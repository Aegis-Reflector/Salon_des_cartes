import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";

type UtilisateurProfil = {
  courriel: string;
  nomComplet?: string;
  nomUtilisateur?: string;
  telephone?: string;
  statutCompte?: string;
};


export default function PageProfil() {

  const [user, setUser] = useState<UtilisateurProfil | null>(null);
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
    return <SidebarLayout title="Account Information">{error}</SidebarLayout>;
  }

  if (!user) {
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
              <strong>Username:</strong> {user.nomUtilisateur}
            </p>
            <p>
              <strong>Email:</strong> {user.courriel}
            </p>
            <p>
              <strong>Phone number:</strong> {user.telephone}
            </p>
            <p>
              <strong>Account status:</strong> {user.statutCompte}
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
