import { faker } from '@faker-js/faker';
import { render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import React from 'react';
import { LaunchData } from '../models/LaunchData';
import PastLaunches from './PastLaunches';

const launchData: LaunchData = {
  name: faker.lorem.words(2),
  date_utc: faker.date.past().toUTCString(),
  details: faker.lorem.paragraph(),
  rocket: faker.datatype.uuid(),
};

describe('PastLaunches', () => {
  beforeEach((): void => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(
      JSON.stringify({
        docs: [launchData],
      }),
    );
  });

  it('renders the header', async () => {
    render(<PastLaunches />);

    await waitFor(() => {
      expect(screen.getByText('50 Past Launches')).toBeInTheDocument();
    });
  });

  it('fetches the past launches from the spacex api', async () => {
    render(<PastLaunches />);

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBe(1);
    });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.spacexdata.com/v4/launches/query');
    expect(fetchMock.mock.calls[0][1]!.method).toBe('POST');
    // @ts-ignore just ignoring these TS errors for speed
    expect(fetchMock.mock.calls[0][1]!.headers['Content-Type']).toBe('application/json');
    // @ts-ignore just ignoring these TS errors for speed
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body).query).toEqual({});
    // @ts-ignore just ignoring these TS errors for speed
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body).options).toEqual({
      select: ['name', 'date_utc', 'details', 'rocket'],
      sort: '-date_utc',
      limit: 50,
    });
  });

  it('renders the LaunchesTable component with the launch data', async () => {
    render(<PastLaunches />);

    expect(screen.getByRole('table')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(launchData.name)).toBeInTheDocument();
    });
  });
});
