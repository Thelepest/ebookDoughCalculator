import React from 'react';
import './SourdoughSliderPage.css';
import bottomline from '../../../assets/separatore.jpg'

const SliderPage = ({ imageSrc, title, text, pageNumber }) => {
    return (
        <div className="slider-page">
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={title}
                    className="slider-page-top-image"
                />
            )}

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
