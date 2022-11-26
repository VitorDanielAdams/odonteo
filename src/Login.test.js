import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import fetchApi from './utils/fetch';

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
        fireEvent.submit(button);

        const result = await fetchApi('https://odonteo-backend.herokuapp.com/login', 
            {
                method: 'POST',
                body: JSON.stringify({email: expectedEmail, password: expectedPassword})
            }   
        );

        expect(result.message).toContain('incorreto');
    })

})