import { useElectionStore } from '@/store/ElectionStore';
import CantonElectionChart from '../CantonElectionChart/CantonElectionChart';
import ElectionMap from '../ElectionMap/ElectionMap';
import ElectionPredictionChart from '../ElectionPredictionChart/ElectionPredictionChart';
import ElectionTrendsChart from '../ElectionTrendsChart/ElectionTrendsChart';

export default function Home() {
  const elections = useElectionStore((state) => state.elections);
  const predictions = useElectionStore((state) => state.predictions);

  const isLoading = elections.length === 0 || predictions.length === 0;

  return (
    <div>
      <h1>Analyse des Élections de la régions PACA</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Map</h2>
          <ElectionMap />
          <h2>Canton analyse</h2>
          <CantonElectionChart />
          <h2>Analyse global</h2>
          <ElectionTrendsChart />
          <h2>Prevision des elections</h2>
          <ElectionPredictionChart />
        </>
      )}
    </div>
  );
}
