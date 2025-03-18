import { TElection } from '@/types/ElectionType';
import { fetchAndParseCSV } from '@/utils/fetchData';
import { create } from 'zustand';

type TElectionStore = {
  elections: TElection[];
  fetchElections: () => Promise<void>;
  annees: () => number[];
};

export const useElectionStore = create<TElectionStore>((set, get) => ({
  elections: [],
  fetchElections: async () => {
    fetchAndParseCSV()
      .then((data) => {
        set({ elections: data });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  annees: () => get().elections.map((election) => election.annee)
}));
