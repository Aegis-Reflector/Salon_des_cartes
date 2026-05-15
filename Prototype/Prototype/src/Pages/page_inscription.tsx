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

  // Define your requirements
  const requirements = [
    { label: "At least 6 characters", test: formData.password.length >= 6 },
    { label: "At least one number", test: /\d/.test(formData.password) },
    {
      label: "At least one special character",
      test: /[!@#$%^&*]/.test(formData.password),
    },
  ];

  // État pour afficher/cacher le popup
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const afficherModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
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

    const passwordValide = requirements.every(
      (requirement) => requirement.test,
    );
    // Vérifie si le mot de passe correspond à sa confirmation
    if (formData.password != confirmPassword ) {
      afficherModal(
        "Mot de passe invalide",
        "Les mots de passe ne correspondent pas.",
      );
      return;
    }

    if (!passwordValide ) {
      afficherModal(
        "Mot de passe invalide",
        "Les mots de passe doivent respecter tous les conditions.",
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
        nomUtilisateur: formData.nomUtilisateur,
        telephone: formData.telephone,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur de creation");
        }
        return res.json();
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        afficherModal("Erreur de creation", err);
      });
  };
  return (
    <>
      <div className="container-fluid bg-light min-vh-100 p-0">
        <div className="row min-vh-100 g-0">
          {/* Colonne rouge gauche */}
          <div className="col-3 bg-dark"></div>

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
                    required
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
                    required
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
                    required
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
                    required
                  />

                  {/* Test de password pour voir si il suit les requirements */}
                  {formData.password.length > 0 && (
                    <div className="mt-2">
                      {requirements.map((requirement) =>
                        !requirement.test ? (
                          <small
                            key={requirement.label}
                            className="text-danger d-block"
                          >
                            {requirement.label}
                          </small>
                        ) : null,
                      )}
                    </div>
                  )}
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
                    required
                  />
                  {confirmPassword.length > 0 &&
                    formData.password !== confirmPassword && (
                      <small className="text-danger mt-2 d-block">
                        Les mots de passe ne correspondent pas.
                      </small>
                    )}
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
