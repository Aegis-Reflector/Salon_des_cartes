import { Link } from "react-router";

export default function PageConnexion() {
  return (
    <>
      <div className="container-fluid bg-light min-vh-100 p-0">
        <div className="row min-vh-100 g-0">
          <div className="col-3 bg-danger"></div>
          <div className="col-9  bg-light d-flex justify-content-center align-items-center">
            <div>
              <h3>Connectez-vous à Salon de Carte</h3>

              <form className="bg-light border border-dark rounded p-5 text-secondary d-flex flex-column gap-3">
                <div className="form-group ">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group pb-3">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
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
                <Link to="/Inscription" className="">
                  Inscrivez-vous ici
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
