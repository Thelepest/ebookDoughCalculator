import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/PH4\.1/i);
  expect(titleElement).toBeInTheDocument();
});
