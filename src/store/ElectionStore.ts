import { TElection } from '@/types/ElectionType';
import { TPrediction } from '@/types/PredictionType';
import { fetchAndParseCSV, fetchAndParsePredictionCSV } from '@/utils/fetchData';
import { getUniqueValues } from '@/utils/uniqueArray';
import { create } from 'zustand';

type TElectionStore = {
  fetchCsv: () => Promise<void>;
  elections: TElection[];
  getElectionsAnnees: () => number[];
  getElectionsByAnnee: (annee: number) => TElection[];
  predictions: TPrediction[];
  getPredictionsAnnees: () => number[];
  getPredictionsByAnnee: (annee: number) => TPrediction[];
};

export const useElectionStore = create<TElectionStore>((set, get) => ({
  fetchCsv: async () => {
    fetchAndParseCSV()
      .then((data) => {
        set({ elections: data });
      })
      .catch((err) => {
        console.error(err);
      });
    fetchAndParsePredictionCSV()
      .then((data) => {
        set({ predictions: data });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  elections: [],
  getElectionsAnnees: () => getUniqueValues(get().elections.map((election) => election.annee)),
  getElectionsByAnnee: (annee: number) => get().elections.filter((election) => election.annee === annee),
  predictions: [],
  getPredictionsAnnees: () => getUniqueValues(get().predictions.map((prediction) => prediction.annee)),
  getPredictionsByAnnee: (annee: number) => get().predictions.filter((prediction) => prediction.annee === annee)
}));
