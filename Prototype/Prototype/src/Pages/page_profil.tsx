import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

type UtilisateurProfil = {
  courriel: string;
  nomUtilisateur?: string;
  telephone?: string;
  compteActive?: boolean;
};

export default function PageProfil() {
  const navigate = useNavigate();
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

  async function confirmerModification() {
  if (!utilisateurModifie) return;

  try {
    const res = await fetch("http://localhost:4000/test/updateProfil", {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la modification");
    }

    setUser(utilisateurModifie);
    setModeModification(false);
  } catch (error) {
    console.log(error);
    setError("Erreur lors de la modification du profil");
  }
}

  function annulerModification() {
    setUtilisateurModifie(user);
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
            {/* Username */}
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
                <p className="mb-0">{user.nomUtilisateur || "N/A"}</p>
              )}
            </div>
            {/* Email */}
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
                <p className="mb-0">{user.courriel || "N/A"}</p>
              )}
            </div>
            {/*Telephone*/}
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
                <p className="mb-0">{user.telephone || "N/A"}</p>
              )}
            </div>

            {/* Status du compte */}
            <div className="d-flex align-items-center mb-3 gap-2">
              <p className="mb-0">
                <strong>Account status:</strong>
              </p>

              <p className="mb-0">{user.compteActive ? "Actif" : "Inactif"}</p>
            </div>
          </div>

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
                onClick={() => navigate("/Securite")}
              >
                Change Password
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-success mt-3"
                onClick={confirmerModification}
              >
                Confirm
              </button>

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
