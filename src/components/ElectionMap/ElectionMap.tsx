import { useElectionStore } from '@/store/ElectionStore';
import { TElection } from '@/types/ElectionType';
import { getColorsByPolitical } from '@/utils/politicalColors';
import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import styles from './ElectionMap.module.css';

export default function ElectionMap() {
  const center: [number, number] = [43.9351691, 6.0679194];
  const getElectionByAnnee = useElectionStore((state) => state.getElectionByAnnee);
  const [elections, setElections] = useState<TElection[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setElections(getElectionByAnnee(2022));
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

  const getElectionResult = (canton: string) => {
    return elections.find((election: TElection) => election.code_canton === canton);
  };

  // Style function for the GeoJSON features
  const cantonStyle = (feature: any) => {
    const cantonElection = getElectionResult(feature.properties.Canton);

    return {
      fillColor: getColorsByPolitical(cantonElection?.parti_gagnant ?? 'defaultColor'),
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5
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
