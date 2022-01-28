import { faker } from '@faker-js/faker';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { RocketData } from '../models/RocketData';
import * as spacexApi from '../services/spacex-api';
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
    jest.spyOn(spacexApi, 'useGetRocketDetailsQuery').mockImplementation(() => {
      return {
        data: rocketData,
      } as any;
    });
  });

  it('renders the data fetched using the useGetRocketDetailsQuery spacex api hook', async () => {
    render(<RocketDetails id={id} close={close} />);

    expect(spacexApi.useGetRocketDetailsQuery).toHaveBeenCalled();
    expect(screen.getByText(`${rocketData.name} Rocket Details`)).toBeInTheDocument();
    expect(screen.getByText(rocketData.description)).toBeInTheDocument();
    expect(screen.getByText(rocketData.wikipedia)).toBeInTheDocument();
  });

  it('closing the modal calls the close prop', async () => {
    render(<RocketDetails id={id} close={close} />);

    expect(screen.getByText(`${rocketData.name} Rocket Details`)).toBeInTheDocument();

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
