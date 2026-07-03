import { useId } from 'react';

import garimSymbolImage from '@/assets/icons/simbol.svg';
import garimWordmarkImage from '@/assets/icons/logo.svg';
import garimSymbolSvg from '@/assets/icons/simbol.svg?raw';
import garimWordmarkSvg from '@/assets/icons/logo.svg?raw';

import './ArenaOpeningHeroArt.css';

function getSvgViewBox(svg, fallback) {
  return svg.match(/viewBox="([^"]+)"/)?.[1] ?? fallback;
}

function getSvgPaths(svg) {
  return [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map(match => match[1]);
}

const SYMBOL_VIEWBOX = getSvgViewBox(garimSymbolSvg, '0 0 307 336');
const SYMBOL_PATHS = getSvgPaths(garimSymbolSvg);
const WORDMARK_VIEWBOX = getSvgViewBox(garimWordmarkSvg, '0 0 665 90');
const WORDMARK_PATHS = getSvgPaths(garimWordmarkSvg);

function TracePaths({ paths, className, fill, delayStep = 0 }) {
  return paths.map((path, index) => (
    <path
      key={path}
      d={path}
      pathLength="1"
      className={className}
      style={{
        '--trace-fill': fill,
        '--trace-delay': `${index * delayStep}ms`,
      }}
      fillRule="evenodd"
    />
  ));
}

export default function ArenaOpeningHeroArt() {
  const uid = useId().replace(/:/g, '');
  const symbolGradientId = `garim-symbol-trace-gradient-${uid}`;
  const wordmarkGradientId = `garim-wordmark-trace-gradient-${uid}`;
  const symbolClipId = `garim-symbol-trace-clip-${uid}`;
  const wordmarkClipId = `garim-wordmark-trace-clip-${uid}`;

  return (
    <div className="arena-opening-art" aria-hidden="true">
      <div className="arena-opening-art__halo" />

      <div className="arena-opening-art__piece arena-opening-art__piece--symbol">
        <svg
          viewBox={SYMBOL_VIEWBOX}
          xmlns="http://www.w3.org/2000/svg"
          className="arena-opening-art__trace arena-opening-art__trace--symbol"
        >
          <defs>
            <linearGradient
              id={symbolGradientId}
              x1="153.5"
              y1="0"
              x2="153.5"
              y2="335.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5B39D6" />
              <stop offset="1" stopColor="#4C2FC0" />
            </linearGradient>
            <clipPath id={symbolClipId}>
              {SYMBOL_PATHS.map(path => (
                <path key={path} d={path} fillRule="evenodd" />
              ))}
            </clipPath>
          </defs>

          <TracePaths
            paths={SYMBOL_PATHS}
            className="arena-opening-art__path arena-opening-art__path--symbol"
            fill={`url(#${symbolGradientId})`}
          />
          <g className="arena-opening-art__sheen" clipPath={`url(#${symbolClipId})`}>
            <rect x="-90" y="-40" width="86" height="430" transform="rotate(20)" />
          </g>
        </svg>
        <img
          src={garimSymbolImage}
          alt=""
          className="arena-opening-art__final arena-opening-art__final--symbol"
          draggable="false"
        />
      </div>

      <div className="arena-opening-art__piece arena-opening-art__piece--wordmark">
        <svg
          viewBox={WORDMARK_VIEWBOX}
          xmlns="http://www.w3.org/2000/svg"
          className="arena-opening-art__trace arena-opening-art__trace--wordmark"
        >
          <defs>
            <linearGradient
              id={wordmarkGradientId}
              x1="0"
              y1="45"
              x2="665"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5B39D6" />
              <stop offset="0.42" stopColor="#5B39D6" />
              <stop offset="1" stopColor="#5B39D6" />
            </linearGradient>
            <clipPath id={wordmarkClipId}>
              {WORDMARK_PATHS.map(path => (
                <path key={path} d={path} fillRule="evenodd" />
              ))}
            </clipPath>
          </defs>

          <TracePaths
            paths={WORDMARK_PATHS}
            className="arena-opening-art__path arena-opening-art__path--wordmark"
            fill={`url(#${wordmarkGradientId})`}
            delayStep={120}
          />
          <g className="arena-opening-art__sheen arena-opening-art__sheen--wordmark" clipPath={`url(#${wordmarkClipId})`}>
            <rect x="-120" y="-80" width="92" height="250" transform="rotate(22)" />
          </g>
        </svg>
        <img
          src={garimWordmarkImage}
          alt=""
          className="arena-opening-art__final arena-opening-art__final--wordmark"
          draggable="false"
        />
      </div>
    </div>
  );
}
