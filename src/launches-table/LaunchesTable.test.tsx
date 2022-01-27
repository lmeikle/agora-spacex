import { faker } from '@faker-js/faker';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { LaunchData } from '../models/LaunchData';
import LaunchesTable from './LaunchesTable';

const launchEntry1 = {
  name: 'foo',
  date_utc: '2022-01-01T00:00:00.000Z',
  details: faker.lorem.paragraph(),
};
const launchEntry2 = {
  name: 'bar',
  date_utc: '2022-01-02T00:00:00.000Z',
  details: faker.lorem.paragraph(),
};
const launchData: LaunchData[] = [launchEntry1, launchEntry2];

const assertTableRendersCorrectly = async (sortedData: LaunchData[]) => {
  const tableEl = screen.getByRole('table');

  await waitFor(() => {
    expect(screen.getByText(launchData[0].name)).toBeInTheDocument();
  });

  // eslint-disable-next-line testing-library/no-node-access
  const tableRows = tableEl.querySelectorAll('tbody tr');
  // eslint-disable-next-line testing-library/no-node-access
  const firstRow = tableRows[0].querySelectorAll('td');
  expect(firstRow[0].textContent).toBe(sortedData[0].name);
  expect(firstRow[1].textContent).toBe(new Date(sortedData[0].date_utc).toLocaleString());
  expect(firstRow[2].textContent).toBe(sortedData[0].details);

  // eslint-disable-next-line testing-library/no-node-access
  const secondRow = tableRows[1].querySelectorAll('td');
  expect(secondRow[0].textContent).toBe(sortedData[1].name);
  expect(secondRow[1].textContent).toBe(new Date(sortedData[1].date_utc).toLocaleString());
  expect(secondRow[2].textContent).toBe(sortedData[1].details);
};

describe('LaunchesTable', () => {
  it('renders the provided launch data, sorted by descending date order', async () => {
    render(<LaunchesTable launchData={launchData} />);

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText('Date').closest('th')).toHaveAttribute('aria-sort', `descending`);
  });

  it('clicking the date header sorts the data by date', async () => {
    render(<LaunchesTable launchData={launchData} />);

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText('Date').closest('th')).toHaveAttribute('aria-sort', `descending`);

    fireEvent(
      screen.getByText('Date'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await assertTableRendersCorrectly([launchEntry1, launchEntry2]);

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText('Date').closest('th')).toHaveAttribute('aria-sort', `ascending`);

    fireEvent(
      screen.getByText('Date'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText('Date').closest('th')).toHaveAttribute('aria-sort', `descending`);
  });

  it('clicking the name header sorts the data by name', async () => {
    render(<LaunchesTable launchData={launchData} />);

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText('Name').closest('th')).toHaveAttribute('aria-sort', `ascending`);

    fireEvent(
      screen.getByText('Name'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText('Name').closest('th')).toHaveAttribute('aria-sort', `ascending`);

    fireEvent(
      screen.getByText('Name'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await assertTableRendersCorrectly([launchEntry1, launchEntry2]);

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText('Name').closest('th')).toHaveAttribute('aria-sort', `descending`);
  });

  it('the table cannot be sorted by details', async () => {
    render(<LaunchesTable launchData={launchData} />);

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByText('Details').closest('th')).not.toHaveAttribute('aria-sort');
  });
});
