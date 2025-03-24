/**
 * TypeScript interface for the French Election Prediction Data CSV
 */
export interface TPrediction {
  // Identification columns
  code_canton: string;
  annee: number;

  // Election results
  parti_gagnant: 'extreme_gauche' | 'gauche' | 'centre' | 'droite' | 'extreme_droite';
}
