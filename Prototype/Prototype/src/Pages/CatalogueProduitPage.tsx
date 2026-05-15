import { useEffect, useState } from "react";
import TCGdex, { Query } from "@tcgdex/sdk";
import CarteUI from "../components/CarteUI";
import flecheG from "../images/flecheG.png";
import flecheD from "../images/flecheD.png";
import { useSearchParams } from "react-router-dom";

const tcgdex = new TCGdex("fr");

const eurToUsd = (eur: number) => eur * 1.18;

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
  localId?: string;
  category?: string;
  setId?: string;
  setName?: string;
  illustrator?: string;
  description?: string;
  set?: {
    name?: string;
  };
  marketPrice?: number | null;
  pricing?: {
    cardmarket?: {
      avg?: number;
      trend?: number;
      low?: number;
      "avg-holo"?: number;
      "trend-holo"?: number;
      "low-holo"?: number;
    };
  };
};

type SetOption = {
  id: string;
  name: string;
};

export default function CatalogueProduitPage() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [raretesOptions, setRaretesOptions] = useState<string[]>([]);
  const [setsOptions, setSetsOptions] = useState<SetOption[]>([]);
  const [totalPages, setTotalPages] = useState(12);
  const [chargement, setChargement] = useState(true);
  const [searchParams] = useSearchParams();
  const recherche = searchParams.get("recherche") || "";


  const [rareteFiltre, setRareteFiltre] = useState(
    searchParams.get("rarete") || "",
  );
  const [setFiltre, setSetFiltre] = useState(searchParams.get("set") || "");
  const [prixMin, setPrixMin] = useState(searchParams.get("prixMin") || "");
  const [prixMax, setPrixMax] = useState(searchParams.get("prixMax") || "");
  const [triPrix, setTriPrix] = useState("");

  const [page, setPage] = useState(1);
  const cartesParPage = 9;
  const pagesMaxParFiltre = 4;

 async function chargerSets() {
  try {
    const data = await tcgdex.set.list(Query.create().sort("name", "ASC"));
    setSetsOptions(data.map((set: any) => ({ id: set.id, name: set.name })));
  } catch (error) {
    console.error("Erreur séries TCGdex:", error);
  }
}

 async function chargerRaretes() {
  try {
    const data = await tcgdex.rarity.list();
    setRaretesOptions(data.map(String).sort());
  } catch (error) {
    console.error("Erreur raretés TCGdex:", error);
  }
}

 async function chargerCartes() {
  try {
    setChargement(true);

    const convertirCarte = async (carte: any): Promise<Carte | null> => {
      try {
        const detail: any = await tcgdex.card.get(carte.id);

        const cm = detail.pricing?.cardmarket;

        const marketPriceEur =
          cm?.avg ??
          cm?.trend ??
          cm?.low ??
          cm?.["avg-holo"] ??
          cm?.["trend-holo"] ??
          cm?.["low-holo"] ??
          null;

        const marketPrice =
          marketPriceEur == null ? null : eurToUsd(marketPriceEur);

        return {
          id: detail.id,
          name: detail.name,
          image: detail.image ? detail.image + "/low.png" : undefined,
          rarity: detail.rarity,
          setId: detail.set?.id,
          setName: detail.set?.name,
          localId: detail.localId,
          marketPrice,
        };
      } catch {
        return null;
      }
    };

    const remplirPage = async (
      cartesCandidates: any[],
      garderCarte: (carte: Carte) => boolean = () => true,
    ) => {
      const cartesValides: Carte[] = [];

      for (const carte of cartesCandidates) {
        const carteConvertie = await convertirCarte(carte);

        if (carteConvertie?.image && garderCarte(carteConvertie)) {
          cartesValides.push(carteConvertie);
        }

        if (cartesValides.length === cartesParPage) {
          break;
        }
      }

      return cartesValides;
    };

    let cartesBase: any[] = [];
    let nouveauTotalPages = 12;

    if (setFiltre !== "") {
      const setDetail: any = await tcgdex.set.get(setFiltre);
      const cartesDuSet = setDetail?.cards ?? [];
      const cartesRecherchees =
        recherche === ""
          ? cartesDuSet
          : cartesDuSet.filter((c: any) =>
              c.name?.toLowerCase().includes(recherche.toLowerCase()),
            );
      nouveauTotalPages = Math.max(
        1,
        Math.min(
          pagesMaxParFiltre,
          Math.ceil(cartesRecherchees.length / cartesParPage),
        ),
      );
      cartesBase = cartesRecherchees.slice(
        (page - 1) * cartesParPage,
      );
    } else if (rareteFiltre !== "") {
      const rareteDetail: any = await tcgdex.rarity.get(rareteFiltre);
      const cartesParRarete = rareteDetail?.cards ?? [];
      const cartesRecherchees =
        recherche === ""
          ? cartesParRarete
          : cartesParRarete.filter((c: any) =>
              c.name?.toLowerCase().includes(recherche.toLowerCase()),
            );

      nouveauTotalPages = Math.max(
        1,
        Math.min(
          pagesMaxParFiltre,
          Math.ceil(cartesRecherchees.length / cartesParPage),
        ),
      );
      cartesBase = cartesRecherchees.slice(
        (page - 1) * cartesParPage,
      );
    } else {
      let query = Query.create()
        .sort("name", "ASC")
        .paginate(page, cartesParPage * 4);

      if (recherche !== "") {
        query = query.contains("name", recherche);
      }

      const data = await tcgdex.card.list(query);
      cartesBase = data;
    }

    const cartesValides = await remplirPage(
      cartesBase,
      (carte) => rareteFiltre === "" || carte.rarity === rareteFiltre,
    );

    setTotalPages(nouveauTotalPages);
    setCartes(cartesValides);
  } catch (error) {
    console.error("Erreur TCGdex:", error);
  } finally {
    setChargement(false);
  }
}

  useEffect(() => {
    chargerRaretes();
    chargerSets();
  }, []);

  useEffect(() => {
    setRareteFiltre(searchParams.get("rarete") || "");
    setSetFiltre(searchParams.get("set") || "");
    setPrixMin(searchParams.get("prixMin") || "");
    setPrixMax(searchParams.get("prixMax") || "");
    setTriPrix(searchParams.get("triPrix") || "");
    setPage(1)
  },  [searchParams]);

  useEffect(()=>{
    chargerCartes();
  }, [page, recherche, rareteFiltre, setFiltre]);


  const cartesFiltrees = cartes.filter((carte) => {

    const matchRarete = rareteFiltre === "" || carte.rarity === rareteFiltre;

    const prix = carte.marketPrice;

    const matchPrixMin =
      prixMin === "" ||
      (prix !== null && prix !== undefined && prix >= Number(prixMin));

    const matchPrixMax =
      prixMax === "" ||
      (prix !== null && prix !== undefined && prix <= Number(prixMax));

    return matchRarete && matchPrixMin && matchPrixMax;
  });

const cartesAffichees = [...cartesFiltrees].sort((a, b) => {
  if (triPrix === "") {
    return 0;
  }

  const prixA = a.marketPrice ?? Number.POSITIVE_INFINITY;
  const prixB = b.marketPrice ?? Number.POSITIVE_INFINITY;

  return triPrix === "asc" ? prixA - prixB : prixB - prixA;
});

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
            {raretesOptions.map((rarete) => (
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
            {setsOptions.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name}
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

          <select
            className="form-select w-auto"
            value={triPrix}
            onChange={(e) => {
              setTriPrix(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Trier par prix</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>

          <button
            className="btn btn-light"
            onClick={() => {
              setRareteFiltre("");
              setSetFiltre("");
              setPrixMin("");
              setPrixMax("");
              setTriPrix("");
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

             <span className="mx-2">Page {page}/{totalPages}</span>

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
