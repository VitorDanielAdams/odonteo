import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/Login';
import fetchApi from './utils/fetch.js';

function renderElement(element) {
    render(
        <BrowserRouter>
          { element }
        </BrowserRouter>
    );
}

const expectedEmail = 'vitor.adams@email.com';
const expectedPassword = '123456@Aa';

describe('Test usage of Login page', () => { 

    beforeEach(() => {
        Object.defineProperty(window, "localStorage", {
            value: {
              getItem: jest.fn(() => null),
              setItem: jest.fn(() => null)
            },
            writable: true
        });
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ email: expectedEmail, password: expectedPassword })
        }));
    });

    it('Should login when data is entered and click login button', async () => {
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
                body: JSON.stringify({email: 'vitor.adams@email.com', password: '123456@Aa'})
            }   
        );

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
            "email": "vitor.adams@email.com",
            "password": "123456@Aa",
        });
    })
})