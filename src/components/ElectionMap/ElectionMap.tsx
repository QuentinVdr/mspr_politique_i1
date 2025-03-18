import { MapContainer, TileLayer } from 'react-leaflet';
import styles from './ElectionMap.module.css';

export default function ElectionMap() {
  const center: [number, number] = [43.9351691, 6.0679194];

  return (
    <MapContainer className={styles.mapContainer} center={center} zoom={8} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
