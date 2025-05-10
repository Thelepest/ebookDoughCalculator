import React from 'react';
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


function Sourdough({ lang }) {

    const navigate = useNavigate();

    return (
        <div className="page-container">

            <div className="content">
                <Slider>
                    <SliderPage
                        imageSrc={sour0}
                        title={translations[lang].sourSlideTitles["zero"]}
                        text={translations[lang].sourdough0}
                        pageNumber="1"
                    />
                    <SliderPage
                        imageSrc={sour1}
                        title={translations[lang].sourSlideTitles["one"]}
                        text={translations[lang].sourdough1}
                        pageNumber="2"
                    />
                    <SliderPage
                        imageSrc={sour2}
                        title={translations[lang].sourSlideTitles["two"]}
                        text={translations[lang].sourdough2}
                        pageNumber="3"
                    />
                    <SliderPage
                        imageSrc={sour3}
                        title={translations[lang].sourSlideTitles["three"]}
                        text={translations[lang].sourdough3}
                        pageNumber="4"
                    />
                    <SliderPage
                        imageSrc={sour4}
                        title={translations[lang].sourSlideTitles["four"]}
                        text={translations[lang].sourdough4}
                        pageNumber="5"
                    />
                </Slider>

                <div className="button-group">
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
