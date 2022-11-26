import { render, screen } from '@testing-library/react';
import App from './App';

describe('Test of routes', () => {
  beforeEach(() => {
    const currentState = window.history.state;
    window.history.replaceState(currentState, '', '/');
    window.localStorage.removeItem('token')
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

  it('Should render Main page when path is /', () => {
    window.localStorage.setItem(
      'token',
      JSON.stringify(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      )
    );
    window.history.pushState({}, 'Main page', '/');
    render(<App />);
    const mainPage = screen.getByTestId('main-page');
    expect(mainPage).toBeInTheDocument();
  });

});
