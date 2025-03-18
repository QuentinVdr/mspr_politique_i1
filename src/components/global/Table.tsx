import React, { useState } from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
};

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  className?: string;
  enablePagination?: boolean; // Active/désactive la pagination
  rowsPerPage?: number;       // Nombre de lignes par page (défaut: 10)
}

// Fonction de transformation pour garantir que le contenu est un ReactNode
function renderCellContent(content: any): React.ReactNode {
  if (React.isValidElement(content)) return content;
  if (content === null || content === undefined) return '';
  if (
    typeof content === 'string' ||
    typeof content === 'number' ||
    typeof content === 'boolean'
  ) {
    return content.toString();
  }
  return JSON.stringify(content);
}

const Table = <T extends object>({
                                   data,
                                   columns,
                                   caption,
                                   className,
                                   enablePagination = false,
                                   rowsPerPage = 10,
                                 }: TableProps<T>) => {
  const [page, setPage] = useState(1);

  // Si la pagination est activée, on découpe les données
  const paginatedData = enablePagination
    ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : data;

  const totalPages = enablePagination ? Math.ceil(data.length / rowsPerPage) : 1;

  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box>
      <TableContainer component={Paper} className={className}>
        {caption && (
          <Typography variant="h6" component="div" sx={{ p: 2 }}>
            {caption}
          </Typography>
        )}
        <MuiTable>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx}>{col.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((col, colIdx) => {
                  const cellContent =
                    typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : row[col.accessor];
                  return (
                    <TableCell key={colIdx}>
                      {renderCellContent(cellContent)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {enablePagination && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default Table;
