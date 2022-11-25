import { render, screen } from '@testing-library/react';
import App from './App';
import { createBrowserHistory } from 'history';

describe('Test of routes', () => {
  beforeEach(() => {
    const currentState = window.history.state;
    window.history.replaceState(currentState, '', '/');
  });

  it('Should render Login page when path is /login', () => {
    window.history.pushState({}, 'Login page', '/login');
    render(<App />);
    const loginPage = screen.getByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  it('Should redirect and render login page when path is /', () => {
    window.history.pushState({}, 'Redirect page', '/');
    render(<App />);
    const loginPage = screen.getByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  

});
