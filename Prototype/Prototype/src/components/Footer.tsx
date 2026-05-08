import { Link } from "react-router";
function Footer() {
  return (
    <footer className="bg-black text-white pt-4 pb-4 mt-0">
      <div className="container-fluid">
        <div className="row">
          {/* Boutique */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Boutique</h5>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/boosters"
                  className="text-white text-decoration-none"
                >
                  Packs Booster
                </Link>
              </li>
              <li>
                <Link to="/elite" className="text-white text-decoration-none">
                  Boîtes Dresseur d'Élite
                </Link>
              </li>
              <li>
                <Link to="/promo" className="text-white text-decoration-none">
                  Cartes Promotionnelles
                </Link>
              </li>
              <li>
                <Link to="/rares" className="text-white text-decoration-none">
                  Cartes Rares
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue"
                  className="text-white text-decoration-none"
                >
                  Toutes les Cartes Pokémon
                </Link>
              </li>
            </ul>
          </div>

          {/* Acheter */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Acheter</h5>
            <ul className="list-unstyled">
              <li>Nouvelles Sorties</li>
              <li>Meilleures Ventes</li>
              <li>Cartes Populaires</li>
              <li>Éditions Limitées</li>
              <li>Collections Spéciales</li>
            </ul>
          </div>

          {/* Aide et Contact */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Aide et Contact</h5>

            <ul className="list-unstyled">
              <li>
                <Link to="/retours" className="text-white text-decoration-none">
                  Politique de Retour et Remboursement
                </Link>
              </li>
              <li>
                <Link
                  to="/livraison"
                  className="text-white text-decoration-none"
                >
                  Informations sur la Livraison
                </Link>
              </li>
            </ul>
            <p className="mt-3 small text-secondary">
             <strong>Téléphone :</strong> (514) 332-3000
              <br />
             <strong>Établissement :</strong> Cégep Bois-de-Boulogne
            </p>
          </div>

          {/* À propos */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">À propos</h5>
            <ul className="list-unstyled">
              <li>À propos de nous</li>
              <li>Information sur le projet</li>
              <li>Étudiants développeurs</li>
            </ul>

            <p className="mt-3 small text-secondary">
              Ce site est un projet scolaire réalisé par trois étudiants du
              programme informatique du
              <strong> Cégep Bois-de-Boulogne</strong>.
            </p>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="border-top border-secondary pt-3 mt-4 text-center small text-secondary">
          © 2026 Boutique de cartes Pokémon - Projet étudiant du Cégep
          Bois-de-Boulogne
        </div>
      </div>
    </footer>
  );
}

export default Footer;
