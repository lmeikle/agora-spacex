import { Box, Button, TableSortLabel } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';
import { LaunchData } from '../models/LaunchData';
import { SortOrder } from '../models/SortOrder';
import RocketDetails from '../rocket-details/RocketDetails';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: SortOrder,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface Props {
  launchData: LaunchData[];
}

function LaunchesTable({ launchData }: Props) {
  const [sortedData, setSortedData] = React.useState<LaunchData[]>(launchData);
  const [order, setOrder] = React.useState<SortOrder>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof LaunchData>('date_utc');
  const [rocketId, setRocketId] = useState<any>();

  const onSort = (property: keyof LaunchData): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    setSortedData([...launchData].sort(getComparator(order, orderBy)));
  }, [order, orderBy, launchData]);

  const clearRocketId = () => {
    setRocketId(undefined);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 250 }} aria-label="Launches Table">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '60%' }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell key={'name'} sortDirection={orderBy === 'name' ? order : 'asc'}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? (order as 'asc' | 'desc') : 'asc'}
                  onClick={() => onSort('name')}
                >
                  Name
                  {orderBy === 'name' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell key={'date'} sortDirection={orderBy === 'date_utc' ? order : 'asc'}>
                <TableSortLabel
                  active={orderBy === 'date_utc'}
                  direction={orderBy === 'date_utc' ? (order as 'asc' | 'desc') : 'asc'}
                  onClick={() => onSort('date_utc')}
                >
                  Date
                  {orderBy === 'date_utc' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((launch) => (
              <TableRow key={launch.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell style={{ verticalAlign: 'top' }}>{launch.name}</TableCell>
                <TableCell style={{ verticalAlign: 'top' }}>{new Date(launch.date_utc).toLocaleString()}</TableCell>
                <TableCell>
                  <div>
                    <div data-testid="details">{launch.details}</div>
                    <Button variant="outlined" size="small" onClick={() => setRocketId(launch.rocket)}>
                      View Rocket Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <RocketDetails id={rocketId} close={clearRocketId} />
    </div>
  );
}

export default LaunchesTable;
