import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { TElection } from './types/ElectionType';

function App() {
  const [data, setData] = useState<TElection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('data/data_csp_election.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((csvString) => {
        const result = Papa.parse<TElection>(csvString, {
          header: true,
          skipEmptyLines: true
        });
        setData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  return (
    <div>
      <h2>CSV Data</h2>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={`${row.code_canton}-${row.annee}`}>
                {Object.entries(row).map(([key, value]) => (
                  <td key={key}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default App;
