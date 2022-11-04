import { useEffect, useState } from 'react';
import './App.css';

import { createStore } from './create-store';

type State = { first: string; last?: string };

const { Provider, useStore } = createStore<State>({ first: 'John', last: 'Wick' });

const TextInput = ({ value }: { value: 'first' | 'last' }) => {
    const [fieldVal, setState] = useStore((state) => state[value]);
    return (
        <div className='container field'>
            {value}:{' '}
            <input value={fieldVal} onChange={(e) => setState((state) => ({ ...state, [value]: e.target.value }))} />
        </div>
    );
};

const Display = ({ value }: { value: 'first' | 'last' }) => {
    const [data] = useStore((state) => state[value]);
    return (
        <div className='container value'>
            {value}: {data}
        </div>
    );
};

const FormContainer = () => {
    return (
        <div className='container'>
            <h5>FormContainer</h5>
            <TextInput value='first' />
            <TextInput value='last' />
        </div>
    );
};

const DisplayContainer = () => {
    return (
        <div className='container'>
            <h5>DisplayContainer</h5>
            <Display value='first' />
            <Display value='last' />
        </div>
    );
};

const ContentContainer = () => {
    return (
        <div className='content-container container'>
            <h5>ContentContainer</h5>
            <FormContainer />
        </div>
    );
};

const Sidebar = () => {
    return (
        <div className='sidebar container'>
            <h5>Sidebar</h5>
            <DisplayContainer />
        </div>
    );
};

export default function App() {
    return (
        <Provider initialState={{ first: 'Dave' }}>
            <div className='wrapper container'>
                <h5>App</h5>
                <div className='app-container'>
                    <ContentContainer />
                    <Sidebar />
                </div>
            </div>
        </Provider>
    );
}
