import React from 'react';
import Table, { Column } from '../global/Table';
import { TElection } from '@/types/ElectionType.ts';



interface AllElectionsTableProps {
  elections: TElection[];
}

const AllElectionsTable: React.FC<AllElectionsTableProps> = ({ elections }) => {
  const columns: Column<TElection>[] = [
    { header: 'Code Canton', accessor: 'code_canton' },
    { header: 'Année', accessor: 'annee' },
    { header: 'Code Département', accessor: 'code_departement' },
    { header: 'Impôt Moyen', accessor: 'impot_moyen' },
    { header: 'Population', accessor: 'population' },
    { header: 'Agriculteurs Exploitants', accessor: 'agriculteurs_exploitants' },
    {
      header: 'Artisans / Commerçants / Chefs d\'entr',
      accessor: 'artisans_comm_chefs_entr',
    },
    { header: 'Cadres / Prof. Intel. Sup.', accessor: 'cadres_prof_intel_sup' },
    { header: 'Professions Intermédiaires', accessor: 'professions_intermediaires' },
    { header: 'Employés', accessor: 'employes' },
    { header: 'Ouvriers', accessor: 'ouvriers' },
    { header: 'Retraités', accessor: 'retraites' },
    { header: 'Autres sans activité pro.', accessor: 'autres_sans_activite_prof' },
    { header: 'Population 15-29', accessor: 'population_15_29' },
    { header: 'Population 30-44', accessor: 'population_30_44' },
    { header: 'Population 45-59', accessor: 'population_45_59' },
    { header: 'Population 60-74', accessor: 'population_60_74' },
    { header: 'Population 75+', accessor: 'population_75_plus' },
    { header: 'Population Hommes', accessor: 'population_hommes' },
    { header: 'Inscrits', accessor: 'inscrits' },
    { header: 'Abstentions', accessor: 'abstentions' },
    { header: 'Blancs et Nuls', accessor: 'blancs_nuls' },
    { header: 'Vote Extrême Gauche', accessor: 'vote_extreme_gauche' },
    { header: 'Vote Gauche', accessor: 'vote_gauche' },
    { header: 'Vote Centre', accessor: 'vote_centre' },
    { header: 'Vote Droite', accessor: 'vote_droite' },
    { header: 'Vote Extrême Droite', accessor: 'vote_extreme_droite' },
    { header: 'Pct Population Hommes', accessor: 'pct_population_hommes' },
    { header: 'Pct Agriculteurs Exploitants', accessor: 'pct_agriculteurs_exploitants' },
    {
      header: 'Pct Artisans / Commerçants / Chefs d\'entr',
      accessor: 'pct_artisans_comm_chefs_entr',
    },
    { header: 'Pct Cadres / Prof. Intel. Sup.', accessor: 'pct_cadres_prof_intel_sup' },
    { header: 'Pct Professions Intermédiaires', accessor: 'pct_professions_intermediaires' },
    { header: 'Pct Employés', accessor: 'pct_employes' },
    { header: 'Pct Ouvriers', accessor: 'pct_ouvriers' },
    { header: 'Pct Retraités', accessor: 'pct_retraites' },
    { header: 'Pct Autres sans activité pro.', accessor: 'pct_autres_sans_activite_prof' },
    { header: 'Pct Population 15-29', accessor: 'pct_population_15_29' },
    { header: 'Pct Population 30-44', accessor: 'pct_population_30_44' },
    { header: 'Pct Population 45-59', accessor: 'pct_population_45_59' },
    { header: 'Pct Population 60-74', accessor: 'pct_population_60_74' },
    { header: 'Pct Population 75+', accessor: 'pct_population_75_plus' },
    { header: 'Pct Abstentions', accessor: 'pct_abstentions' },
    { header: 'Pct Blancs et Nuls', accessor: 'pct_blancs_nuls' },
    { header: 'Exprimés', accessor: 'exprimes' },
    { header: 'Pct Vote Extrême Gauche', accessor: 'pct_vote_extreme_gauche' },
    { header: 'Pct Vote Gauche', accessor: 'pct_vote_gauche' },
    { header: 'Pct Vote Centre', accessor: 'pct_vote_centre' },
    { header: 'Pct Vote Droite', accessor: 'pct_vote_droite' },
    { header: 'Pct Vote Extrême Droite', accessor: 'pct_vote_extreme_droite' },
    { header: 'Parti Gagnant', accessor: 'parti_gagnant' },
    { header: 'Niveau de Richesse', accessor: 'niveau_richesse' },
  ];

  return (
      <Table<TElection>
        data={elections}
        columns={columns}
        caption="Tableau complet des élections"
      />
  );
};

export default AllElectionsTable;
