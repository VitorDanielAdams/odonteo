import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/Login';

function renderElement(element) {
    render(
        <BrowserRouter>
          { element }
        </BrowserRouter>
    );
}

const fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ email: expectedEmail, password: expectedPassword })
}));

const expectedEmail = 'vitor.adams@email.com';
const expectedPassword = '123456@Aa';

describe('Test usage of Login page', () => { 

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

        const result = await fetch('https://odonteo-backend.herokuapp.com/login', 
            {
                method: 'POST',
                body: JSON.stringify({email: 'vitor.adams@email.com', password: '123456@Aa'})
            }   
        );

        expect(fetch).toHaveBeenCalledTimes(1);
    })
})