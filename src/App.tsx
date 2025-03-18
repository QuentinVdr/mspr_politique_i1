import Home from '@/components/pages/Home';
import { useElectionStore } from '@/store/ElectionStore';
import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from '@/components/global/Header.tsx';

function App() {
  const fetchElections = useElectionStore((state) => state.fetchElections);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);


  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          </Routes>
      </main>
    </>
  );
}

export default App;
