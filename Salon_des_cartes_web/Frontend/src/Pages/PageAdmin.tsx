import { useEffect, useState } from "react";

type UtilisateurAdmin = {
  _id: string;
  courriel: string;
  nomUtilisateur?: string;
  telephone?: string;
  statutCompte?: string;
  compteActive?: boolean;
};

export default function PageAdmin() {
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurAdmin[]>([]);
  const [messageUtilisateurs, setMessageUtilisateurs] = useState("");

  async function voirUtilisateurs() {
    try {
      const response = await fetch("http://localhost:4000/auth/users", {
        credentials: "include",
      });

      if (!response.ok) {
        setMessageUtilisateurs("Impossible de charger les utilisateurs.");
        return;
      }

      const data = await response.json();
      setUtilisateurs(data);
      setMessageUtilisateurs("");
    } catch (error) {
      console.error("Erreur GET utilisateurs:", error);
      setMessageUtilisateurs("Impossible de charger les utilisateurs.");
    }
  }

  async function changerStatutUtilisateur(utilisateur: UtilisateurAdmin) {
    try {
      await fetch(`http://localhost:4000/auth/users/${utilisateur._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ compteActive: !utilisateur.compteActive }),
      });

      voirUtilisateurs();
    } catch (error) {
      console.error("Erreur PATCH utilisateur:", error);
    }
  }

  async function supprimerUtilisateur(id: string) {
    try {
      await fetch(`http://localhost:4000/auth/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      voirUtilisateurs();
    } catch (error) {
      console.error("Erreur DELETE utilisateur:", error);
    }
  }

  useEffect(() => {
    voirUtilisateurs();
  }, []);

  return (
    <div className="container-fluid py-4 bg-danger">
      <h1 className="mb-4 text-white">Page Admin</h1>

      <div className="card p-4 mt-4">
        <h3 className="mb-3">Gestion des comptes utilisateurs</h3>

        {messageUtilisateurs && (
          <p className="text-muted">{messageUtilisateurs}</p>
        )}

        {utilisateurs.length === 0 ? (
          <p className="text-muted mb-0">Aucun utilisateur trouvé.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Courriel</th>
                  <th>Nom utilisateur</th>
                  <th>Téléphone</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {utilisateurs.map((utilisateur) => (
                  <tr key={utilisateur._id}>
                    <td>{utilisateur.courriel}</td>
                    <td>{utilisateur.nomUtilisateur || "-"}</td>
                    <td>{utilisateur.telephone || "-"}</td>
                    <td>{utilisateur.compteActive ? "Actif" : "Inactif"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          type="button"
                          onClick={() => changerStatutUtilisateur(utilisateur)}
                        >
                          {utilisateur.compteActive ? "Désactiver" : "Activer"}
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          type="button"
                          onClick={() => supprimerUtilisateur(utilisateur._id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
