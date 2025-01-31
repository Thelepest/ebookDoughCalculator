import React, { useState } from 'react';
import './Calculator.css';
import RecipeModal from './RecipeModal';
import Spinner from "./Spinner";
import translations from "./translations";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

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
        breadWeight: ''
    });

    const [recipe, setRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(0); // Controlla il passo del carosello

    const steps = [
        { name: "product", label: translations[lang].productLabel },
        { name: "breadWeight", label: translations[lang].breadWeight, condition: form.product === 'chleb' },
        { name: "shape", label: translations[lang].tray, condition: form.product !== 'chleb' },
        { name: "length", label: translations[lang].length, condition: form.shape === 'rectangular' },
        { name: "depth", label: translations[lang].width, condition: form.shape === 'rectangular' },
        { name: "diameter", label: translations[lang].diameter, condition: form.shape === 'circular' },
        { name: "quantity", label: translations[lang].pcs },
        { name: "season", label: translations[lang].period },
        { name: "hydration", label: translations[lang].water },
    ].filter(step => step.condition !== false); // Rimuove i passi non necessari

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const isFormValid = () => {
        return form.product && form.quantity > 0 && form.season;
    };

    const handleReset = () => {
        setForm({
            shape: '',
            length: '',
            depth: '',
            diameter: '',
            product: '',
            quantity: '',
            season: '',
            hydration: 80,
            breadWeight: ''
        });
        setRecipe(null);
        setStep(0);
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

            let F = product === 'focaccia' ? M * 2 * 1.04
                : product === 'pizza' ? M * 0.6 * 1.04
                    : breadWeight * 1.04;

            const flour = numProducts * (1 / (1 + hydratation + 0.02 + (isSummer ? 0.1 : 0.2)));
            const water = hydratation * flour;
            const salt = 0.02 * flour;
            const levain = (isSummer ? 0.1 : 0.2) * flour;
            const oil = flour * F <= 100 ? 1 : Math.ceil(flour * F / 100);

            setRecipe({
                product: product.charAt(0).toUpperCase() + product.slice(1),
                quantity: numProducts,
                flour: Math.ceil(flour * F),
                water: Math.ceil(water * F),
                salt: Math.ceil(salt * F),
                levain: Math.ceil(levain * F),
                oil: oil
            });

            setIsModalOpen(true);
            setIsLoading(false);
        }, 2000);
    };

    const renderTooltip = (item) => {
        if (item === "hydration") {
            return <Tooltip id="tooltip">{translations[lang].waterSuggest}</Tooltip>;
        } else if (item === "season") {
            return <Tooltip id="tooltip">{translations[lang].periodSuggest}</Tooltip>;
        } else if (item === "shape") {
            return <Tooltip id="tooltip">{translations[lang].tray5cm}</Tooltip>;
        }
        return <Tooltip id="tooltip">""</Tooltip>;
    };

    const getPlaceholder = (item) => {
        switch(item.name) {
            case "breadWeight":
                return translations[lang].breadWeightPlaceholder;
            case "quantity":
                return translations[lang].quantityPlaceholder;
            case "length":
                return translations[lang].lengthPlaceholder;
            case "depth":
                return translations[lang].lengthPlaceholder;
            default:
                return "";
        }
    };

    return (
        <div className="container">
            <div className="form-img">
                <img src={`${process.env.PUBLIC_URL}/pic1.jpg`} alt="MichalBakteria" />
            </div>

            <div className="form-content">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="carousel-container">
                        {steps.map((item, index) => (
                            <div key={item.name} className={`carousel-slide ${index === step ? 'active' : ''}`}>
                                <label htmlFor={item.name}>{item.label}</label>
                                {item.name === "hydration" || item.name === "season" || item.name === "product" || item.name === "shape" ? (
                                    <div className="input-group">
                                    <select
                                        id={item.name}
                                        name={item.name}
                                        value={form[item.name]}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>{translations[lang].chooseOption}</option>
                                        {item.name === "product" && (
                                            <>
                                                <option value="focaccia">{translations[lang].focaccia}</option>
                                                <option value="pizza">{translations[lang].pizza}</option>
                                                <option value="chleb">{translations[lang].bread}</option>
                                            </>
                                        )}
                                        {item.name === "shape" && (
                                            <>
                                                <option value="rectangular">{translations[lang].squareShape}</option>
                                                <option value="circular">{translations[lang].roundShape}</option>
                                            </>
                                        )}
                                        {item.name === "season" && (
                                            <>
                                                <option value="summer">{translations[lang].summer}</option>
                                                <option value="winter">{translations[lang].winter}</option>
                                            </>
                                        )}
                                        {item.name === "hydration" && [70, 75, 80, 85, 90].map(value => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </select>
                                    {(item.name === "hydration" || item.name === "season" || item.name === "shape") && (
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={renderTooltip(item.name)}
                                        >
                                            <span className="question-mark">?</span>
                                        </OverlayTrigger>
                                    )}
                                    </div>
                                ) : (
                                    <input
                                        type="number"
                                        id={item.name}
                                        name={item.name}
                                        value={form[item.name]}
                                        onChange={handleChange}
                                        placeholder={getPlaceholder(item)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="button-group">
                        {step > 0 && <button type="button" onClick={prevStep}>{translations[lang].goBack}</button>}
                        {step < steps.length - 1 ? (
                            <button type="button" onClick={nextStep}>{translations[lang].goNext}</button>
                        ) : (
                            <>
                                <button type="submit" onClick={calculateRecipe} disabled={!isFormValid()}>
                                    {translations[lang].calculate}
                                </button>
                                <button type="button" onClick={handleReset} className="reset-btn">
                                    {translations[lang].reset}
                                </button>
                            </>
                        )}
                    </div>
                </form>
                {isLoading && <Spinner />}
                <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipe={recipe} lang={lang} />
            </div>
        </div>
    );
}

export default Calculator;
