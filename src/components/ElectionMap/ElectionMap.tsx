import { useElectionStore } from '@/store/ElectionStore';
import { TElection } from '@/types/ElectionType';
import { getColorsByPolitical } from '@/utils/politicalColors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import ElectionGeoJSON from '../ElectionGeoJSON/ElectionGeoJSON';
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

  const getElectionResultByCanton = useCallback(
    (canton: string) => {
      return selectedYearsElections.find((election: TElection) => election.code_canton === canton);
    },
    [selectedYearsElections]
  );

  // Style function for the GeoJSON features
  const cantonStyle = useCallback(
    (feature: any) => {
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
          <ElectionGeoJSON
            data={geoJsonData}
            selectedYear={selectedYear}
            getElectionResultByCanton={getElectionResultByCanton}
            cantonStyle={cantonStyle}
          />
        )}
      </MapContainer>
    </div>
  );
}
