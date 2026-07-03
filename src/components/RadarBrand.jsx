import radar from '../assets/icons/logo.svg';

export default function RadarBrand({ radarClassName = 'w-36', className = '', radarRef }) {
  return (
    <div className={`flex items-center ${className}`.trim()}>
      <img
        ref={radarRef}
        src={radar}
        alt="RADAR"
        className={`${radarClassName} h-auto shrink-0`.trim()}
      />
    </div>
  );
}
