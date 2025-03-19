import { useElectionStore } from '@/store/ElectionStore';
import { TElection } from '@/types/ElectionType';
import { getColorsByPolitical } from '@/utils/politicalColors';
import { useEffect, useMemo, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import styles from './ElectionMap.module.css';

export default function ElectionMap() {
  const center: [number, number] = [43.9351691, 6.0679194];
  const getElectionByAnnee = useElectionStore((state) => state.getElectionByAnnee);
  const allElections = useElectionStore((state) => state.elections);

  const [selectedYearsElections, setSelectedYearsElections] = useState<TElection[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2022);

  // Extract available years from the data
  const availableYears = useMemo(() => {
    if (!allElections || allElections.length === 0) return [2022];

    const years = Array.from(new Set(allElections.map((election) => election.annee))).sort((a, b) => a - b);

    return years;
  }, [allElections]);

  useEffect(() => {
    setSelectedYearsElections(getElectionByAnnee(selectedYear));

    // Fetch GeoJSON data
    fetch('data/cantons_par_commune_PACA.geojson')
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
      });
  }, [getElectionByAnnee, selectedYear]);

  const getElectionResultByCanton = useMemo(
    () => (canton: string) => {
      return selectedYearsElections.find((election: TElection) => election.code_canton === canton);
    },
    [selectedYearsElections]
  );

  // Style function for the GeoJSON features
  const cantonStyle = useMemo(
    () => (feature: any) => {
      const cantonElection = getElectionResultByCanton(feature.properties.Canton);

      return {
        fillColor: getColorsByPolitical(cantonElection?.parti_gagnant ?? 'defaultColor'),
        opacity: 1,
        dashArray: '3',
        weight: 1,
        color: 'white',
        fillOpacity: 0.5
      };
    },
    [getElectionResultByCanton]
  );

  // Event handlers for GeoJSON features
  const onEachFeature = (feature: any, layer: any) => {
    const cantonElection = getElectionResultByCanton(feature.properties.Canton);

    // Add popup with canton info and more detailed election information
    layer.bindPopup(`
      <strong>Canton:</strong> ${cantonElection?.code_canton}<br/>
      <strong>Parti gagnant:</strong> ${cantonElection?.parti_gagnant}<br/>
      <strong>Année:</strong> ${cantonElection?.annee}<br/>
      <strong>Population:</strong> ${cantonElection?.population?.toLocaleString()}<br/>
      <strong>Votes exprimés:</strong> ${cantonElection?.exprimes?.toLocaleString()}<br/>
      <strong>% Abstentions:</strong> ${cantonElection?.pct_abstentions?.toFixed(2)}%
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
        layer.setStyle({
          weight: 1,
          color: 'white',
          fillOpacity: 0.5
        });
      }
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.mapControls}>
        <div className={styles.selectContainer}>
          <label htmlFor="year-select">Année d'élection:</label>
          <select id="year-select" value={selectedYear} onChange={handleYearChange} className={styles.yearSelect}>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.legendContainer}>
          <div className={styles.legendTitle}>Partis politiques</div>
          <div className={styles.legendItem}>
            <span
              className={styles.colorBox}
              style={{ backgroundColor: getColorsByPolitical('extreme_gauche') }}
            ></span>
            <span>Extrême Gauche</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.colorBox} style={{ backgroundColor: getColorsByPolitical('gauche') }}></span>
            <span>Gauche</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.colorBox} style={{ backgroundColor: getColorsByPolitical('centre') }}></span>
            <span>Centre</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.colorBox} style={{ backgroundColor: getColorsByPolitical('droite') }}></span>
            <span>Droite</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.colorBox}
              style={{ backgroundColor: getColorsByPolitical('extreme_droite') }}
            ></span>
            <span>Extrême Droite</span>
          </div>
        </div>
      </div>
      <MapContainer className={styles.mapContainer} center={center} zoom={8} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && (
          <GeoJSON key={selectedYear} data={geoJsonData} style={cantonStyle} onEachFeature={onEachFeature} />
        )}
      </MapContainer>
    </div>
  );
}
