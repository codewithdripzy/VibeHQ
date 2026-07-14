import type { ReactElement } from "react";

interface BrandLogoProps {
  name: string;
}

function BrandLogo({ name }: BrandLogoProps) {
  const logos: Record<string, ReactElement> = {
    Springfield: (
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none">
        <path
          d="M4 12L12 4L20 12L12 20L4 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <text x="28" y="16" fill="currentColor" fontSize="12" fontFamily="sans-serif">
          Springfield
        </text>
      </svg>
    ),
    Orbitc: (
      <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <text x="28" y="16" fill="currentColor" fontSize="12" fontFamily="sans-serif">
          Orbitc
        </text>
      </svg>
    ),
    Cloud: (
      <svg width="90" height="24" viewBox="0 0 90 24" fill="none">
        <path
          d="M6 16C3.79 16 2 14.21 2 12C2 9.79 3.79 8 6 8C6.07 8 6.14 8 6.21 8.01C7.1 5.19 9.84 3 13 3C16.93 3 20.14 6.07 20.78 10C23.66 10.44 26 12.92 26 16C26 19.31 23.31 22 20 22H8C4.69 22 2 19.31 2 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <text x="34" y="16" fill="currentColor" fontSize="12" fontFamily="sans-serif">
          Cloud
        </text>
      </svg>
    ),
    Amster: (
      <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
        <path
          d="M4 20L12 4L20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 14H17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <text x="28" y="16" fill="currentColor" fontSize="12" fontFamily="sans-serif">
          Amster
        </text>
      </svg>
    ),
    Nexus: (
      <svg width="90" height="24" viewBox="0 0 90 24" fill="none">
        <path
          d="M4 4L12 12L20 4M4 20L12 12L20 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="28" y="16" fill="currentColor" fontSize="12" fontFamily="sans-serif">
          Nexus
        </text>
      </svg>
    ),
  };

  return <div className="flex-shrink-0 px-8 text-gray-500">{logos[name]}</div>;
}

const brands = ["Springfield", "Orbitc", "Cloud", "Amster", "Nexus"];

export function Marquee() {
  return (
    <div className="mt-24 mb-8">
      <p className="text-sm text-gray-500 font-medium text-center mb-8">
        Trusted by industry leaders
      </p>
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee">
          {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
            <BrandLogo key={`${brand}-${i}`} name={brand} />
          ))}
        </div>
      </div>
    </div>
  );
}
