import { useElectionStore } from '@/store/ElectionStore';
import { TElection } from '@/types/ElectionType';
import { getColorsByPolitical } from '@/utils/politicalColors';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import styles from './ElectionTrendsChart.module.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

type PoliticalParty = 'extreme_gauche' | 'gauche' | 'centre' | 'droite' | 'extreme_droite';

const partyNames: Record<PoliticalParty, string> = {
  extreme_gauche: 'Extrême Gauche',
  gauche: 'Gauche',
  centre: 'Centre',
  droite: 'Droite',
  extreme_droite: 'Extrême Droite'
};

const ElectionTrendsChart: React.FC = () => {
  const allElections = useElectionStore((state) => state.elections);

  // Group elections by year for processing
  const electionsByYear = useMemo(() => {
    if (!allElections || allElections.length === 0) return {};

    const grouped: Record<number, TElection[]> = {};

    allElections.forEach((election) => {
      if (!grouped[election.annee]) {
        grouped[election.annee] = [];
      }
      grouped[election.annee].push(election);
    });

    return grouped;
  }, [allElections]);

  // Get available years in sorted order
  const availableYears = useMemo(() => {
    return Object.keys(electionsByYear)
      .map((year) => parseInt(year))
      .sort((a, b) => a - b);
  }, [electionsByYear]);

  // Calculate average vote percentage for each party by year
  const partyEvolutionData = useMemo(() => {
    const partyData: Record<PoliticalParty, number[]> = {
      extreme_gauche: [],
      gauche: [],
      centre: [],
      droite: [],
      extreme_droite: []
    };

    availableYears.forEach((year) => {
      const yearElections = electionsByYear[year] || [];
      if (yearElections.length === 0) return;

      // Calculate average vote percentage for each party this year
      const partyTotals: Record<PoliticalParty, number> = {
        extreme_gauche: 0,
        gauche: 0,
        centre: 0,
        droite: 0,
        extreme_droite: 0
      };

      yearElections.forEach((election) => {
        partyTotals.extreme_gauche += election.vote_extreme_gauche;
        partyTotals.gauche += election.vote_gauche;
        partyTotals.centre += election.vote_centre;
        partyTotals.droite += election.vote_droite;
        partyTotals.extreme_droite += election.vote_extreme_droite;
      });

      // Calculate averages and add to the arrays
      partyData.extreme_gauche.push(partyTotals.extreme_gauche);
      partyData.gauche.push(partyTotals.gauche);
      partyData.centre.push(partyTotals.centre);
      partyData.droite.push(partyTotals.droite);
      partyData.extreme_droite.push(partyTotals.extreme_droite);
    });

    return partyData;
  }, [electionsByYear, availableYears]);

  // Count winning parties by year
  const winningPartiesByYear = useMemo(() => {
    const winnerCounts: Record<number, Record<PoliticalParty, number>> = {};

    availableYears.forEach((year) => {
      const yearElections = electionsByYear[year] || [];

      winnerCounts[year] = {
        extreme_gauche: 0,
        gauche: 0,
        centre: 0,
        droite: 0,
        extreme_droite: 0
      };

      yearElections.forEach((election) => {
        if (election.parti_gagnant) {
          winnerCounts[year][election.parti_gagnant]++;
        }
      });
    });

    return winnerCounts;
  }, [electionsByYear, availableYears]);

  // Evolution chart data
  const evolutionChartData = useMemo(() => {
    return {
      labels: availableYears,
      datasets: [
        {
          label: partyNames.extreme_gauche,
          data: partyEvolutionData.extreme_gauche,
          borderColor: getColorsByPolitical('extreme_gauche'),
          backgroundColor: getColorsByPolitical('extreme_gauche'),
          tension: 0.2
        },
        {
          label: partyNames.gauche,
          data: partyEvolutionData.gauche,
          borderColor: getColorsByPolitical('gauche'),
          backgroundColor: getColorsByPolitical('gauche'),
          tension: 0.2
        },
        {
          label: partyNames.centre,
          data: partyEvolutionData.centre,
          borderColor: getColorsByPolitical('centre'),
          backgroundColor: getColorsByPolitical('centre'),
          tension: 0.2
        },
        {
          label: partyNames.droite,
          data: partyEvolutionData.droite,
          borderColor: getColorsByPolitical('droite'),
          backgroundColor: getColorsByPolitical('droite'),
          tension: 0.2
        },
        {
          label: partyNames.extreme_droite,
          data: partyEvolutionData.extreme_droite,
          borderColor: getColorsByPolitical('extreme_droite'),
          backgroundColor: getColorsByPolitical('extreme_droite'),
          tension: 0.2
        }
      ]
    };
  }, [availableYears, partyEvolutionData]);

  // Winners chart data
  const winnersChartData = useMemo(() => {
    const parties: PoliticalParty[] = ['extreme_gauche', 'gauche', 'centre', 'droite', 'extreme_droite'];

    return {
      labels: availableYears,
      datasets: parties.map((party) => ({
        label: partyNames[party],
        data: availableYears.map((year) => winningPartiesByYear[year][party]),
        backgroundColor: getColorsByPolitical(party),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1
      }))
    };
  }, [availableYears, winningPartiesByYear]);

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombres de votes'
        },
        ticks: {
          callback: (value: number) => value.toString()
        }
      },
      x: {
        title: {
          display: true,
          text: 'Année'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Évolution des votes par parti politique',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de cantons'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Année'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Nombre de cantons gagnés par parti politique',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y} cantons`
        }
      }
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartWrapper}>
        <Line data={evolutionChartData} options={lineChartOptions} />
        <Bar data={winnersChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default ElectionTrendsChart;
