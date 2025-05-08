import React, {useState} from 'react';
import './Sourdough.css';
import '../../App.css';
import RecipeModal from '../recipe-modal/RecipeModal';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Spinner from "../spinner/Spinner";
import translations from "../../utils/translations";
import michelangelo from '../../assets/pic1.jpg';
import { useNavigate } from 'react-router-dom';
import {FaWindowClose} from "react-icons/fa";
import Slider from "../slider/Slider";


function Sourdough({ lang }) {

    const navigate = useNavigate();

    return (
        <div className="page-container">
            <div className="head-img">
                <img src={michelangelo} alt="MichalBakteria" />
            </div>

            <div className="content">
                <Slider>
                    <div><h3>Ciao pagina 1</h3></div>
                    <div><h3>Ciao pagina 2</h3></div>
                    <div><h3>Ciao pagina 3</h3></div>
                    <div><h3>Ciao pagina 4</h3></div>
                </Slider>
                <div className="button-group">
                    <button type="button" onClick={() => navigate('/')} className="home-btn">
                        <FaWindowClose style={{ marginRight: '8px',verticalAlign: 'middle' }} />
                        {translations[lang].goBack}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sourdough;
