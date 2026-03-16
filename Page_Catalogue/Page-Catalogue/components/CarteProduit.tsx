type templateCarte = {
  nom: string;
  prix: number;
  inventaire: number;
  image: string;
};

export default function CarteProduit({
  nom,
  prix,
  inventaire,
  image,
}: templateCarte) {
  return (
    <div className="card p-3" style={{width : "300px"}}>
      <div className="d-flex">
        <img
          src={image}
          alt={nom}
          style={{
            width: "120px",
            height: "160px",
            objectFit: "cover",
          }}
        />

        <div className="card-body text-center">
          <h5 className="card-title">{nom}</h5>
          <p className="text-muted mb-1">Inventaire: {inventaire}</p>
          <h4 className="text-black">${prix}</h4>
        </div>
      </div>
    </div>
  );
}
