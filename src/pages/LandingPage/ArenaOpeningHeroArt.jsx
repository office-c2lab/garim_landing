import { useId } from 'react';

import garimLogoPng from '@/assets/icons/logo.png';
import garimWordmarkPng from '@/assets/icons/GARIM.png';
import garimLogoSvg from '@/assets/icons/garim_logo_transparent.svg?raw';
import garimWordmarkSvg from '@/assets/icons/garim_transparent.svg?raw';

import './ArenaOpeningHeroArt.css';

const GARIM_LOGO_VIEWBOX =
  garimLogoSvg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 793 811';
const GARIM_LOGO_PATH =
  garimLogoSvg.match(/<path[^>]*\sd="([^"]+)"/)?.[1] ?? '';
const GARIM_WORDMARK_VIEWBOX =
  garimWordmarkSvg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 2048 457';
const GARIM_WORDMARK_PATH =
  garimWordmarkSvg.match(/<path[^>]*\sd="([^"]+)"/)?.[1] ?? '';

export default function ArenaOpeningHeroArt() {
  const uid = useId().replace(/:/g, '');
  const logoGradientId = `arena-opening-garim-logo-gradient-${uid}`;
  const logoClipId = `arena-opening-garim-clip-${uid}`;
  const logoShineOneId = `arena-opening-garim-logo-shine-1-${uid}`;
  const logoShineTwoId = `arena-opening-garim-logo-shine-2-${uid}`;
  const wordGradientId = `arena-opening-garim-word-gradient-${uid}`;
  const wordGlowId = `arena-opening-garim-word-glow-${uid}`;
  const wordClipId = `arena-opening-garim-word-clip-${uid}`;
  const wordFlareOneId = `arena-opening-garim-word-flare-1-${uid}`;
  const wordFlareTwoId = `arena-opening-garim-word-flare-2-${uid}`;
  const wordSheenId = `arena-opening-garim-word-sheen-${uid}`;
  const wordLeftSheenId = `arena-opening-garim-word-left-sheen-${uid}`;

  return (
    <div className="arena-opening-art" aria-hidden="true">
      <div className="arena-opening-art__piece arena-opening-art__piece--logo">
        <svg
          viewBox={GARIM_LOGO_VIEWBOX}
          xmlns="http://www.w3.org/2000/svg"
          className="arena-opening-art__vector arena-opening-art__logo"
        >
          <defs>
            <linearGradient
              id={logoGradientId}
              x1="0"
              y1="0"
              x2="793"
              y2="811"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#B480E6" />
              <stop offset="42%" stopColor="#CEA4EC" />
              <stop offset="70%" stopColor="#A76DE1" />
              <stop offset="100%" stopColor="#9153D3" />
            </linearGradient>
            <clipPath id={logoClipId}>
              <path d={GARIM_LOGO_PATH} fillRule="evenodd" />
            </clipPath>
            <linearGradient
              id={logoShineOneId}
              x1="459.94"
              y1="145.98"
              x2="586.82"
              y2="470.38"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.28" />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={logoShineTwoId}
              x1="95.16"
              y1="583.92"
              x2="269.62"
              y2="770.45"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.34" />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={GARIM_LOGO_PATH}
            pathLength="1"
            fillOpacity="0"
            strokeOpacity="1"
            className="arena-opening-art__path arena-opening-art__path--logo"
            style={{ '--arena-opening-logo-fill': `url(#${logoGradientId})` }}
            fillRule="evenodd"
          />
          <g className="arena-opening-art__shine" clipPath={`url(#${logoClipId})`}>
            <rect x="0" y="0" width="793" height="811" fill={`url(#${logoShineOneId})`} />
            <rect x="0" y="0" width="793" height="811" fill={`url(#${logoShineTwoId})`} />
          </g>
        </svg>
        <img
          src={garimLogoPng}
          alt=""
          className="arena-opening-art__raster arena-opening-art__raster--logo"
        />
      </div>
      <div className="arena-opening-art__piece arena-opening-art__piece--wordmark">
        <svg
          viewBox={GARIM_WORDMARK_VIEWBOX}
          xmlns="http://www.w3.org/2000/svg"
          className="arena-opening-art__vector arena-opening-art__wordmark"
        >
          <defs>
            <linearGradient
              id={wordGradientId}
              x1="0"
              y1="0"
              x2="2048"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#B683E7" />
              <stop offset="44%" stopColor="#B581E5" />
              <stop offset="100%" stopColor="#8B46D3" />
            </linearGradient>
            <radialGradient id={wordGlowId} cx="17%" cy="87%" r="60%">
              <stop offset="0%" stopColor="#E4C0F6" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#D8B6F2" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            <clipPath id={wordClipId}>
              <path d={GARIM_WORDMARK_PATH} fillRule="evenodd" />
            </clipPath>
            <radialGradient id={wordFlareOneId} cx="61.7%" cy="23.3%" r="18%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="8%" stopColor="#FFFFFF" stopOpacity="0.65" />
              <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={wordFlareTwoId} cx="69.2%" cy="31%" r="16%">
              <stop offset="0%" stopColor="#7B2ED4" stopOpacity="0.65" />
              <stop offset="35%" stopColor="#7B2ED4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#7B2ED4" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id={wordSheenId}
              x1="1085.44"
              y1="63.98"
              x2="1392.64"
              y2="242.21"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="44%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={wordLeftSheenId}
              x1="1167.36"
              y1="41.13"
              x2="1454.08"
              y2="182.8"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="46%" stopColor="#FFFFFF" stopOpacity="0.52" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="54%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={GARIM_WORDMARK_PATH}
            pathLength="1"
            fillOpacity="0"
            strokeOpacity="1"
            className="arena-opening-art__path arena-opening-art__path--wordmark"
            style={{ '--arena-opening-wordmark-fill': `url(#${wordGradientId})` }}
            fillRule="evenodd"
          />
          <path
            d={GARIM_WORDMARK_PATH}
            className="arena-opening-art__wordmark-glow"
            fill={`url(#${wordGlowId})`}
            fillRule="evenodd"
          />
          <g className="arena-opening-art__wordmark-shine" clipPath={`url(#${wordClipId})`}>
            <rect x="0" y="0" width="2048" height="457" fill={`url(#${wordFlareTwoId})`} />
            <rect x="0" y="0" width="2048" height="457" fill={`url(#${wordSheenId})`} />
            <rect x="0" y="0" width="2048" height="457" fill={`url(#${wordLeftSheenId})`} />
            <rect x="0" y="0" width="2048" height="457" fill={`url(#${wordFlareOneId})`} />
          </g>
        </svg>
        <img
          src={garimWordmarkPng}
          alt=""
          className="arena-opening-art__raster arena-opening-art__raster--wordmark"
        />
      </div>
    </div>
  );
}
