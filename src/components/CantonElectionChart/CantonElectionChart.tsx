import { useElectionStore } from '@/store/ElectionStore';
import { TElection } from '@/types/ElectionType';
import { getColorsByPolitical } from '@/utils/politicalColors';
import {
  ArcElement,
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
import { useEffect, useState } from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import styles from './CantonElectionChart.module.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Chart type options
type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

export default function CantonElectionChart() {
  const allElections = useElectionStore((state) => state.elections);
  const getElectionsByAnnee = useElectionStore((state) => state.getElectionsByAnnee);

  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [selectedCanton, setSelectedCanton] = useState<string>('0401');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [yearlyData, setYearlyData] = useState<TElection[]>([]);
  const [cantonOptions, setCantonOptions] = useState<string[]>([]);
  const [yearOptions, setYearOptions] = useState<number[]>([]);

  // Extract available years and cantons
  useEffect(() => {
    if (allElections && allElections.length > 0) {
      // Get unique years
      const years = Array.from(new Set(allElections.map((election) => election.annee))).sort((a, b) => a - b);
      setYearOptions(years);

      // Get unique cantons
      const cantons = Array.from(new Set(allElections.map((election) => election.code_canton))).sort();
      setCantonOptions(cantons);

      // Get all data for the selected canton across years
      const cantonData = allElections
        .filter((election) => election.code_canton === selectedCanton)
        .sort((a, b) => a.annee - b.annee);

      setYearlyData(cantonData);
    }
  }, [allElections, selectedCanton]);

  // Effect to get data for selected year
  useEffect(() => {
    if (selectedYear) {
      getElectionsByAnnee(selectedYear);
    }
  }, [selectedYear, getElectionsByAnnee]);

  // Generate chart data for voting results
  const getVotingChartData = () => {
    if (yearlyData.length === 0) return null;

    if (chartType === 'line') {
      // Line chart showing trends over years
      return {
        labels: yearlyData.map((election) => election.annee),
        datasets: [
          {
            label: 'Extrême Gauche',
            data: yearlyData.map((election) => election.pct_vote_extreme_gauche),
            borderColor: getColorsByPolitical('extreme_gauche'),
            backgroundColor: getColorsByPolitical('extreme_gauche'),
            tension: 0.1
          },
          {
            label: 'Gauche',
            data: yearlyData.map((election) => election.pct_vote_gauche),
            borderColor: getColorsByPolitical('gauche'),
            backgroundColor: getColorsByPolitical('gauche'),
            tension: 0.1
          },
          {
            label: 'Centre',
            data: yearlyData.map((election) => election.pct_vote_centre),
            borderColor: getColorsByPolitical('centre'),
            backgroundColor: getColorsByPolitical('centre'),
            tension: 0.1
          },
          {
            label: 'Droite',
            data: yearlyData.map((election) => election.pct_vote_droite),
            borderColor: getColorsByPolitical('droite'),
            backgroundColor: getColorsByPolitical('droite'),
            tension: 0.1
          },
          {
            label: 'Extrême Droite',
            data: yearlyData.map((election) => election.pct_vote_extreme_droite),
            borderColor: getColorsByPolitical('extreme_droite'),
            backgroundColor: getColorsByPolitical('extreme_droite'),
            tension: 0.1
          }
        ]
      };
    } else {
      // Current year data for bar/pie/doughnut
      const currentYearData =
        yearlyData.find((election) => election.annee === selectedYear) || yearlyData[yearlyData.length - 1];

      if (!currentYearData) return null;

      const labels = ['Extrême Gauche', 'Gauche', 'Centre', 'Droite', 'Extrême Droite'];
      const data = [
        currentYearData.pct_vote_extreme_gauche,
        currentYearData.pct_vote_gauche,
        currentYearData.pct_vote_centre,
        currentYearData.pct_vote_droite,
        currentYearData.pct_vote_extreme_droite
      ];
      const backgroundColor = [
        getColorsByPolitical('extreme_gauche'),
        getColorsByPolitical('gauche'),
        getColorsByPolitical('centre'),
        getColorsByPolitical('droite'),
        getColorsByPolitical('extreme_droite')
      ];

      return {
        labels,
        datasets: [
          {
            label: `Résultats électoraux ${currentYearData.annee}`,
            data,
            backgroundColor,
            borderColor: backgroundColor,
            borderWidth: 1
          }
        ]
      };
    }
  };

  // Generate demographic chart data
  const getDemographicChartData = () => {
    if (yearlyData.length === 0) return null;

    // Get data for the selected year
    const currentYearData =
      yearlyData.find((election) => election.annee === selectedYear) || yearlyData[yearlyData.length - 1];

    if (!currentYearData) return null;

    // Demographic labels and data
    const labels = [
      'Agriculteurs',
      'Artisans/Commerçants',
      'Cadres',
      'Prof. Intermédiaires',
      'Employés',
      'Ouvriers',
      'Retraités',
      'Autres'
    ];

    const data = [
      currentYearData.pct_agriculteurs_exploitants,
      currentYearData.pct_artisans_comm_chefs_entr,
      currentYearData.pct_cadres_prof_intel_sup,
      currentYearData.pct_professions_intermediaires,
      currentYearData.pct_employes,
      currentYearData.pct_ouvriers,
      currentYearData.pct_retraites,
      currentYearData.pct_autres_sans_activite_prof
    ];

    // Custom colors for demographic categories
    const backgroundColor = [
      '#7CB342', // green for farmers
      '#FF9800', // orange for artisans/business owners
      '#1E88E5', // blue for executives
      '#42A5F5', // light blue for intermediate professions
      '#26A69A', // teal for employees
      '#78909C', // blue-grey for workers
      '#9E9E9E', // grey for retirees
      '#BDBDBD' // light grey for others
    ];

    return {
      labels,
      datasets: [
        {
          labels: `Démographie ${currentYearData.annee}`,
          data,
          backgroundColor,
          borderColor: backgroundColor.map((color) => color),
          borderWidth: 1
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: `Résultats électoraux - Canton ${selectedCanton}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pourcentage (%)'
        }
      }
    }
  };

  // Demographic chart options
  const demographicChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: `Démographie - Canton ${selectedCanton} ${selectedYear}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pourcentage (%)'
        }
      }
    }
  };

  // Render the appropriate chart type
  const renderChart = () => {
    const data = getVotingChartData();
    if (!data) return <div>No data available</div>;

    switch (chartType) {
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={chartOptions} />;
      default:
        return <Bar data={data} options={chartOptions} />;
    }
  };

  // Render the demographic chart
  const renderDemographicChart = () => {
    const data = getDemographicChartData();
    if (!data) return <div>No demographic data available</div>;

    return <Bar data={data} options={demographicChartOptions} />;
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label htmlFor="cantonSelect">Canton:</label>
          <select
            id="cantonSelect"
            value={selectedCanton}
            onChange={(e) => setSelectedCanton(e.target.value)}
            className={styles.select}
          >
            {cantonOptions.map((canton) => (
              <option key={canton} value={canton}>
                {canton}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="chartTypeSelect">Type de graphique:</label>
          <select
            id="chartTypeSelect"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className={styles.select}
          >
            <option value="bar">Barres</option>
            <option value="line">Ligne (tendance)</option>
            <option value="pie">Camembert</option>
            <option value="doughnut">Anneau</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="yearSelect">Année:</label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={styles.select}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.chartWrapper}>{renderChart()}</div>

      {/* Display some additional info */}
      {yearlyData.find((election) => election.annee === selectedYear) && (
        <div className={styles.statsContainer}>
          <h3>Statistiques supplémentaires</h3>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Population:</span>
              <span className={styles.statValue}>
                {yearlyData.find((e) => e.annee === selectedYear)?.population.toLocaleString()}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Abstentions:</span>
              <span className={styles.statValue}>
                {yearlyData.find((e) => e.annee === selectedYear)?.pct_abstentions.toFixed(2)}%
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Votes exprimés:</span>
              <span className={styles.statValue}>
                {yearlyData.find((e) => e.annee === selectedYear)?.exprimes.toLocaleString()}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Parti gagnant:</span>
              <span className={styles.statValue}>
                {yearlyData.find((e) => e.annee === selectedYear)?.parti_gagnant}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Hommes:</span>
              <span className={styles.statValue}>
                {yearlyData.find((e) => e.annee === selectedYear)?.pct_population_hommes.toFixed(2)}%
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Impôt moyen:</span>
              <span className={styles.statValue}>
                {yearlyData.find((e) => e.annee === selectedYear)?.impot_moyen.toLocaleString()} €
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.chartWrapper} style={{ marginTop: '20px' }}>
        {renderDemographicChart()}
      </div>
    </div>
  );
}
