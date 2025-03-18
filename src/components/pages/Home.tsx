import { useEffect, useState } from 'react';
import { useElectionStore } from '@/store/ElectionStore';
import AllTableElections from '@/components/Table/AllElectionsTable';

export default function Home() {
  const elections = useElectionStore((state) => state.elections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Vous pouvez appeler ici une fonction asynchrone de récupération si besoin
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <AllTableElections elections={elections} />
    </>
  );
}
