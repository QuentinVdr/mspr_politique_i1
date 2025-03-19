import { useElectionStore } from '@/store/ElectionStore';
import ElectionMap from '../ElectionMap/ElectionMap';

export default function Home() {
  const elections = useElectionStore((state) => state.elections);

  return (
    <div>
      <h2>Data election</h2>
      {elections.length === 0 ? <p>Loading...</p> : <ElectionMap />}
    </div>
  );
}
