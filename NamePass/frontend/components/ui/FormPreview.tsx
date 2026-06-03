"use client";

type Props = {
  name: string;
  age: number;
  bio: string;
  rating: number;
  birthDate: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ fontSize: "1rem", letterSpacing: "2px" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? "#f59e0b" : "#d1d5db" }}>
          ★
        </span>
      ))}
    </span>
  );
}

function PreviewRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="preview-row">
      <span className="preview-label">{label}</span>
      <span className="preview-value">{value}</span>
    </div>
  );
}

export function FormPreview({ name, age, bio, rating, birthDate }: Props) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="preview-card">
      <div className="preview-header">
        <div className="preview-avatar">{initials}</div>
        <div>
          <p className="preview-name">{name || "Twoje imię"}</p>
          <p className="preview-sub">Podgląd profilu</p>
        </div>
      </div>

      <div className="preview-divider" />

      <div className="preview-body">
        <PreviewRow label="Wiek" value={age ? `${age} lat` : "—"} />
        <PreviewRow label="Data ur." value={birthDate || "—"} />
        <PreviewRow label="Ocena" value={<StarRating rating={rating} />} />
        <PreviewRow
          label="Bio"
          value={
            bio ? (
              <span style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{bio}</span>
            ) : (
              "—"
            )
          }
        />
      </div>

      <div className="preview-completeness">
        <span className="preview-completeness-label">Uzupełnienie</span>
        <div className="preview-bar-track">
          <div
            className="preview-bar-fill"
            style={{
              width: `${
                ([name, age, birthDate, rating, bio].filter(Boolean).length / 5) * 100
              }%`,
            }}
          />
        </div>
        <span className="preview-completeness-pct">
          {Math.round(
            ([name, age, birthDate, rating, bio].filter(Boolean).length / 5) * 100,
          )}
          %
        </span>
      </div>
    </div>
  );
}
