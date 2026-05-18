import { useState } from "react";

// Type des props reçues par le composant ChampModifiable
type ChampModifiableProps = {
  // Nom du champ affiché à gauche, ex: Username, Password
  label: string;

  // Valeur actuelle affichée quand on n'est pas en mode modification
  valeurAffichee: string;

  // Texte affiché dans le champ input
  placeholder: string;

  // Type du champ input, ex: text ou password
  type?: string;

  // Fonction appelée quand l'utilisateur confirme la nouvelle valeur
  onConfirm: (nouvelleValeur: string) => void | Promise<void>;
};

export default function ChampModifiable({
  label: nomValeur,
  valeurAffichee,
  placeholder,
  type = "text",
  onConfirm,
}: ChampModifiableProps) {
  // Indique si le champ est en mode modification ou non
  const [modeModification, setModeModification] = useState(false);

  // Contient la nouvelle valeur écrite par l'utilisateur
  const [nouvelleValeur, setNouvelleValeur] = useState("");

  // Annule la modification et vide le champ input
  function annulerModification() {
    setModeModification(false);
    setNouvelleValeur("");
  }

  // Confirme la modification et envoie la nouvelle valeur au parent
  async function confirmerModification() {
    // Empêche de confirmer une valeur vide
    if (nouvelleValeur.trim() === "") return;

    await onConfirm(nouvelleValeur);

    setModeModification(false);
    setNouvelleValeur("");
  }

  return (
    <div className="d-flex align-items-center mb-3 w-100">
      {/* Affiche le nom du champ et sa valeur actuelle */}
      <p className="mb-0">
        <strong>{nomValeur}:</strong> {!modeModification && valeurAffichee}
      </p>

      {/* Place les boutons et l'input à droite */}
      <div className="ms-auto d-flex align-items-center gap-2">
        {/* Affiche l'input seulement quand on est en mode modification */}
        {modeModification && (
          <input
            type={type}
            className="form-control"
            style={{ minWidth: "300px", maxWidth: "900px" }}
            placeholder={placeholder}
            value={nouvelleValeur}
            onChange={(e) => setNouvelleValeur(e.target.value)}
          />
        )}

        {/* Affiche le bouton Change si on n'est pas en mode modification */}
        {!modeModification ? (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setModeModification(true)}
          >
            Change
          </button>
        ) : (
          <>
            {/* Confirme la nouvelle valeur */}
            <button
              className="btn btn-success"
              type="button"
              onClick={confirmerModification}
            >
              Confirm
            </button>

            {/* Annule la modification */}
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={annulerModification}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}