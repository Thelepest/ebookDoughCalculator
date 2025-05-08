import React, { useState } from 'react';
import './Calculator.css';
import '../../App.css';
import RecipeModal from '../recipe-modal/RecipeModal';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Spinner from "../spinner/Spinner";
import translations from "../../utils/translations";
import michelangelo from '../../assets/pic1.jpg';
import { useNavigate } from 'react-router-dom';
import {FaCalculator, FaWindowClose, FaRedo} from "react-icons/fa";


function Calculator({ lang }) {
    const [form, setForm] = useState({
        shape: '',
        length: '',
        depth: '',
        diameter: '',
        product: '',
        quantity: '',
        season: '',
        hydration: 80,
        breadWeight:'',
    });
    const [recipe, setRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleProductChange = (e) => {
        const selectedProduct = e.target.value;
        setForm(prevForm => ({
            ...prevForm,
            product: selectedProduct,
            hydration: selectedProduct === 'chleb' ? 70 : 80,
        }));
    };

    const navigate = useNavigate();

    const isFormValid = () => {
        const { shape, length, depth, diameter, product, quantity, season, breadWeight } = form;

        if (!product || quantity <= 0 || !season) return false;
        if (product === 'chleb') {
            if (breadWeight <= 0 || isNaN(breadWeight)) return false;
        } else {
            if (!shape) return false;

            if (shape === 'rectangular') {
                if (length <= 0 || isNaN(length) || depth <= 0 || isNaN(depth)) return false;
            } else if (shape === 'circular') {
                if (diameter <= 0 || isNaN(diameter)) return false;
            }
        }

        return true;
    };



    const calculateRecipe = () => {
        setIsLoading(true);
        setTimeout(() => {
            const { shape, length, depth, diameter, product, quantity, season, hydration, breadWeight } = form;
            const numProducts = quantity;
            const hydratation = hydration / 100;
            const isSummer = season === 'summer';

            let M = 0;
            if (shape === 'circular') {
                M = Math.PI * Math.pow(diameter / 2, 2);
            } else if (shape === 'rectangular') {
                M = length * depth;
            }

            // After baking, the bread loses around 9% of its water content. In proportion, around 4% more dough is
            // needed to obtain the wanted quantity.
            let F = 0;
            if (product === 'focaccia') {
                F = M * 2 * 1.04;
            } else if (product === 'pizza') {
                F = M * 0.6 * 1.04;
            } else if (product === 'chleb') {
                F = breadWeight * 1.04;
            }

            const flour = numProducts * (1 / (1 + hydratation + 0.02 + (isSummer ? 0.1 : 0.2)));
            const water = hydratation * flour;
            const salt = 0.02 * flour;
            const levain = (isSummer ? 0.1 : 0.2) * flour;
            const oil = flour*F <= 100 ? 1 : Math.ceil(flour*F/100);

            setRecipe({
                product: product.charAt(0).toUpperCase() + product.slice(1),
                quantity: numProducts,
                flour: Math.ceil(flour * F),
                water: Math.ceil(water * F),
                salt: Math.ceil(salt * F),
                levain: Math.ceil(levain * F),
                oil:oil
            });
            setIsModalOpen(true);
            setIsLoading(false);
        }, 2000);
    };

    const isValidNumberString = (str) => {
        return !/[eE\-.]/.test(str);
    };

    const blockInvalidNumberKeys = (e) => {
        if (["e", "E", "-", "."].includes(e.key)) {
            e.preventDefault();
        }
    };

    const resetForm = () => {
        setForm({
            shape: '',
            length: '',
            depth: '',
            diameter: '',
            product: '',
            quantity: '',
            season: '',
            hydration: 80,
        });
        setRecipe(null);
        setIsModalOpen(false);
    };

    const renderTooltip = (message) => (
        <Tooltip id="tooltip" className="custom-tooltip">
            {message}
        </Tooltip>
    );

    return (
        <div className="page-container">
            <div className="form-img">
                <img src={michelangelo} alt="MichalBakteria" />
            </div>

            <div className="form-content">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        calculateRecipe();
                    }}
                >
                    {/* Form fields */}
                    <div className="input-group">
                        <label htmlFor="product">{translations[lang].productLabel}</label>
                        <select
                            id="product"
                            value={form.product}
                            onChange={handleProductChange}
                            required
                        >
                            <option value="" disabled>{translations[lang].chooseOption}</option>
                            <option value="focaccia">{translations[lang].focaccia}</option>
                            <option value="pizza">{translations[lang].pizza}</option>
                            <option value="chleb">{translations[lang].bread}</option>
                        </select>
                    </div>

                    {form.product === 'chleb' && (
                        <div className="input-group">
                            <label htmlFor="breadWeight">{translations[lang].breadWeight}</label>
                            <input
                                type="number"
                                id="breadWeight"
                                min="1"
                                value={form.breadWeight}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(parseInt(value)) && isValidNumberString(value)) {
                                        setForm({ ...form, breadWeight: value });
                                    }
                                }}
                                onKeyDown={blockInvalidNumberKeys}
                                required
                            />
                        </div>
                    )}

                    {(form.product === 'pizza' || form.product === 'focaccia') && (
                        <div className="input-group">
                            <label htmlFor="shape">{translations[lang].tray}</label>
                            {form.product !== 'pizza' && (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={renderTooltip(
                                        form.product === 'focaccia'
                                            ? translations[lang].tray5cm
                                            : ''
                                    )}
                                >
                                    <span className="question-mark">?</span>
                                </OverlayTrigger>
                            )}
                            <select
                                id="shape"
                                value={form.shape}
                                onChange={(e) => setForm({ ...form, shape: e.target.value })}
                                required
                            >
                                <option value="" disabled>{translations[lang].chooseOption}</option>
                                <option value="rectangular">{translations[lang].squareShape}</option>
                                <option value="circular">{translations[lang].roundShape}</option>
                            </select>
                        </div>
                    )}

                    {form.shape === 'rectangular' && form.product !== 'chleb' && (
                        <div className="input-group">
                            <label htmlFor="length">{translations[lang].length}</label>
                            <input
                                type="number"
                                id="length"
                                min="1"
                                value={form.length}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(parseInt(value)) && isValidNumberString(value)) {
                                        setForm({ ...form, length: value });
                                    }
                                }}
                                onKeyDown={blockInvalidNumberKeys}
                            />
                            <label htmlFor="depth">{translations[lang].width}</label>
                            <input
                                type="number"
                                min="1"
                                id="depth"
                                value={form.depth}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(parseInt(value)) && isValidNumberString(value)) {
                                        setForm({ ...form, depth: value });
                                    }
                                }}
                                onKeyDown={blockInvalidNumberKeys}
                            />
                        </div>
                    )}

                    {form.shape === 'circular' && form.product !== 'chleb' && (
                        <div className="input-group">
                            <label htmlFor="diameter">{translations[lang].diameter}</label>
                            <input
                                type="number"
                                min="1"
                                id="diameter"
                                value={form.diameter}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (!isNaN(parseInt(value)) && isValidNumberString(value)) {
                                        setForm({ ...form, diameter: value });
                                    }
                                }}
                                onKeyDown={blockInvalidNumberKeys}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="quantity">{translations[lang].pcs}</label>
                        <input
                            type="number"
                            id="quantity"
                            value={form.quantity}
                            min="1"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (!isNaN(parseInt(value)) && isValidNumberString(value)) {
                                    setForm({ ...form, quantity: value });
                                }
                            }}
                            onKeyDown={blockInvalidNumberKeys}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="season">{translations[lang].period}</label>
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip(translations[lang].periodSuggest)}
                        >
                            <span className="question-mark">?</span>
                        </OverlayTrigger>
                        <select
                            id="season"
                            value={form.season}
                            onChange={(e) => setForm({ ...form, season: e.target.value })}
                            required
                        >
                            <option value="" disabled>{translations[lang].chooseOption}</option>
                            <option value="summer">{translations[lang].summer}</option>
                            <option value="winter">{translations[lang].winter}</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="hydration">{translations[lang].water}</label>
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip(translations[lang].waterSuggest)}
                        >
                            <span className="question-mark">?</span>
                        </OverlayTrigger>
                        <select
                            id="hydration"
                            value={form.hydration}
                            onChange={(e) => setForm({ ...form, hydration: parseInt(e.target.value, 10) })}
                        >
                            <option value="60">60</option>
                            <option value="65">65</option>
                            <option value="70">70</option>
                            <option value="75">75</option>
                            <option value="80">80</option>
                            <option value="85">85</option>
                            <option value="90">90</option>
                        </select>
                    </div>

                    <div className="button-group">
                        <button type="button" disabled={!isFormValid()}>
                            <FaCalculator style={{ marginRight: '5px',verticalAlign: 'middle' }} />
                            {translations[lang].calculate}
                        </button>
                        <button type="button" onClick={resetForm} className="reset-btn">
                            <FaRedo style={{ marginRight: '5px',verticalAlign: 'middle' }} />
                            {translations[lang].reset}
                        </button>
                        <button type="button" onClick={() => navigate('/')} className="home-btn">
                            <FaWindowClose style={{ marginRight: '8px',verticalAlign: 'middle' }} />
                            {translations[lang].goBack}
                        </button>
                    </div>
                </form>

                {isLoading && <Spinner />}

                <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipe={recipe} lang={lang}/>
            </div>
        </div>
    );
}

export default Calculator;
