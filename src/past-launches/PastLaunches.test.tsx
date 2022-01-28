import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LaunchData } from '../models/LaunchData';
import * as spacexApi from '../services/spacex-api';
import PastLaunches from './PastLaunches';

const launchData: LaunchData = {
  name: faker.lorem.words(2),
  date_utc: faker.date.past().toUTCString(),
  details: faker.lorem.paragraph(),
  rocket: faker.datatype.uuid(),
};

describe('PastLaunches', () => {
  beforeEach((): void => {
    jest.spyOn(spacexApi, 'useGetPastLaunchesQuery').mockImplementation(() => {
      return {
        data: [launchData],
      } as any;
    });
  });

  it('renders the header', async () => {
    render(<PastLaunches />);

    expect(screen.getByText('50 Past Launches')).toBeInTheDocument();
  });

  it('renders the LaunchesTable component with the data fetched using the useGetPastLaunchesQuery spacex api hook', async () => {
    render(<PastLaunches />);

    expect(spacexApi.useGetPastLaunchesQuery).toHaveBeenCalled();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText(launchData.name)).toBeInTheDocument();
  });

  it('does not render the table when the data is undefined', async () => {
    jest.spyOn(spacexApi, 'useGetPastLaunchesQuery').mockImplementation(() => {
      return {
        data: undefined,
      } as any;
    });

    render(<PastLaunches />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
