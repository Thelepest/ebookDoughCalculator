import React from 'react';
import './SourdoughSliderPage.css';
import bottomline from '../../../assets/separatore.jpg'

const SliderPage = ({ title, text, pageNumber }) => {

    return (
        <div className="slider-page">

            <h3 className="slider-page-title">{title}</h3>

            <p className="slider-page-text">{text}</p>

            {bottomline && (
                <img
                    src={bottomline}
                    alt="Bottom"
                    className="slider-page-bottom-image"
                />
            )}

            {pageNumber && (
                <div className="slider-page-number">{pageNumber}</div>
            )}
        </div>
    );
};

export default SliderPage;
