import { useElectionStore } from '@/store/ElectionStore';
import CantonElectionChart from '../CantonElectionChart/CantonElectionChart';
import ElectionMap from '../ElectionMap/ElectionMap';
import ElectionTrendsChart from '../ElectionTrendsChart/ElectionTrendsChart';

export default function Home() {
  const elections = useElectionStore((state) => state.elections);

  return (
    <div>
      <h1>Analyse des Élections de la régions PACA</h1>
      {elections.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Map</h2>
          <ElectionMap />
          <h2>Canton analyse</h2>
          <CantonElectionChart />
          <h2>Analyse global</h2>
          <ElectionTrendsChart />
        </>
      )}
    </div>
  );
}
