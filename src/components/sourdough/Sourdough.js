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

    return (
        <div className="page-container">
            <div className="head-img-sourdough">
                <img src={getHeaderImage()} alt="Header Slide" />
            </div>
            <div className="content">
                <Slider onSlideChange={setActiveSlide}>
                    <SliderPage
                        title={translations[lang].sourSlideTitles["zero"]}
                        text={translations[lang].sourdough01}
                        pageNumber="1"
                    /><SliderPage
                        title={translations[lang].sourSlideTitles["zero"]}
                        text={translations[lang].sourdough02}
                        pageNumber="2"
                    /><SliderPage
                        title={translations[lang].sourSlideTitles["zero"]}
                        text={translations[lang].sourdough03}
                        pageNumber="3"
                    />
                    <SliderPage
                        title={translations[lang].sourSlideTitles["one"]}
                        text={translations[lang].sourdough11}
                        pageNumber="4"
                    /><SliderPage
                        title={translations[lang].sourSlideTitles["one"]}
                        text={translations[lang].sourdough12}
                        pageNumber="5"
                    /><SliderPage
                        title={translations[lang].sourSlideTitles["one"]}
                        text={translations[lang].sourdough13}
                        pageNumber="6"
                    />
                    <SliderPage
                        title={translations[lang].sourSlideTitles["two"]}
                        text={translations[lang].sourdough21}
                        pageNumber="7"
                    /><SliderPage
                        title={translations[lang].sourSlideTitles["two"]}
                        text={translations[lang].sourdough22}
                        pageNumber="8"
                    /><SliderPage
                        title={translations[lang].sourSlideTitles["two"]}
                        text={translations[lang].sourdough23}
                        pageNumber="9"
                    />
                    <SliderPage
                        title={translations[lang].sourSlideTitles["three"]}
                        text={translations[lang].sourdough31}
                        pageNumber="10"
                    /><SliderPage
                        title={translations[lang].sourSlideTitles["three"]}
                        text={translations[lang].sourdough32}
                        pageNumber="11"
                    />
                    <SliderPage
                        title={translations[lang].sourSlideTitles["four"]}
                        text={translations[lang].sourdough41}
                        pageNumber="12"
                    /><SliderPage
                        title={translations[lang].sourSlideTitles["four"]}
                        text={translations[lang].sourdough42}
                        pageNumber="13"
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
