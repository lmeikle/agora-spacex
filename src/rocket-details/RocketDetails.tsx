import { Box, Link, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RocketData } from '../models/RocketData';

interface Props {
  id: string;
  close: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function RocketDetails({ id, close }: Props) {
  const [rocketData, setRocketData] = useState<RocketData | undefined>();

  useEffect(() => {
    if (id) {
      fetch(`https://api.spacexdata.com/v4/rockets/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setRocketData({
            name: data.name,
            description: data.description,
            wikipedia: data.wikipedia,
          });
        })
        .catch((e) => {
          // todo error handing
        });
    }
  }, [id, setRocketData]);

  return (
    <Modal open={id !== undefined} onClose={close} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        {rocketData && (
          <>
            <Typography id="modal-title" variant="h6" component="h2">
              {rocketData.name} Rocket Details
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              {rocketData.description}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <Link href={rocketData.wikipedia} target="_blank" rel="noopener">
                {rocketData.wikipedia}
              </Link>
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default RocketDetails;
