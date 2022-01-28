import { Typography } from '@mui/material';
import React from 'react';
import LaunchesTable from '../launches-table/LaunchesTable';
import { useGetPastLaunchesQuery } from '../services/spacex-api';
import './PastLaunches.css';

function PastLaunches() {
  const { data, error, isLoading } = useGetPastLaunchesQuery({} as any);

  // TODO - future work: handle error and isLoading states

  return (
    <div className="PastLaunches">
      <Typography variant="h5" component="h1">
        50 Past Launches
      </Typography>
      {data && <LaunchesTable launchData={data} />}
    </div>
  );
}

export default PastLaunches;
