/**
 * TypeScript interface for the French Election and Demographic Data CSV
 */
export interface TElection {
  // Identification columns
  code_canton: string;
  annee: number;
  code_departement: string;

  // Financial and population statistics
  impot_moyen: number;
  population: number;

  // Professional categories (raw counts)
  agriculteurs_exploitants: number;
  artisans_comm_chefs_entr: number;
  cadres_prof_intel_sup: number;
  professions_intermediaires: number;
  employes: number;
  ouvriers: number;
  retraites: number;
  autres_sans_activite_prof: number;

  // Age demographics (raw counts)
  population_15_29: number;
  population_30_44: number;
  population_45_59: number;
  population_60_74: number;
  population_75_plus: number;

  // Gender demographics
  population_hommes: number;

  // Election statistics (raw counts)
  inscrits: number;
  abstentions: number;
  blancs_nuls: number;
  vote_extreme_gauche: number;
  vote_gauche: number;
  vote_centre: number;
  vote_droite: number;
  vote_extreme_droite: number;

  // Demographic percentages
  pct_population_hommes: number;
  pct_agriculteurs_exploitants: number;
  pct_artisans_comm_chefs_entr: number;
  pct_cadres_prof_intel_sup: number;
  pct_professions_intermediaires: number;
  pct_employes: number;
  pct_ouvriers: number;
  pct_retraites: number;
  pct_autres_sans_activite_prof: number;

  // Age percentages
  pct_population_15_29: number;
  pct_population_30_44: number;
  pct_population_45_59: number;
  pct_population_60_74: number;
  pct_population_75_plus: number;

  // Election percentages
  pct_abstentions: number;
  pct_blancs_nuls: number;

  // Valid votes and voting percentages
  exprimes: number;
  pct_vote_extreme_gauche: number;
  pct_vote_gauche: number;
  pct_vote_centre: number;
  pct_vote_droite: number;
  pct_vote_extreme_droite: number;

  // Election results
  parti_gagnant: 'extreme_gauche' | 'gauche' | 'centre' | 'droite' | 'extreme_droite';
  niveau_richesse: number;
}
