import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Main from './pages/Main/Main';

function renderElement(element) {
    render(
        <BrowserRouter>
          { element }
        </BrowserRouter>
    );
}

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedNavigator,
}));

describe('Test usage of Main page', () => { 

    beforeEach(() => {
        const currentState = window.history.state;
        window.history.replaceState(currentState, '', '/');
        window.localStorage.setItem(
            'token',
            JSON.stringify(
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            )
        );
        window.localStorage.setItem(
            'user',
            JSON.stringify(
              {id: '2' }
            )
        ); 
    });

    it('Should change input values and fail validations', async () => {
        renderElement(<Main />);

        const mainPage = screen.getByTestId('main-page');
        expect(mainPage).toBeInTheDocument();
        
        const amount = screen.getByTestId('amount');
        expect(amount).toBeInTheDocument();
        fireEvent.change(amount, { target: {
            value: '-2'
        }});
        expect(amount).toHaveValue(-2);

        const installments = screen.getByTestId('installments');
        expect(installments).toBeInTheDocument();
        fireEvent.change(installments, { target: {
            value: '0'
        }});
        expect(installments).toHaveValue(0);

        const billing_day = screen.getByTestId('billing-day');
        expect(billing_day).toBeInTheDocument();
        fireEvent.change(billing_day, { target: {
            value: '5.5'
        }});
        expect(billing_day).toHaveValue(5.5);

        const first_installment_date = screen.getByTestId('first-installment-date');
        expect(first_installment_date).toBeInTheDocument();
        fireEvent.change(first_installment_date, { target: {
            value: '2022-11-25'
        }});
        expect(first_installment_date).toHaveValue('2022-11-25');

        const button = screen.getByText(/registrar/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);

        await waitFor(() => expect(screen.getByText(/informações em formato incorreto/i)).toBeInTheDocument());
    });

    it('Should change input values and on clicking run api button successfully', async () => {
        renderElement(<Main />);

        const mainPage = screen.getByTestId('main-page');
        expect(mainPage).toBeInTheDocument();

        const button = screen.getByText(/ver extrato/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        
        await waitFor(() => expect(mockedNavigator).toHaveBeenCalledWith('/statement'));    
    });

});