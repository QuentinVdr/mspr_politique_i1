import { TElection } from '@/types/ElectionType';
import Papa from 'papaparse';

export const fetchCsvData = () =>
  fetch('data/data_csp_election.csv')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then((csvString) => {
      return Papa.parse<TElection>(csvString, {
        header: true,
        skipEmptyLines: true
      });
    });
