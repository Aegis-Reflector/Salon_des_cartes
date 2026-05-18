import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Modal, Button } from "react-bootstrap";

export default function PageInscription() {
  // Hook utilisé pour rediriger l'utilisateur vers une autre page
  const naviguer = useNavigate();

  // État qui contient les valeurs du formulaire d'inscription
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    courriel: "",
    motDePasse: "",
    nomUtilisateur: "",
    telephone: "",
  });

  // État qui contient la confirmation du mot de passe
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");

  // Liste des conditions que le mot de passe doit respecter
  const conditionsMotDePasse = [
    {
      label: "Au moins 6 caractères",
      test: donneesFormulaire.motDePasse.length >= 6,
    },
    {
      label: "Au moins un chiffre",
      test: /\d/.test(donneesFormulaire.motDePasse),
    },
    {
      label: "Au moins un caractère spécial",
      test: /[!@#$%^&*]/.test(donneesFormulaire.motDePasse),
    },
  ];

  // État qui contrôle l'affichage du popup
  const [afficherPopup, setAfficherPopup] = useState(false);

  // États qui contiennent le titre et le message du popup
  const [messagePopup, setMessagePopup] = useState("");
  const [titrePopup, setTitrePopup] = useState("");

  // Fonction utilisée pour afficher le popup avec un titre et un message
  const ouvrirPopup = (titre: string, message: string) => {
    setTitrePopup(titre);
    setMessagePopup(message);
    setAfficherPopup(true);
  };

  // Fonction utilisée pour fermer le popup
  const fermerPopup = () => {
    setAfficherPopup(false);
  };

  // Fonction appelée lorsqu'un champ du formulaire change
  const gererChangement = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDonneesFormulaire({
      ...donneesFormulaire,
      [e.target.name]: e.target.value,
    });
  };

  // Fonction appelée lorsque l'utilisateur soumet le formulaire
  const gererSoumission = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifie si toutes les conditions du mot de passe sont respectées
    const motDePasseValide = conditionsMotDePasse.every(
      (condition) => condition.test,
    );

    // Vérifie si le mot de passe et sa confirmation sont identiques
    if (donneesFormulaire.motDePasse !== confirmationMotDePasse) {
      ouvrirPopup(
        "Mot de passe invalide",
        "Les mots de passe ne correspondent pas.",
      );
      return;
    }

    // Vérifie si le mot de passe respecte toutes les conditions
    if (!motDePasseValide) {
      ouvrirPopup(
        "Mot de passe invalide",
        "Le mot de passe doit respecter toutes les conditions.",
      );
      return;
    }

    // Envoie les informations du formulaire au backend pour créer un compte
    fetch("http://localhost:4000/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        nomUtilisateur: donneesFormulaire.nomUtilisateur,
        telephone: donneesFormulaire.telephone,
        courriel: donneesFormulaire.courriel,
        motDePasse: donneesFormulaire.motDePasse,
      }),
    })
      .then((reponse) => {
        if (!reponse.ok) {
          throw new Error("Erreur de création");
        }

        return reponse.json();
      })
      .then(() => {
        naviguer("/");
      })
      .catch((erreur) => {
        console.error(erreur);

        if (erreur instanceof Error) {
          ouvrirPopup("Erreur de création", erreur.message);
        } else {
          ouvrirPopup("Erreur de création", "Une erreur inconnue est survenue.");
        }
      });
  };

  return (
    <>
      <div className="container-fluid bg-light min-vh-100 p-0">
        <div className="row min-vh-100 g-0">
          {/* Colonne décorative à gauche */}
          <div className="col-3 bg-dark"></div>

          {/* Colonne principale contenant le formulaire */}
          <div className="col-9 bg-light d-flex justify-content-center align-items-center">
            <div>
              {/* Titre de la page */}
              <h3>Inscrivez-vous à Salon de Carte</h3>

              {/* Formulaire d'inscription */}
              <form
                className="bg-light border border-dark rounded p-5 text-secondary d-flex flex-column gap-3"
                onSubmit={gererSoumission}
              >
                {/* Champ pour le nom d'utilisateur */}
                <div className="form-group">
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nomUtilisateur"
                    placeholder="Username"
                    value={donneesFormulaire.nomUtilisateur}
                    onChange={gererChangement}
                    required
                  />
                </div>

                {/* Champ pour le numéro de téléphone */}
                <div className="form-group">
                  <label>Numéro de téléphone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telephone"
                    placeholder="Téléphone"
                    value={donneesFormulaire.telephone}
                    onChange={gererChangement}
                    required
                  />
                </div>

                {/* Champ pour le courriel */}
                <div className="form-group">
                  <label htmlFor="champCourriel">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="champCourriel"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    name="courriel"
                    value={donneesFormulaire.courriel}
                    onChange={gererChangement}
                    required
                  />
                </div>

                {/* Champ pour le mot de passe */}
                <div className="form-group pb-3">
                  <label htmlFor="champMotDePasse">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="champMotDePasse"
                    placeholder="Password"
                    name="motDePasse"
                    value={donneesFormulaire.motDePasse}
                    onChange={gererChangement}
                    required
                  />

                  {/* Affiche les conditions non respectées du mot de passe */}
                  {donneesFormulaire.motDePasse.length > 0 && (
                    <div className="mt-2">
                      {conditionsMotDePasse.map((condition) =>
                        !condition.test ? (
                          <small
                            key={condition.label}
                            className="text-danger d-block"
                          >
                            {condition.label}
                          </small>
                        ) : null,
                      )}
                    </div>
                  )}
                </div>

                {/* Champ pour confirmer le mot de passe */}
                <div className="form-group">
                  <label htmlFor="champConfirmationMotDePasse">
                    Confirmation mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="champConfirmationMotDePasse"
                    placeholder="Confirmer mot de passe"
                    value={confirmationMotDePasse}
                    onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                    required
                  />

                  {/* Affiche un message si les deux mots de passe ne correspondent pas */}
                  {confirmationMotDePasse.length > 0 &&
                    donneesFormulaire.motDePasse !== confirmationMotDePasse && (
                      <small className="text-danger mt-2 d-block">
                        Les mots de passe ne correspondent pas.
                      </small>
                    )}
                </div>

                {/* Bouton pour envoyer le formulaire */}
                <button
                  type="submit"
                  className="btn btn-light border border-dark align-self-center px-4"
                >
                  Connexion
                </button>
              </form>

              {/* Texte informatif sur la protection du site */}
              <p className="pt-4">
                Ce site est protege par hCaptcha et sa politique de
                confidentialite et ses conditions d'utilisations s'appliquent
              </p>

              {/* Lien vers la page de connexion */}
              <div className="d-flex flex-column align-items-center gap-2 mt-3">
                <p>
                  Avez-vous déja un compte?{" "}
                  <Link to="/Connexion">Connectez-vous ici</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup affiché lorsqu'une erreur survient */}
      <Modal show={afficherPopup} onHide={fermerPopup} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{titrePopup}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{messagePopup}</Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={fermerPopup}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}