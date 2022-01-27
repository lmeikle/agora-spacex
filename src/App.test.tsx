import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

jest.mock('./past-launches/PastLaunches', () => () => {
  return <div>Mock Past Launches</div>;
});

describe('PastLaunches', () => {
  it('renders the logo', () => {
    render(<App />);

    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('renders the PastLaunches component', () => {
    render(<App />);

    expect(screen.getByText('Mock Past Launches')).toBeInTheDocument();
  });
});
