import { TElection } from '@/types/ElectionType';
import { create } from 'zustand';

type TElectionStore = {
  elections: TElection[];
  annees: () => number[];
};

export const ElectionStore = create<TElectionStore>((set, get) => ({
  elections: [],
  annees: () => get().elections.map((election) => election.annee)
}));
