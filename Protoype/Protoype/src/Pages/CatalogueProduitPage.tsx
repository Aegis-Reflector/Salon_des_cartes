import { useEffect, useState } from "react";
import TCGdex from "@tcgdex/sdk";
import CarteUI from "../components/CarteUI";
import flecheG from "../images/flecheG.png";
import flecheD from "../images/flecheD.png";

const tcgdex = new TCGdex("fr");

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
  setName?: string;
  number?: string;
  marketPrice?: number | null;
};

export default function CatalogueProduitPage() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [chargement, setChargement] = useState(true);

  
  const [rareteFiltre, setRareteFiltre] = useState("");
  const [setFiltre, setSetFiltre] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");

  const [page, setPage] = useState(1);
  const cartesParPage = 9;

  async function chargerCartes() {
    try {
      setChargement(true);

      const data = await tcgdex.card.list();

      const cartesBase = data.filter((c: any) => c.image && c.name);

      const convertirCarte = async (carte: any): Promise<Carte | null> => {
        try {
          const detail: any = await tcgdex.card.get(carte.id);

          const cm = detail.pricing?.cardmarket;

          const marketPrice =
            cm?.avg ??
            cm?.trend ??
            cm?.low ??
            cm?.["avg-holo"] ??
            cm?.["trend-holo"] ??
            cm?.["low-holo"] ??
            null;

          return {
            id: detail.id,
            name: detail.name,
            image: detail.image ? detail.image + "/low.png" : undefined,
            rarity: detail.rarity,
            setName: detail.set?.name,
            number: detail.localId,
            marketPrice,
          };
        } catch {
          return null;
        }
      };

      const tailleLot = 50;
      const toutesLesCartes: Carte[] = [];

      for (let i = 0; i < cartesBase.length; i += tailleLot) {
        const lot = cartesBase.slice(i, i + tailleLot);

        const cartesLot = await Promise.all(
          lot.map((carte: any) => convertirCarte(carte)),
        );

        const cartesValides = cartesLot.filter(
          (carte): carte is Carte => carte !== null,
        );

        toutesLesCartes.push(...cartesValides);
        setCartes([...toutesLesCartes]);

        if (i === 0) {
          setChargement(false);
        }
      }
    } catch (error) {
      console.error("Erreur TCGdex:", error);
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    chargerCartes();
  }, []);

  const raretes = [...new Set(cartes.map((c) => c.rarity).filter(Boolean))];
  const sets = [...new Set(cartes.map((c) => c.setName).filter(Boolean))];

  const cartesFiltrees = cartes.filter((carte) => {
    
    const matchRarete = rareteFiltre === "" || carte.rarity === rareteFiltre;

    const matchSet = setFiltre === "" || carte.setName === setFiltre;

    const prix = carte.marketPrice;

    const matchPrixMin =
      prixMin === "" ||
      (prix !== null && prix !== undefined && prix >= Number(prixMin));

    const matchPrixMax =
      prixMax === "" ||
      (prix !== null && prix !== undefined && prix <= Number(prixMax));

    return (
       matchRarete && matchSet && matchPrixMin && matchPrixMax
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(cartesFiltrees.length / cartesParPage),
  );

  const cartesAffichees = cartesFiltrees.slice(
    (page - 1) * cartesParPage,
    page * cartesParPage,
  );


  return (
    <>
      <div className="container-fluid bg-danger py-3">
        <div className="d-flex gap-3 flex-wrap">
          <select
            className="form-select w-auto"
            value={rareteFiltre}
            onChange={(e) => {
              setRareteFiltre(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes les raretés</option>
            {raretes.map((rarete) => (
              <option key={rarete} value={rarete}>
                {rarete}
              </option>
            ))}
          </select>

          <select
            className="form-select w-auto"
            value={setFiltre}
            onChange={(e) => {
              setSetFiltre(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toutes les séries</option>
            {sets.map((set) => (
              <option key={set} value={set}>
                {set}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="form-control w-auto"
            placeholder="Prix min"
            value={prixMin}
            onChange={(e) => {
              setPrixMin(e.target.value);
              setPage(1);
            }}
          />

          <input
            type="number"
            className="form-control w-auto"
            placeholder="Prix max"
            value={prixMax}
            onChange={(e) => {
              setPrixMax(e.target.value);
              setPage(1);
            }}
          />

          <button
            className="btn btn-light"
            onClick={() => {
            
              setRareteFiltre("");
              setSetFiltre("");
              setPrixMin("");
              setPrixMax("");
              setPage(1);
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="container-fluid mt-4 px-4">
        {chargement ? (
          <h4 className="text-center">Chargement des cartes...</h4>
        ) : cartesAffichees.length === 0 ? (
          <h4 className="text-center">Aucune carte trouvée.</h4>
        ) : (
          <>
            <p className="text-muted">
              {cartesFiltrees.length} carte(s) trouvée(s)
            </p>

            <div className="row g-4">
              {cartesAffichees.map((carte) => (
                <div key={carte.id} className="col-lg-4 col-md-6 col-sm-12">
                  <CarteUI carte={carte} />
                </div>
              ))}
            </div>

            <div className="text-center mt-4 mb-4">
              <button
                className="btn btn-outline-dark me-2"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <img
                  src={flecheG}
                  alt="page précédente"
                  style={{ width: "18px" }}
                />
              </button>

              <span className="mx-2">
                Page {page} / {totalPages}
              </span>

              <button
                className="btn btn-outline-dark ms-2"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <img
                  src={flecheD}
                  alt="page suivante"
                  style={{ width: "18px" }}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
