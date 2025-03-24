import Home from '@/components/Home/Home';
import { useElectionStore } from '@/store/ElectionStore';
import { useEffect } from 'react';

function App() {
  const fetchElections = useElectionStore((state) => state.fetchCsv);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  return <Home />;
}

export default App;
