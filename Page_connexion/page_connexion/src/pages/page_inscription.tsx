import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function PageInscription() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password != confirmPassword) {
      alert("Les emails ne correspondent pas");
      return;
    }

    fetch("http://localhost:4000/inscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Compte creer !");
          navigate("/Accueil");
        } else {
          alert("Erreur de creation");
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <div className="container-fluid bg-light min-vh-100 p-0">
        <div className="row min-vh-100 g-0">
          <div className="col-3 bg-danger"></div>
          <div className="col-9  bg-light d-flex justify-content-center align-items-center">
            <div>
              <h3>Inscrivez-vous à Salon de Carte</h3>

              <form
                className="bg-light border border-dark rounded p-5 text-secondary d-flex flex-column gap-3"
                onSubmit={handleSubmit}
              >
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              <div className=" alight-self-center px-4">
                <p> Vous n'avez pas encore de compte? </p>
                <Link to="/Connexion" className="">
                  Connectez-vous ici
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
