import React, { useState } from 'react';
import './Calculator.css';
import '../../App.css';
import RecipeModal from '../recipe-modal/RecipeModal';
import ContactModal from '../contact-modal/ContactModal';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Spinner from "../spinner/Spinner";
import translations from "../../utils/translations";
import michelangelo from '../../assets/pic1.jpg';
import { useNavigate } from 'react-router-dom';
import {FaCalculator, FaWindowClose, FaRedo, FaQuestionCircle} from "react-icons/fa";


function Calculator({ lang }) {
    const [form, setForm] = useState({
        shape: '',
        length: '',
        depth: '',
        diameter: '',
        product: '',
        quantity: '',
        season: '',
        hydration: 70,
        breadWeight:'',
    });
    const [recipe, setRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);


    const handleProductChange = (e) => {
        const selectedProduct = e.target.value;
        setForm(prevForm => ({
            ...prevForm,
            product: selectedProduct,
            hydration: 70,
        }));
    };

    const navigate = useNavigate();

    const isFormValid = () => {
        const { shape, length, depth, diameter, product, quantity, season, breadWeight } = form;

        // Convert to numbers for validation
        const qty = Number(quantity);
        const len = Number(length);
        const dep = Number(depth);
        const diam = Number(diameter);
        const bWeight = Number(breadWeight);

        // Basic required fields
        if (!product || !season) return false;
        
        // Quantity must be a valid positive number
        if (!quantity || isNaN(qty) || qty <= 0) return false;
        
        if (product === 'chleb') {
            // For bread, breadWeight is required
            if (!breadWeight || isNaN(bWeight) || bWeight <= 0) return false;
        } else {
            // For pizza/focaccia, shape is required
            if (!shape) return false;

            if (shape === 'rectangular') {
                // For rectangular shape, both length and depth are required
                if (!length || isNaN(len) || len <= 0 || !depth || isNaN(dep) || dep <= 0) return false;
            } else if (shape === 'circular') {
                // For circular shape, diameter is required
                if (!diameter || isNaN(diam) || diam <= 0) return false;
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
            <h2 className="section-title">{translations[lang].sectionTitles?.calculator || translations[lang].calculatorButton}</h2>
            <div className="head-img-calculator smaller">
                <img src={michelangelo} alt="MichalBakteria" />
            </div>

            <div className="content">
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
                            <label htmlFor="shape" className="label-with-icon">
                                {translations[lang].tray}
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
                            </label>
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
                        <label htmlFor="season" className="label-with-icon">
                            {translations[lang].period}
                            <OverlayTrigger
                                placement="top"
                                overlay={renderTooltip(translations[lang].periodSuggest)}
                            >
                                <span className="question-mark">?</span>
                            </OverlayTrigger>
                        </label>
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
                        <label htmlFor="hydration" className="label-with-icon">
                            {translations[lang].water}
                            <OverlayTrigger
                                placement="top"
                                overlay={renderTooltip(translations[lang].waterSuggest)}
                            >
                                <span className="question-mark">?</span>
                            </OverlayTrigger>
                        </label>
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
                        <button type="submit" disabled={!isFormValid()} className="pages-button calculate-btn">
                            <FaCalculator style={{ marginRight: '5px',verticalAlign: 'middle' }} />
                            {translations[lang].calculate}
                        </button>
                        <button type="button" onClick={resetForm} className="reset-btn pages-button">
                            <FaRedo style={{ marginRight: '5px',verticalAlign: 'middle' }} />
                            {translations[lang].reset}
                        </button>
                        <button type="button" onClick={() => setContactModalOpen(true)} className="help-btn pages-button">
                            <FaQuestionCircle style={{ marginRight: '5px',verticalAlign: 'middle' }} />
                            {translations[lang].help}
                        </button>
                        <button type="button" onClick={() => navigate('/')} className="home-btn pages-button">
                            <FaWindowClose style={{ marginRight: '8px',verticalAlign: 'middle' }} />
                            {translations[lang].goBack}
                        </button>
                    </div>
                </form>

                {isLoading && <Spinner />}

                <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipe={recipe} lang={lang}/>
                <ContactModal
                    isOpen={contactModalOpen}
                    onClose={() => setContactModalOpen(false)}
                    message={translations[lang].contactMessageCalculator}
                    lang={lang}
                />
            </div>
        </div>
    );
}

export default Calculator;
