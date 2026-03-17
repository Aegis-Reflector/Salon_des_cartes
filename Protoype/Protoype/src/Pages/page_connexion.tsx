import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function PageConnexion() {
  const navigate = useNavigate();

  // État qui contient les données du formulaire de connexion
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //met à jour la valeur correspondante dans le state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //Fonction appelée lors de la soumission du forms
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Envoie une requête POST au serveur pour vérifier les informations de connexion
    fetch("http://localhost:4000/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        //Si la connexion est un success
        if (data.success) {
          if (formData.email === "admin@pokemon.com") {
            navigate("/admin"); //Redirection a la page admin
          } else {
            navigate("/Accueil"); //Redirection a la page accueil
          }
        } else {
          //Si les informations sont incorrects
          alert("Email ou mot de passe incorrect");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="container-fluid bg-light min-vh-100 px-0 mx-0">
        <div className="row min-vh-100 g-0 mx-0">
          {/*Colonne rouge a gauche de l'ecran*/}
          <div className="col-3 bg-danger"></div>

          {/*Colonne droite de l'ecran*/}
          <div className="col-9  bg-light d-flex justify-content-center align-items-center">
            <div>
              {/*Titre de la page*/}
              <h3>Connectez-vous à Salon de Carte</h3>

              {/*Formulaire de connexion */}
              <form
                className="bg-light border border-dark rounded p-5 text-secondary d-flex flex-column gap-3"
                onSubmit={handleSubmit}
              >
                {/* Champ pour l'email */}
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
                {/* Champ pour le mot de passe  */}
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
                {/* Button pour envoyer le formulaire  */}
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

              {/* Lien vers la page d'inscription */}
              <div className="d-flex flex-column align-items-center gap-2 mt-3">
                <p>
                  Vous n'avez pas encore de compte? {""}
                  <Link to="/Inscription" className="">
                    Inscrivez-vous ici
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
