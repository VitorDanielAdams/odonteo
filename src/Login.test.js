import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/Login';
import fetchApi from './utils/fetch';

function renderElement(element) {
    render(
        <BrowserRouter>
          { element }
        </BrowserRouter>
    );
}

const response = {message: 'incorreto', user: { id: '2' }, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'};

const expectedEmail = 'vitor.adams@email.com';
const expectedPassword = '123456@Aa';

describe('Test usage of Login page', () => { 

    it('Should login when data is entered and click login button and return error message', async () => {
        renderElement(<Login />);
        
        const email = screen.getByTestId('email');
        expect(email).toBeInTheDocument();
        fireEvent.change(email, { target: {
            value: 'vitor.adams@email.com'
        }});
        expect(email).toHaveValue('vitor.adams@email.com');

        const password = screen.getByTestId('password');
        expect(password).toBeInTheDocument();
        fireEvent.change(password, { target: {
            value: '123456@Aa'
        }});
        expect(password).toHaveValue('123456@Aa');

        const button = screen.getByText(/entrar/i);
        fireEvent.click(button);

        const result = await fetchApi('https://odonteo-backend.herokuapp.com/login', 
            {
                method: 'POST',
                body: JSON.stringify({email: expectedEmail, password: expectedPassword})
            }   
        );
        expect(result.message).toContain('incorreto');
        
        await waitFor(() => expect(screen.getByText(/usuário ou senha incorretos/i)).toBeInTheDocument());
    });

    it('Should login when data is entered and click login button and return user, token', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(response)
        }));
        
        renderElement(<Login />);
        
        const email = screen.getByTestId('email');
        expect(email).toBeInTheDocument();
        fireEvent.change(email, { target: {
            value: 'vitor.adams@email.com'
        }});
        expect(email).toHaveValue('vitor.adams@email.com');

        const password = screen.getByTestId('password');
        expect(password).toBeInTheDocument();
        fireEvent.change(password, { target: {
            value: '123456@Aa'
        }});
        expect(password).toHaveValue('123456@Aa');

        const button = screen.getByText(/entrar/i);
        fireEvent.click(button);

        const result = await fetchApi('https://odonteo-backend.herokuapp.com/login', 
            {
                method: 'POST',
                body: JSON.stringify({email: expectedEmail, password: expectedPassword})
            }   
        );
        expect(result.user.id).toContain('2');
        expect(result.token).not.toBeNull();
    });

    it('should enter the login page and enter an invalid email', async () => {
        renderElement(<Login />);
        
        const email = screen.getByTestId('email');
        expect(email).toBeInTheDocument();
        fireEvent.change(email, { target: {
            value: 'emailinvalido'
        }});
        expect(email).toHaveValue('emailinvalido');
        
        const button = screen.getByText(/entrar/i);
        fireEvent.click(button);
        
        expect(screen.getByText(/email ou senha em formato incorreto/i)).toBeInTheDocument();
    });

    it('should enter the login page and enter an invalid password', async () => {
        renderElement(<Login />);
        
        const password = screen.getByTestId('password');
        expect(password).toBeInTheDocument();
        fireEvent.change(password, { target: {
            value: 'passwordinvalida'
        }});
        expect(password).toHaveValue('passwordinvalida');
        
        const button = screen.getByText(/entrar/i);
        fireEvent.click(button);
        
        expect(screen.getByText(/email ou senha em formato incorreto/i)).toBeInTheDocument();
    });
 
});