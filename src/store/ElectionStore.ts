import { TElection } from '@/types/ElectionType';
import { fetchAndParseCSV } from '@/utils/fetchData';
import { getUniqueValues } from '@/utils/uniqueArray';
import { create } from 'zustand';

type TElectionStore = {
  elections: TElection[];
  fetchElections: () => Promise<void>;
  getAnnees: () => number[];
  getElectionByAnnee: (annee: number) => TElection[];
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
  getAnnees: () => getUniqueValues(get().elections.map((election) => election.annee)),
  getElectionByAnnee: (annee: number) => get().elections.filter((election) => election.annee === annee)
}));
