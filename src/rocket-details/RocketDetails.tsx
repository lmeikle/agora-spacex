import { Box, Link, Modal, Typography } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useGetRocketDetailsQuery } from '../services/spacex-api';

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
  const { data, error, isLoading } = useGetRocketDetailsQuery(id ?? skipToken);

  // TODO - future work: handle error and isLoading states

  return (
    <Modal open={true} onClose={close} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        {data && (
          <>
            <Typography id="modal-title" variant="h6" component="h2">
              {data.name} Rocket Details
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              {data.description}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <Link href={data.wikipedia} target="_blank" rel="noopener">
                {data.wikipedia}
              </Link>
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default RocketDetails;
