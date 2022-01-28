import { faker } from '@faker-js/faker';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { LaunchData } from '../models/LaunchData';
import LaunchesTable from './LaunchesTable';

jest.mock('../rocket-details/RocketDetails', () => ({ id, close }: { id: string; close: () => void }) => {
  return (
    <>
      <div>Mock Rocket Details</div>
      <div data-testid="rocket-id">{id}</div>
      <button onClick={close}>Close</button>
    </>
  );
});

const launchEntry1 = {
  name: 'foo',
  date_utc: '2022-01-01T00:00:00.000Z',
  details: faker.lorem.paragraph(),
  rocket: faker.datatype.uuid(),
};
const launchEntry2 = {
  name: 'bar',
  date_utc: '2022-01-02T00:00:00.000Z',
  details: faker.lorem.paragraph(),
  rocket: faker.datatype.uuid(),
};
const launchData: LaunchData[] = [launchEntry1, launchEntry2];

const assertTableRendersCorrectly = async (sortedData: LaunchData[]) => {
  const tableEl = screen.getByRole('table');

  const tableRows = tableEl.querySelectorAll('tbody tr');
  const firstRow = tableRows[0].querySelectorAll('td');
  expect(firstRow[0].textContent).toBe(sortedData[0].name);
  expect(firstRow[1].textContent).toBe(new Date(sortedData[0].date_utc).toLocaleString());
  expect(firstRow[2].querySelector('[data-testid="details"]')!.textContent).toBe(sortedData[0].details);

  const secondRow = tableRows[1].querySelectorAll('td');
  expect(secondRow[0].textContent).toBe(sortedData[1].name);
  expect(secondRow[1].textContent).toBe(new Date(sortedData[1].date_utc).toLocaleString());
  expect(secondRow[2].querySelector('[data-testid="details"]')!.textContent).toBe(sortedData[1].details);
};

describe('LaunchesTable', () => {
  it('renders the provided launch data, sorted by descending date order', async () => {
    render(<LaunchesTable launchData={launchData} />);

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    expect(screen.getByText('Date').closest('th')).toHaveAttribute('aria-sort', `descending`);
  });

  it('clicking the date header sorts the data by date', async () => {
    render(<LaunchesTable launchData={launchData} />);

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    expect(screen.getByText('Date').closest('th')).toHaveAttribute('aria-sort', `descending`);

    fireEvent(
      screen.getByText('Date'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await assertTableRendersCorrectly([launchEntry1, launchEntry2]);

    expect(screen.getByText('Date').closest('th')).toHaveAttribute('aria-sort', `ascending`);

    fireEvent(
      screen.getByText('Date'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    expect(screen.getByText('Date').closest('th')).toHaveAttribute('aria-sort', `descending`);
  });

  it('clicking the name header sorts the data by name', async () => {
    render(<LaunchesTable launchData={launchData} />);

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    expect(screen.getByText('Name').closest('th')).toHaveAttribute('aria-sort', `ascending`);

    fireEvent(
      screen.getByText('Name'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    expect(screen.getByText('Name').closest('th')).toHaveAttribute('aria-sort', `ascending`);

    fireEvent(
      screen.getByText('Name'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    await assertTableRendersCorrectly([launchEntry1, launchEntry2]);

    expect(screen.getByText('Name').closest('th')).toHaveAttribute('aria-sort', `descending`);
  });

  it('the table cannot be sorted by details', async () => {
    render(<LaunchesTable launchData={launchData} />);

    await assertTableRendersCorrectly([launchEntry2, launchEntry1]);

    expect(screen.getByText('Details').closest('th')).not.toHaveAttribute('aria-sort');
  });

  it('clicking a View Rocket Details button shows the RocketDetails component', async () => {
    render(<LaunchesTable launchData={launchData} />);

    fireEvent(
      screen.getAllByText('View Rocket Details')[0],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(screen.getByText('Mock Rocket Details')).toBeInTheDocument();
    expect(screen.getByTestId('rocket-id').textContent).toBe(launchEntry2.rocket);

    fireEvent(
      screen.getByText('Close'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(screen.queryByText('Mock Rocket Details')).not.toBeInTheDocument();
  });
});
