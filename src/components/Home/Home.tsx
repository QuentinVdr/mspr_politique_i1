import { useElectionStore } from '@/store/ElectionStore';

export default function Home() {
  const elections = useElectionStore((state) => state.elections);

  return (
    <div>
      <h2>CSV Data</h2>
      {elections.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(elections[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {elections.map((row) => (
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
