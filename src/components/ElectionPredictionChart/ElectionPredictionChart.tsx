import { useElectionStore } from '@/store/ElectionStore';
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
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './ElectionPredictionChart.module.css';

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

export default function ElectionPredictionChart() {
  const availableYears = useElectionStore((state) => state.getPredictionsAnnees);
  const predictionsByYear = useElectionStore((state) => state.getPredictionsByAnnee);

  // Count winning parties by year
  const winningPartiesByYear = useMemo(() => {
    const winnerCounts: Record<number, Record<PoliticalParty, number>> = {};

    availableYears().forEach((year) => {
      const yearElections = predictionsByYear(year) || [];

      winnerCounts[year] = {
        extreme_gauche: 0,
        gauche: 0,
        centre: 0,
        droite: 0,
        extreme_droite: 0
      };

      yearElections.forEach((election) => {
        if (election.parti_gagnant) {
          winnerCounts[year][election.parti_gagnant as PoliticalParty]++;
        }
      });
    });

    return winnerCounts;
  }, [predictionsByYear, availableYears]);

  // Winners chart data
  const winnersChartData = useMemo(() => {
    const parties: PoliticalParty[] = ['extreme_gauche', 'gauche', 'centre', 'droite', 'extreme_droite'];

    return {
      labels: availableYears(),
      datasets: parties.map((party) => ({
        label: partyNames[party],
        data: availableYears().map((year) => winningPartiesByYear[year][party]),
        backgroundColor: getColorsByPolitical(party),
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1
      }))
    };
  }, [availableYears, winningPartiesByYear]);

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
      <div className={styles.chartSection}>
        <div className={styles.chartWrapper}>
          <Bar data={winnersChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}
