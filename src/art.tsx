import type { Category } from "./catalog";
export function Picture({
  kind,
  className = "",
}: {
  kind: Category | "paw" | "music";
  className?: string;
}) {
  const shared = {
    fill: "none",
    stroke: "#3c285c",
    strokeWidth: 3.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      {...shared}
    >
      {kind === "cat" && (
        <>
          <path
            d="M23 42 19 14 40 30Q50 26 60 30L81 14 77 42Q85 57 77 75Q50 94 23 75Q15 57 23 42Z"
            fill="#ffa776"
          />
          <path
            d="m24 25 3 18 10-9m39-9-3 18-10-9"
            fill="#ffd3cd"
            stroke="none"
          />
          <ellipse cx="37" cy="53" rx="3" ry="4" fill="#3c285c" />
          <ellipse cx="63" cy="53" rx="3" ry="4" fill="#3c285c" />
          <path d="m46 62 4 4 4-4Z" fill="#e95984" />
          <path d="M50 66v5m0 0q-7 7-12 0m12 0q7 7 12 0M17 60l15 3m-16 8 16-3m51-8-15 3m16 8-16-3" />
        </>
      )}
      {kind === "train" && (
        <>
          <path d="M19 58V31h27v27h15V43h18v15h6v19H14V58Z" fill="#7fc5eb" />
          <path d="M17 27h32M59 43h23" />
          <rect x="25" y="36" width="15" height="17" rx="3" fill="#fff9dd" />
          <path d="M64 29q-9-3-1-8m10 9q11-5 3-12" />
          <circle cx="29" cy="79" r="8" fill="#aa7ee9" />
          <circle cx="69" cy="79" r="8" fill="#aa7ee9" />
          <path d="M10 91h80" />
        </>
      )}
      {kind === "star" && (
        <>
          <path
            d="m50 12 12 24 27 4-20 20 5 28-24-13-24 13 5-28-20-20 27-4Z"
            fill="#ffcc45"
          />
          <path d="M40 49v4m20-4v4m-17 9q7 7 14 0M10 17v9m-5-4h10m73 44v9m-5-4h10" />
        </>
      )}
      {kind === "rabbit" && (
        <>
          <ellipse
            cx="36"
            cy="28"
            rx="10"
            ry="24"
            transform="rotate(-12 36 28)"
            fill="#f9f5ff"
          />
          <ellipse
            cx="64"
            cy="28"
            rx="10"
            ry="24"
            transform="rotate(12 64 28)"
            fill="#f9f5ff"
          />
          <path d="m34 11 4 28m28-28-4 28" stroke="#f3a6bd" strokeWidth="6" />
          <ellipse cx="50" cy="64" rx="30" ry="27" fill="#f9f5ff" />
          <path d="M38 57v3m24-3v3m-16 8 4 4 4-4m-4 4v4m0 0q-6 5-10 0m10 0q6 5 10 0" />
          <ellipse cx="32" cy="69" rx="6" ry="3" fill="#ffcbdc" stroke="none" />
          <ellipse cx="68" cy="69" rx="6" ry="3" fill="#ffcbdc" stroke="none" />
        </>
      )}
      {kind === "duck" && (
        <>
          <path
            d="M21 58q-14 20 6 29h39q24-8 12-32L74 45q7-30-16-29-21 0-16 29L21 58Z"
            fill="#ffd954"
          />
          <path d="m73 34 18 7-18 8" fill="#ff9b50" />
          <circle cx="65" cy="31" r="2" fill="#3c285c" />
          <path d="M33 63q22 20 29-2M16 95h67" />
        </>
      )}
      {kind === "fish" && (
        <>
          <path
            d="M24 51 9 32v38l15-15Q47 13 86 51 47 89 24 51Z"
            fill="#50c9c0"
          />
          <path
            d="M48 28q5-13 13-9l10 13M46 74q5 13 13 8l8-10"
            fill="#ffd166"
          />
          <path d="M64 32q-10 18 0 38" />
          <circle cx="74" cy="45" r="2.5" fill="#3c285c" />
          <circle cx="89" cy="22" r="4" stroke="#39a8ae" />
          <circle cx="78" cy="10" r="2" stroke="#39a8ae" />
        </>
      )}
      {kind === "elephant" && (
        <>
          <ellipse cx="52" cy="56" rx="27" ry="31" fill="#aebde9" />
          <ellipse cx="25" cy="49" rx="18" ry="25" fill="#c5cff4" />
          <ellipse cx="77" cy="49" rx="18" ry="25" fill="#c5cff4" />
          <path d="M43 60v22q0 14 13 11 12-3 9-11" fill="#aebde9" />
          <path d="M39 45v4m22-4v4" />
          <path d="M30 62q-8 15 0 13m43-13q8 15 0 13" fill="#fff9df" />
        </>
      )}
      {kind === "bear" && (
        <>
          <circle cx="24" cy="29" r="15" fill="#c88b57" />
          <circle cx="76" cy="29" r="15" fill="#c88b57" />
          <path
            d="M22 37q0-16 28-16t28 16q21 49-28 52-49-3-28-52Z"
            fill="#dca46b"
          />
          <circle cx="25" cy="29" r="6" fill="#f7d9b6" stroke="none" />
          <circle cx="75" cy="29" r="6" fill="#f7d9b6" stroke="none" />
          <path d="M36 49v4m28-4v4" />
          <ellipse cx="50" cy="67" rx="18" ry="13" fill="#f7d9b6" />
          <path d="m44 61 6 6 6-6Z" fill="#3c285c" />
          <path d="M50 67v6m-7 0q7 7 14 0" />
        </>
      )}
      {kind === "spider" && (
        <>
          <path d="M50 0v21M33 39 15 27 6 36m26 11L10 46 4 57m28-1L13 67l-4 13m27-13L23 84l3 12m41-57 18-12 9 9M68 47l22-1 6 11M68 56l19 11 4 13M64 67l13 17-3 12" />
          <ellipse cx="50" cy="51" rx="23" ry="28" fill="#b1d573" />
          <path d="M41 40v3m18-3v3m-17 11q8 8 16 0" />
        </>
      )}
      {kind === "paw" && (
        <>
          <ellipse cx="50" cy="67" rx="24" ry="19" fill="#e8bcff" />
          <ellipse cx="21" cy="42" rx="9" ry="13" fill="#e8bcff" />
          <ellipse cx="40" cy="25" rx="9" ry="13" fill="#e8bcff" />
          <ellipse cx="61" cy="25" rx="9" ry="13" fill="#e8bcff" />
          <ellipse cx="80" cy="42" rx="9" ry="13" fill="#e8bcff" />
        </>
      )}
      {kind === "music" && (
        <>
          <path
            d="M37 69V27l40-9v45M37 40l40-9"
            stroke="#7538c4"
            strokeWidth="7"
          />
          <ellipse
            cx="26"
            cy="72"
            rx="14"
            ry="10"
            fill="#7538c4"
            stroke="none"
          />
          <ellipse
            cx="66"
            cy="67"
            rx="14"
            ry="10"
            fill="#7538c4"
            stroke="none"
          />
        </>
      )}
    </svg>
  );
}
