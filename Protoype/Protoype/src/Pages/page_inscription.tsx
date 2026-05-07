import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Modal, Button } from "react-bootstrap";

export default function PageInscription() {
  //pour naviguer vers une autre page après l'inscription
  const navigate = useNavigate();
  //Form État qui contient les données du formulaire de connexion
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nomUtilisateur: "",
    telephone: "",
  });

  //Champ pour confirmer le mot de passe
  const [confirmPassword, setConfirmPassword] = useState("");

  // État pour afficher/cacher le popup
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const afficherModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };
  // Fonction pour ouvrir le popup d'erreur
  const afficherErreurConnexion = () => {
    setShowModal(true);
  };
  // Fonction pour fermer le popup d'erreur
  const fermerModal = () => {
    setShowModal(false);
  };

  // Fonction qui met à jour le state à chaque changement dans un input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifie si le mot de passe correspond à sa confirmation
    if (formData.password != confirmPassword) {
      afficherModal(
        "Mot de passe invalide",
        "Les mots de passe ne correspondent pas.",
      );
      return;
    }

    // Envoi des données au serveur pour créer le compte
    fetch("http://localhost:4000/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        courriel: formData.email,
        motDePasse: formData.password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur de creation");
        }
        return res.json();
      })
      .then(() => {
        afficherModal("Compte créé", "Votre compte a été créé avec succès!");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        afficherErreurConnexion();
      });
  };
  return (
    <>
      <div className="container-fluid bg-light min-vh-100 p-0">
        <div className="row min-vh-100 g-0">
          {/* Colonne rouge gauche */}
          <div className="col-3 bg-danger"></div>

          {/* Colonne gauche décorative */}
          <div className="col-9  bg-light d-flex justify-content-center align-items-center">
            <div>
              {/* Titre de la page */}
              <h3>Inscrivez-vous à Salon de Carte</h3>

              {/* Formulaire d'inscription */}
              <form
                className="bg-light border border-dark rounded p-5 text-secondary d-flex flex-column gap-3"
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nomUtilisateur"
                    placeholder="Username"
                    value={formData.nomUtilisateur}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label>Numéro de téléphone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telephone"
                    placeholder="Téléphone"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                </div>
                {/* Champ email */}
                <div className="form-group ">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {/* Champ mot de passe */}
                <div className="form-group pb-3">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Champ confirmation de mot de passe */}
                <div className="form-group ">
                  <label htmlFor="exampleInputPassword1">
                    Confirmation mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Confirmer mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} //Mettre a jour dependant du changement du champ mot de passe
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-light border border-dark align-self-center px-4"
                >
                  Connexion
                </button>
              </form>

              <p className="pt-4">
                Ce site est protege par hCaptcha et sa politique de
                confidentialite et ses conditions d'utilisations s'appliquent
              </p>

              {/* Lien vers la page de connecion */}
              <div className="d-flex flex-column align-items-center gap-2 mt-3">
                <p>
                  Avez-vous déja un compte? {""}
                  <Link to="/Connexion" className="">
                    Connectez-vous ici
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup erreur connexion */}
      <Modal show={showModal} onHide={fermerModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>
        
        <Modal.Footer>
          <Button variant="danger" onClick={fermerModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
