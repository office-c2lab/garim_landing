import garimLogo from '@/assets/icons/logo.png';
import garimText from '@/assets/icons/GARIM.png';

import './ArenaOpeningHeroArt.css';

export default function ArenaOpeningHeroArt() {
  return (
    <div className="arena-opening-art" aria-hidden="true">
      <img
        src={garimLogo}
        alt=""
        className="arena-opening-art__piece arena-opening-art__piece--logo"
      />
      <img
        src={garimText}
        alt=""
        className="arena-opening-art__piece arena-opening-art__piece--wordmark"
      />
    </div>
  );
}
