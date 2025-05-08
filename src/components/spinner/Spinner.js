// Spinner.js
import React from 'react';
import './Spinner.css';
import pizzaImg from './../../assets/Pizza_NOBG.png';

const Spinner = () => {
    return (
        <div className="spinner-overlay">
            <div className="spinner">
                <img src={pizzaImg} alt="Loading" />
            </div>
        </div>
    );
};

export default Spinner;
