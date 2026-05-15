import { useState } from "react";

type ChampModifiableProps = {
  label: string;
  valeurAffichee: string;
  placeholder: string;
  type?: string;
  onConfirm: (nouvelleValeur: string) => void;
};

export default function ChampModifiable({
  label: nomValeur,
  valeurAffichee,
  placeholder,
  type = "text",
  onConfirm,
}: ChampModifiableProps) {
  const [modeModification, setModeModification] = useState(false);
  const [nouvelleValeur, setNouvelleValeur] = useState("");

  function annulerModification() {
    setModeModification(false);
    setNouvelleValeur("");
  }

  function confirmerModification() {
    onConfirm(nouvelleValeur);
    setModeModification(false);
    setNouvelleValeur("");
  }

  return (
    <div className="d-flex align-items-center mb-3 w-100">
      <p className="mb-0">
        <strong>{nomValeur}:</strong> {!modeModification && valeurAffichee}
      </p>

      <div className="ms-auto d-flex align-items-center gap-2">
        {modeModification && (
          <input
            type={type}
            className="form-control"
            style={{ width: "900px" }}
            placeholder={placeholder}
            value={nouvelleValeur}
            onChange={(e) => setNouvelleValeur(e.target.value)}
          />
        )}

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
            <button
              className="btn btn-success"
              type="button"
              onClick={confirmerModification}
            >
              Confirm
            </button>

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
