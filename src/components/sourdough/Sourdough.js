import React, {useState} from 'react';
import './Sourdough.css';
import '../../App.css';
import translations from "../../utils/translations";
import sour0 from '../../assets/sourdoughslider_0.jpg'
import sour1 from '../../assets/sourdoughslider_1.jpg'
import sour2 from '../../assets/sourdoughslider_2.jpg'
import sour3 from '../../assets/sourdoughslider_3.jpg'
import sour4 from '../../assets/sourdoughslider_4.jpg'
import { useNavigate } from 'react-router-dom';
import {FaWindowClose} from "react-icons/fa";
import Slider from "../slider/Slider";
import SliderPage from "../slider/slider-page/SourdoughSliderPage";
import bottomline from "../../assets/separatore.jpg";


function Sourdough({ lang }) {

    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);

    const getHeaderImage = () => {
        if (activeSlide <= 2) return sour0;
        if (activeSlide <= 5) return sour1;
        if (activeSlide <= 8) return sour2;
        if (activeSlide <= 10) return sour3;
        return sour4;
    };
    const getHeaderTitle = () => {
        if (activeSlide <= 2) return translations[lang].sourSlideTitles["zero"];
        if (activeSlide <= 5) return translations[lang].sourSlideTitles["one"];
        if (activeSlide <= 8) return translations[lang].sourSlideTitles["two"];
        if (activeSlide <= 10) return translations[lang].sourSlideTitles["three"];
        return translations[lang].sourSlideTitles["four"];
    };

    return (
        <div className="page-container">
            <h2 className="section-title">{translations[lang].sectionTitles?.sourdough || translations[lang].createSourdough}</h2>
            <div className="head-img-sourdough">
                <img src={getHeaderImage()} alt="Header Slide" />
            </div>
            <div>
                <h3 className="slider-page-title">{getHeaderTitle()}</h3>
            </div>
            <div className="content">
                <Slider onSlideChange={setActiveSlide}>
                    <SliderPage
                        text={translations[lang].sourdough01}
                        pageNumber="1"
                    /><SliderPage
                        text={translations[lang].sourdough02}
                        pageNumber="2"
                    /><SliderPage
                        text={translations[lang].sourdough03}
                        pageNumber="3"
                    />
                    <SliderPage
                        text={translations[lang].sourdough11}
                        pageNumber="4"
                    /><SliderPage
                        text={translations[lang].sourdough12}
                        pageNumber="5"
                    /><SliderPage
                        text={translations[lang].sourdough13}
                        pageNumber="6"
                    />
                    <SliderPage
                        text={translations[lang].sourdough21}
                        pageNumber="7"
                    /><SliderPage
                        text={translations[lang].sourdough22}
                        pageNumber="8"
                    /><SliderPage
                        text={translations[lang].sourdough23}
                        pageNumber="9"
                    />
                    <SliderPage
                        text={translations[lang].sourdough31}
                        pageNumber="10"
                    /><SliderPage
                        text={translations[lang].sourdough32}
                        pageNumber="11"
                    />
                    <SliderPage
                        text={translations[lang].sourdough41}
                        pageNumber="12"
                    /><SliderPage
                        text={translations[lang].sourdough42}
                        pageNumber="13"
                    />
                </Slider>

                {bottomline && (
                    <div className="align-content-center">
                        <img
                            src={bottomline}
                            alt="Bottom"
                            className="slider-page-bottom-image"
                        />
                    </div>
                )}
                {activeSlide+1 && (
                    <div className="slider-page-number">{activeSlide+1}</div>
                )}

                <div className="button-group centered-buttons">
                    <button type="button" onClick={() => navigate('/')} className="home-btn pages-button">
                        <FaWindowClose style={{ marginRight: '8px',verticalAlign: 'middle' }} />
                        {translations[lang].goBack}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sourdough;
