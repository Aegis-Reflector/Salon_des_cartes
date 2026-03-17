import { Link } from "react-router";
import profile from "../images/profile.png";
import panier from "../images/grocery-store.png";
import loupe from "../images/loupe.png";
import logo from "../images/logo.png";

function Header() {
  return (
    <>
      {/* NAVBAR PRINCIPALE */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
        <div className="container-fluid">

          {/* LOGO */}
          <Link to="/" className="navbar-brand">
            <img
              src={logo}
              alt="Logo"
              style={{ height: "100px" }}
            />
          </Link>

          {/* BOUTON MOBILE */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* CONTENU NAVBAR */}
          <div className="collapse navbar-collapse" id="mainNavbar">

            {/* BARRE RECHERCHE CENTRÉE */}
            <form className="d-flex mx-auto w-50">
              <input
                className="form-control"
                type="search"
                placeholder="Rechercher une carte Pokémon"
              />

              <button className="btn btn-outline-secondary">
                <img src={loupe} alt="Recherche" width="18" />
              </button>
            </form>

            {/* DROITE NAVBAR */}
            <ul className="navbar-nav align-items-center gap-3">

              <li className="nav-item">
                <Link to="/connexion" className="nav-link fw-bold">
                  Se connecter
                </Link>
              </li>

              {/* DROPDOWN PROFIL */}
              <li className="nav-item dropdown">

                <button
                  className="btn nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <img src={profile} alt="Profil" width="28" />
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link to="/Profil" className="dropdown-item">
                      Profil
                    </Link>
                  </li>

                  <li>
                    <Link to="/Parametres" className="dropdown-item">
                      Paramètres
                    </Link>
                  </li>

                  <li>
                    <button className="dropdown-item">
                      Déconnexion
                    </button>
                  </li>
                </ul>

              </li>

              {/* PANIER */}
              <li className="nav-item">
                <Link to="/Panier" className="nav-link">
                  <img src={panier} alt="Panier" width="28" />
                </Link>
              </li>

            </ul>

          </div>
        </div>
      </nav>

      {/* MENU SECONDAIRE */}
      <nav className="navbar navbar-expand bg-black">
        <div className="container-fluid justify-content-center">

          <ul className="navbar-nav gap-4">

            <li className="nav-item">
              <Link to="/" className="nav-link text-white fw-bold">
                Accueil
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/Catalogue" className="nav-link text-white fw-bold">
                Catalogue
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/populaire" className="nav-link text-white fw-bold">
                Populaire
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/special" className="nav-link text-white fw-bold">
                Spécial
              </Link>
            </li>

          </ul>

        </div>
      </nav>
    </>
  );
}

export default Header;