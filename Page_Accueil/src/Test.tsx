

                  /* TEST CSS Est seulement utilisé pour les tests de route */

import "./test.css";


type CarteVedette = {
  title: string;
  description: string;
};

function FeaturedCard({ title, description }: CarteVedette) {
  return (
    <article className="card">
      <div className="cardImage" aria-hidden="true" />
      <h4 className="cardTitle">{title}</h4>
      <p className="cardDesc">{description}</p>
    </article>
  );
}

export default function HomePage() {
  const featured: CarteVedette[] = Array.from({ length: 8 }).map(() => ({
    title: "Mega Gengar ex",
    description: "Texte placeholder...",
  }));

  return (
    <div className="page">
      {/* TOP BAR */}


      {/* MENU */}


      {/* PAGE CONTENT */}
      <main className="content container">
        {/* BANNER (placeholder image) */}
        <section className="banner" aria-label="Bannière" />

        {/* SPECIAL BIG */}
        <section className="special">
          <div className="specialOverlay">
            <h1>Spéciale</h1>
            <button>Acheter maintenant</button>
          </div>
        </section>

        {/* PROMOS 2x2 */}
        <section className="promoGrid" aria-label="Promotions">
          {[
            "Incontournables",
            "Édition limitée",
            "Les plus rares",
            "Nouveautés",
          ].map((t) => (
            <div className="promo" key={t}>
              <span className="promoTag">{t}</span>
              <div className="promoCenter">
                <button>Acheter maintenant</button>
              </div>
            </div>
          ))}
        </section>

        {/* FEATURED */}
        <section className="featured">
          <h3 className="featuredTitle">EN VEDETTE</h3>

          <div className="featuredWrap">
            <button className="arrow" aria-label="Précédent">‹</button>

            <div className="featuredRow">
              {featured.map((item, i) => (
                <FeaturedCard
                  key={i}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>

            <button className="arrow" aria-label="Suivant">›</button>
          </div>

      
        </section>
      </main>
    </div>
  );
}
