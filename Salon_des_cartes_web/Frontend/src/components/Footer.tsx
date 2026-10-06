import { Link } from "react-router";

const lienCatalogue = "/Catalogue";
const lienSupport = "/Support"
const lienFooter = "text-white text-decoration-none";


function Footer() {
  return (
    <footer className="bg-black text-white pt-4 pb-4 mt-0">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Boutique</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Packs Booster
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Boites Dresseur d'Elite
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Cartes Promotionnelles
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Cartes Rares
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Toutes les Cartes Pokemon
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Acheter</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Nouvelles Sorties
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Meilleures Ventes
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Cartes Populaires
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Editions Limitees
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Collections Speciales
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Aide et Contact</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={lienSupport} className={lienFooter}>
                  Politique de Retour et Remboursement
                </Link>
              </li>
              <li>
                <Link to={lienSupport} className={lienFooter}>
                  Informations sur la Livraison
                </Link>
              </li>
            </ul>
            <p className="mt-3 small text-secondary">
              <strong>Telephone :</strong> (514) 332-3000
              <br />
              <strong>Etablissement :</strong> Cegep Bois-de-Boulogne
            </p>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">A propos</h5>
            <ul className="list-unstyled">
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  A propos de nous
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Information sur le projet
                </Link>
              </li>
              <li>
                <Link to={lienCatalogue} className={lienFooter}>
                  Etudiants developpeurs
                </Link>
              </li>
            </ul>

            <p className="mt-3 small text-secondary">
              Ce site est un projet scolaire realise par trois etudiants du
              programme informatique du
              <strong> Cegep Bois-de-Boulogne</strong>.
            </p>
          </div>
        </div>

        <div className="border-top border-secondary pt-3 mt-4 text-center small text-secondary">
          © 2026 Boutique de cartes Pokemon - Projet etudiant du Cegep
          Bois-de-Boulogne
        </div>
      </div>
    </footer>
  );
}

export default Footer;
