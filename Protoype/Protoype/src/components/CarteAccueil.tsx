import { Link } from "react-router";
type templateCarte = {
  nom: string;
  prix: number;
  inventaire: number;
  image: string;
  id?: number;
};

export default function CarteProduit({
  nom,
  prix,
  inventaire,
  image,
}: templateCarte) {
  return (
    <div className="card h-100 shadow-sm text-center">

      <img
        src={image}
        alt={nom}
        className="card-img-top"
        style={{
          height: "160px",
          objectFit: "cover",
        }}
      />

      <div className="card-body">

        <h5 className="card-title fw-bold">{nom}</h5>

        <p className="text-muted mb-1">
          Inventaire: {inventaire}
        </p>

        <h4 className="text-dark">${prix}</h4>

      </div>
     {/* Bouton détail */}
        <Link
          to={`/carte/${nom}`}
          className="btn btn-dark btn-lg "
        >
          <p className="mb-0 fw-semibold">Acheter</p>
        </Link>
    </div>
  );
}