import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LaunchesTable from '../launches-table/LaunchesTable';
import { LaunchData } from '../models/LaunchData';
import './PastLaunches.css';

function PastLaunches() {
  const [launchData, setLaunchData] = useState<LaunchData[]>([]);

  useEffect(() => {
    const data = {
      query: {},
      options: {
        select: ['name', 'date_utc', 'details', 'rocket'],
        sort: '-date_utc',
        limit: 50,
      },
    };

    fetch('https://api.spacexdata.com/v4/launches/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setLaunchData(data.docs);
      })
      .catch((e) => {
        // todo error handing
      });
  }, [setLaunchData]);

  return (
    <div className="PastLaunches">
      <Typography variant="h5" component="h1">
        50 Past Launches
      </Typography>
      <LaunchesTable launchData={launchData} />
    </div>
  );
}

export default PastLaunches;
