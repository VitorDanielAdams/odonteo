import { fireEvent, queryAllByTestId, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Statement from './pages/Statement/Statement';
import fetchApi from './utils/fetch';

function renderElement(element) {
    render(
        <BrowserRouter>
          { element }
        </BrowserRouter>
    );
}

const response = 5;

const mockedNavigator = jest.fn();

jest.mock("react-router-dom", () => ({
    ...(jest.requireActual("react-router-dom")),
    useNavigate: () => mockedNavigator,
}));

describe('Test usage of Statement page', () => { 

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
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(response)
        }));
    });

    it('Should change the date values and click on the button to see billing showing the results in the table', () => {
        renderElement(<Statement />);

        const statementPage = screen.getByTestId('statement-page');
        expect(statementPage).toBeInTheDocument();
        
        const beginning_date = screen.getByTestId('beginning-date');
        expect(beginning_date).toBeInTheDocument();
        fireEvent.change(beginning_date, { target: {
            value: '2022-10-25'
        }});
        expect(beginning_date).toHaveValue('2022-10-25');

        const ending_date = screen.getByTestId('ending-date');
        expect(ending_date).toBeInTheDocument();
        fireEvent.change(ending_date, { target: {
            value: '2022-11-25'
        }});
        expect(ending_date).toHaveValue('2022-11-25');

        const button = screen.getByText(/Consultar faturamento/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);

        expect(screen.getByText(/Total/i)).toBeInTheDocument();
        expect(screen.getByText(/R$/i)).toBeInTheDocument();
    });

    it('Should change the values of the inputs and test the api', async () => {
        renderElement(<Statement />);

        const statementPage = screen.getByTestId('statement-page');
        expect(statementPage).toBeInTheDocument();
        
        const beginning_date = screen.getByTestId('beginning-date');
        expect(beginning_date).toBeInTheDocument();
        fireEvent.change(beginning_date, { target: {
            value: '2022-10-25'
        }});
        expect(beginning_date).toHaveValue('2022-10-25');

        const ending_date = screen.getByTestId('ending-date');
        expect(ending_date).toBeInTheDocument();
        fireEvent.change(ending_date, { target: {
            value: '2022-11-25'
        }});
        expect(ending_date).toHaveValue('2022-11-25');

        const button = screen.getByText(/Consultar faturamento/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);

        const result = await fetchApi(`https://odonteo-backend.herokuapp.com/income/2`, 
            { method: 'GET' }, 
            true   
        );
        await waitFor(() => expect(result).toEqual(5));
    });

    it('Should must click on the button to close the table and the table disappears', async () => {
        renderElement(<Statement />);

        const button = screen.getByText(/Consultar faturamento/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);

        const close = screen.getByText(/x/i);
        expect(close).toBeInTheDocument();
        fireEvent.click(close);

        expect(await screen.queryByTestId('table')).toBeNull();
    });

    it('Should must click on the button to close the table and the table disappears', async () => {
        renderElement(<Statement />);

        const button = screen.getByText(/Voltar/i);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
    
        await waitFor(() => expect(mockedNavigator).toHaveBeenCalledWith('/'));  
    });

});