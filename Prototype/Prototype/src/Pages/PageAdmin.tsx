import { useEffect, useState } from "react";

type Carte = {
  id_produit: number;
  nom: string;
  numero_carte: string;
  rarete: string;
  carte_texte: string;
  prix: number;
  extension: string;
  image: string;
};

export default function PageAdmin() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [modifieID, setmodifieId] = useState<number | null>(null);
  //État liés aux champs du formulaire
  const [nom, setNom] = useState("");
  const [numero_carte, setNumeroCarte] = useState("");
  const [rarete, setRarete] = useState("");
  const [carte_texte, setCarteTexte] = useState("");
  const [prix, setPrix] = useState("");
  const [extension, setExtension] = useState("");
  const [image, setImage] = useState("");


   async function voirCartes() {
    try {
      const response = await fetch("http://localhost:4000/produits");
      const data = await response.json();
      console.log(data);
      setCartes(data);
    } catch (error) {
      console.error("Erreur GET:", error);
    }
  }

  
  useEffect(() => {
    voirCartes();
  }, []);

 

  function viderFormulaire() {
    setNom("");
    setNumeroCarte("");
    setRarete("");
    setCarteTexte("");
    setPrix("");
    setExtension("");
    setImage("");
    setmodifieId(null);
  }

  //fait un ajout ou une modification
  async function ajouterCarte(e: any) {
    e.preventDefault();

      const dataCarte = {
        nom,
        numero_carte,
        rarete,
        carte_texte,
        prix: Number(prix),
        extension,
        image,
      };
      try {
         // Si aucune carte n'est en modification, on ajoute
        if (modifieID === null) {
          await fetch("http://localhost:4000/produits", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataCarte),
          });
        } else {
          // Sinon, on modifie la carte existante
          await fetch(`http://localhost:4000/produits/${modifieID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataCarte),
          });
        }
         // On vide le formulaire puis on recharge la liste
        viderFormulaire();
        voirCartes();
      } catch (error) {
        console.error("Erreur POST/PUT:", error);
      }
    }

    // Fonction pour supprimer une carte
    async function supprimerCarte(id: number) {
      try {
        await fetch(`http://localhost:4000/produits/${id}`, {
          method: "DELETE",
        });
        if (modifieID == id) {
          viderFormulaire();
        }

        voirCartes();
      } catch (error) {
        console.error("Erreur DELETE :", error);
      }
    }

     // les infos d'une carte dans le formulaire afin de la modifier
    function modifierCarte(carte: Carte) {
      
      console.log("carte à modifier:", carte);
      setmodifieId(carte.id_produit);
      // Remplit les champs avec les données de la carte choisie aussi si l'info est null sa montre rien
      setNom(carte.nom ?? "" );
      setNumeroCarte(carte.numero_carte ?? "" );
      setRarete(carte.rarete ?? "");
      setCarteTexte(carte.carte_texte ?? "");
      setPrix(String(carte.prix));
      setExtension(carte.extension ?? "");
      setImage(carte.image ?? "");
    }

    return (
      <div className="container-fluid py-4 bg-danger">
        <h1 className="mb-4 text-white">Page Admin</h1>

        <div className="card p-4 mb-4 ">
          <h3 className="mb-3">
            
            {modifieID === null ? "Ajouter une carte " : "Modifier une carte"}
          </h3>

          <form onSubmit={ajouterCarte}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Numéro de carte</label>
                <input
                  type="text"
                  className="form-control"
                  value={numero_carte}
                  onChange={(e) => setNumeroCarte(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Rareté</label>
                <input
                  type="text"
                  className="form-control"
                  value={rarete}
                  onChange={(e) => setRarete(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Prix</label>
                <input
                  type="number"
                  step="0.10"
                  className="form-control"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Extension </label>
                <input
                  type="text"
                  className="form-control"
                  value={extension}
                  onChange={(e) => setExtension(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Image (URL ou chemin)</label>
                <input
                  type="text"
                  className="form-control"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/rapidash.png"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Texte carte</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={carte_texte}
                  onChange={(e) => setCarteTexte(e.target.value)}
                  required
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-dark">
                  {modifieID === null ? "Ajouter une carte " : "Enregistrer"}
                </button>

                {modifieID !== null && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={viderFormulaire}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="card p-4">
          <h3 className="mb-3">Liste des cartes</h3>

          {cartes.length === 0 ? (
            <p className="text-muted mb-0">Aucune carte pour le moment.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Extension</th>
                    <th>Numéro</th>
                    <th>Rareté</th>
                    <th>Texte</th>
                    <th>Prix</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {cartes.map((carte) => (
                    <tr key={carte.id_produit}>
                      <td>{carte.id_produit}</td>
                      <td>
                        <img
                          src={carte.image}
                          alt={carte.nom}
                          style={{
                            width: "60px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{carte.nom}</td>
                      <td>{carte.extension}</td>
                      <td>{carte.numero_carte}</td>
                      <td>{carte.rarete}</td>
                      <td>{carte.carte_texte}</td>
                      <td>{carte.prix} $</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btm-sm"
                            onClick={() => modifierCarte(carte)}
                          >
                            Modifier
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => supprimerCarte(carte.id_produit)}
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

