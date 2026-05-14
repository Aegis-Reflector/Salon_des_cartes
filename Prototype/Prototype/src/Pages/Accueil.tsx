import special from "../images/Special.png";
import promo1 from "../images/promo1.png";
import promo2 from "../images/promo2.png";
import promo3 from "../images/promo3.png";
import promo4 from "../images/promo4.png";
import arrowLeft from "../images/flecheG.png";
import arrowRight from "../images/flecheD.png";
import CarteUI from "../components/CarteUI";
import { useState, useEffect, useRef } from "react";
import backgroundMusic from "../music/Pokemon Black & White Music Driftveil City Music.mp3"
import TCGdex from "@tcgdex/sdk";
import { Link } from "react-router-dom";
const tcgdex = new TCGdex("fr");

type PromoCardProps = {
  img: string;
  title: string;
  to : string;
};

type Carte = {
  id: string;
  name: string;
  image?: string;
  rarity?: string;
  setName?: string;
  number?: string;
  marketPrice?: number | null;
  localId?: string;
  category?: string;
  illustrator?: string;
  description?: string;
  set?: {
    name?: string;
  };
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

function melangerTableau(tableau: Carte[]) {
  const copie = [...tableau];

  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }

  return copie;
}

function PromoCard({ img, title, to }: PromoCardProps) {
  return (
  <Link
      to= {to}
      className="text-decoration-none text-dark"
      >
    <div className="position-relative overflow-hidden rounded border border-dark border-4">
      <img
        src={img}
        className="w-100"
        style={{ height: "250px", objectFit: "cover" }}
      />

      <div className="position-absolute top-0 start-0 m-3">
        <h1
          className="text-white fw-bold mb-4"
          style={{
            lineHeight: "1.1",
            textShadow: "3px 3px 10px rgba(0,0,0,0.9)",
          }}
        >
          {title}
        </h1>
      </div>

      <div className="position-absolute top-50 start-50   translate-middle-x mt-5">
        <button className="btn btn-light btn-lg px-4 py-2 fw-semibold btn-outline-dark">
          Parcourir
        </button>
      </div>
    </div>
    </Link>
  );
}

export default function Accueil() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [page, setPage] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  function toggleMusic() {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play();
      setMusicPlaying(true);
    }
  }


  localStorage.clear();
  sessionStorage.clear();

  async function voirCartes() {
    try {
      const data = await tcgdex.card.list();

      const cartesFormatees: Carte[] = data
        .filter((carte: any) => carte.image && carte.name)
        .map((carte: any) => ({
          id: carte.id,
          name: carte.name,
          image: carte.image + "/low.png",
          rarity: carte.rarity,
          marketPrice: null,
        }));
      const cartesMelangees = melangerTableau(cartesFormatees);
      const huitCartesRandom = cartesMelangees.slice(0, 8);
       
        
    setCartes(huitCartesRandom);
    setPage(1);
   const cartesCompletes: Carte[] = await Promise.all(
      huitCartesRandom.map(async (carte) => {
        try {
          const res = await fetch(
            `https://api.tcgdex.net/v2/fr/cards/${carte.id}`,
          );

          if (!res.ok) {
            return carte;
          }

          const detail = await res.json();

          const cardmarket = detail.pricing?.cardmarket;

          const marketPrice =
            cardmarket?.avg ??
            cardmarket?.trend ??
            cardmarket?.low ??
            cardmarket?.["avg-holo"] ??
            cardmarket?.["trend-holo"] ??
            cardmarket?.["low-holo"] ??
            null;

          return {
            id: detail.id,
            name: detail.name,
            image: detail.image ? detail.image + "/low.png" : carte.image,
            rarity: detail.rarity ?? carte.rarity,
            setName: detail.set?.name,
            number: detail.localId,
            marketPrice,
          };
        } catch (error) {
          console.error("Erreur detail carte:", carte.id, error);
          return carte;
        }
      }),
    );

    setCartes(cartesCompletes);
  } catch (error) {
    console.error("Erreur TCGdex :", error);
  }
}


  // useEffect appelé au chargement de la page pour aller chercher les cartes
  useEffect(() => {
    voirCartes();
  }, []);

  const produitsParPage = 4;
  const totalPages = Math.max(1, Math.ceil(cartes.length / produitsParPage));

  // Produits affichés pour la page actuelle
  const produitsAffiches = cartes.slice(
    (page - 1) * produitsParPage,
    page * produitsParPage,
  );
  // Fonction pour récupérer les cartes depuis le backend


  return (
    
    <div className="container-fluid p-5">
      <audio ref={audioRef} src={backgroundMusic} loop />
      
      {/* Grande section spéciale */}
      <div className="position mb-4">
        <img
          src={special}
          className="w-100 rounded"
          style={{ height: "310px", objectFit: "cover" }}
        />

        <div className="position-absolute top-50 start-0 translate-middle-y ms-5">
          <h1 className="text-white display-4 fw-bold text-center"></h1>
           <button
          className="btn btn-sm btn-outline-secondary position-fixed bottom-0 end-0 m-3"
          style={{ zIndex: 9999 }}
          type="button"
          onClick={toggleMusic}
        >
          {musicPlaying ? " Pause" : " Play"}
      </button>
        </div>
      </div>

      {/* 4 blocs promo */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <PromoCard img={promo1} title="Aquapolis" to={`/Catalogue?set=${encodeURIComponent("Aquapolis")}`}/>
        </div>

        <div className="col-md-6">
          <PromoCard img={promo2} title="Neo Discovery" to={`/Catalogue?set=${encodeURIComponent("Neo Discovery")}`}/>
        </div>

        <div className="col-md-6">
          <PromoCard img={promo3} title="Faille Paradoxe" to={`/Catalogue?set=${encodeURIComponent("Faille Paradoxe")}`} />
        </div>

        <div className="col-md-6">
          <PromoCard img={promo4} title="Destinées de Paldea" to= {`/Catalogue?set=${encodeURIComponent("Destinées de Paldea")}`}/>
        </div>
      </div>

      {/* Section Vedette */}
      <h2 className="text-uppercase mb-4 fw-normal">En vedette</h2>

      <div className="row g-4 mx-0">
        {produitsAffiches.map((carte) => (
          <div key={carte.id} className="col-lg-3 col-md-6 col">
            <CarteUI carte={carte} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="row mt-4">
        <div className="col text-center">
          <button
            className="btn btn-outline-dark me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <img
              src={arrowLeft}
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
            onClick={() => setPage(page + 1)}
          >
            <img
              src={arrowRight}
              alt="page suivante"
              style={{ width: "18px" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
