import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import styles from './ElectionMap.module.css';

export default function ElectionMap() {
  const center: [number, number] = [43.9351691, 6.0679194];
  const [selectedCanton, setSelectedCanton] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch GeoJSON data
    fetch('data/cantons_par_commune_PACA.geojson')
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
        setIsLoading(false);
      });
  }, []);

  // Style function for the GeoJSON features
  const cantonStyle = (feature: any) => {
    const isSelected = selectedCanton === feature.properties.Canton;

    return {
      fillColor: isSelected ? '#3388ff' : '#2a81cb',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: isSelected ? 0.7 : 0.5
    };
  };

  // Event handlers for GeoJSON features
  const onEachFeature = (feature: any, layer: any) => {
    const cantonId = feature.properties.Canton;
    const cantonRegion = feature.properties.Région;
    const cantonDepartement = feature.properties.Département;

    // Add popup with canton info
    layer.bindPopup(`
      <strong>Canton:</strong> ${cantonId}<br/>
      <strong>Région:</strong> ${cantonRegion}<br/>
      <strong>Département:</strong> ${cantonDepartement}
    `);

    // Add hover effect
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#666',
          fillOpacity: 0.7
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(cantonStyle(feature));
      },
      click: (e: any) => {
        setSelectedCanton(cantonId);
      }
    });
  };

  return (
    <MapContainer className={styles.mapContainer} center={center} zoom={8} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!isLoading && geoJsonData && <GeoJSON data={geoJsonData} style={cantonStyle} onEachFeature={onEachFeature} />}
    </MapContainer>
  );
}
