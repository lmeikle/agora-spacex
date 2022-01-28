import { faker } from '@faker-js/faker';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import React from 'react';
import { RocketData } from '../models/RocketData';
import RocketDetails from './RocketDetails';

const id = faker.datatype.uuid();
const close = jest.fn();
const rocketData: RocketData = {
  name: faker.lorem.words(2),
  description: faker.lorem.paragraph(),
  wikipedia: faker.internet.url(),
};

describe('RocketDetails', () => {
  beforeEach((): void => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify(rocketData));
  });

  it('fetches the rocket details from the spacex api for the provided rocket id', async () => {
    render(<RocketDetails id={id} close={close} />);

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBe(1);
    });
    expect(fetchMock.mock.calls[0][0]).toBe(`https://api.spacexdata.com/v4/rockets/${id}`);
  });

  it('renders the fetched rocket data', async () => {
    render(<RocketDetails id={id} close={close} />);

    await waitFor(() => {
      expect(screen.getByText(`${rocketData.name} Rocket Details`)).toBeInTheDocument();
    });
    expect(screen.getByText(rocketData.description)).toBeInTheDocument();
    expect(screen.getByText(rocketData.wikipedia)).toBeInTheDocument();
  });

  it('closing the modal calls the close prop', async () => {
    render(<RocketDetails id={id} close={close} />);

    await waitFor(() => {
      expect(screen.getByText(`${rocketData.name} Rocket Details`)).toBeInTheDocument();
    });

    // close the modal
    fireEvent(
      document.querySelector('.MuiBackdrop-root') as Element,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(close).toHaveBeenCalled();
  });
});
