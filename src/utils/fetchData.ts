import { TElection } from '@/types/ElectionType';
import { TPrediction } from '@/types/PredictionType';
import Papa from 'papaparse';

export const fetchAndParseCSV = (): Promise<TElection[]> => {
  return fetch('data/data_csp_election.csv')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then((csvString) => {
      const result = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false // Keep as strings so we can do custom type conversion
      });

      // Convert string values to appropriate types
      return result.data.map((row: any): TElection => {
        // Helper function to convert string to number
        const toNumber = (value: string): number => (value === '' ? 0 : parseFloat(value.replace(',', '.')));

        return {
          // Identification columns
          code_canton: String(row.code_canton),
          annee: toNumber(row.annee),
          code_departement: String(row.code_departement),

          // Financial and population statistics
          impot_moyen: toNumber(row.impot_moyen),
          population: toNumber(row.population),

          // Professional categories (raw counts)
          agriculteurs_exploitants: toNumber(row.agriculteurs_exploitants),
          artisans_comm_chefs_entr: toNumber(row.artisans_comm_chefs_entr),
          cadres_prof_intel_sup: toNumber(row.cadres_prof_intel_sup),
          professions_intermediaires: toNumber(row.professions_intermediaires),
          employes: toNumber(row.employes),
          ouvriers: toNumber(row.ouvriers),
          retraites: toNumber(row.retraites),
          autres_sans_activite_prof: toNumber(row.autres_sans_activite_prof),

          // Age demographics (raw counts)
          population_15_29: toNumber(row.population_15_29),
          population_30_44: toNumber(row.population_30_44),
          population_45_59: toNumber(row.population_45_59),
          population_60_74: toNumber(row.population_60_74),
          population_75_plus: toNumber(row.population_75_plus),

          // Gender demographics
          population_hommes: toNumber(row.population_hommes),

          // Election statistics (raw counts)
          inscrits: toNumber(row.inscrits),
          abstentions: toNumber(row.abstentions),
          blancs_nuls: toNumber(row.blancs_nuls),
          vote_extreme_gauche: toNumber(row.vote_extreme_gauche),
          vote_gauche: toNumber(row.vote_gauche),
          vote_centre: toNumber(row.vote_centre),
          vote_droite: toNumber(row.vote_droite),
          vote_extreme_droite: toNumber(row.vote_extreme_droite),

          // Demographic percentages
          pct_population_hommes: toNumber(row.pct_population_hommes),
          pct_agriculteurs_exploitants: toNumber(row.pct_agriculteurs_exploitants),
          pct_artisans_comm_chefs_entr: toNumber(row.pct_artisans_comm_chefs_entr),
          pct_cadres_prof_intel_sup: toNumber(row.pct_cadres_prof_intel_sup),
          pct_professions_intermediaires: toNumber(row.pct_professions_intermediaires),
          pct_employes: toNumber(row.pct_employes),
          pct_ouvriers: toNumber(row.pct_ouvriers),
          pct_retraites: toNumber(row.pct_retraites),
          pct_autres_sans_activite_prof: toNumber(row.pct_autres_sans_activite_prof),

          // Age percentages
          pct_population_15_29: toNumber(row.pct_population_15_29),
          pct_population_30_44: toNumber(row.pct_population_30_44),
          pct_population_45_59: toNumber(row.pct_population_45_59),
          pct_population_60_74: toNumber(row.pct_population_60_74),
          pct_population_75_plus: toNumber(row.pct_population_75_plus),

          // Election percentages
          pct_abstentions: toNumber(row.pct_abstentions),
          pct_blancs_nuls: toNumber(row.pct_blancs_nuls),

          // Valid votes and voting percentages
          exprimes: toNumber(row.exprimes),
          pct_vote_extreme_gauche: toNumber(row.pct_vote_extreme_gauche),
          pct_vote_gauche: toNumber(row.pct_vote_gauche),
          pct_vote_centre: toNumber(row.pct_vote_centre),
          pct_vote_droite: toNumber(row.pct_vote_droite),
          pct_vote_extreme_droite: toNumber(row.pct_vote_extreme_droite),

          // Election results
          parti_gagnant: row.parti_gagnant as 'extreme_gauche' | 'gauche' | 'centre' | 'droite' | 'extreme_droite',
          niveau_richesse: toNumber(row.niveau_richesse)
        };
      });
    });
};

export const fetchAndParsePredictionCSV = (): Promise<TPrediction[]> => {
  return fetch('data/simple_predictions.csv')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then((csvString) => {
      const result = Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false // Keep as strings so we can do custom type conversion
      });

      // Convert string values to appropriate types
      return result.data.map((row: any): TPrediction => {
        // Helper function to convert string to number
        const toNumber = (value: string): number => (value === '' ? 0 : parseFloat(value.replace(',', '.')));

        return {
          // Identification columns
          code_canton: String(row.code_canton),
          annee: toNumber(row.annee),

          // Election results
          parti_gagnant: row.parti_gagnant as 'extreme_gauche' | 'gauche' | 'centre' | 'droite' | 'extreme_droite'
        };
      });
    });
};
