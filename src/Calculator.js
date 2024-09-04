import React, { useState } from 'react';
import './Calculator.css';
import RecipeModal from './RecipeModal';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Spinner from "./Spinner";

function Calculator() {
    const [form, setForm] = useState({
        shape: '',
        length: '',
        depth: '',
        diameter: '',
        product: '',
        quantity: '',
        season: '',
        hydration: 80,
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
                F = M * 1.5 * 1.04;
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
        <div className="container">
            <div className="form-img">
                <img src={`${process.env.PUBLIC_URL}/pic1.jpg`} alt="MichalBakteria" />
            </div>

            <div className="form-content">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        calculateRecipe();
                    }}
                >
                    {/* Form fields as before */}
                    <div className="input-group position-relative">
                        <label htmlFor="product">Co pieczesz dzisiaj?</label>
                        <select
                            id="product"
                            value={form.product}
                            onChange={handleProductChange}
                            required
                        >
                            <option value="" disabled>
                                Wybierz
                            </option>
                            <option value="focaccia">Focaccia</option>
                            <option value="pizza">Pizza</option>
                            <option value="chleb">Chleb</option>
                        </select>
                    </div>

                    {form.product === 'chleb' && (
                        <div className="input-group position-relative">
                            <label htmlFor="breadWeight">Waga chleba (g):</label>
                            <input
                                type="number"
                                id="breadWeight"
                                value={form.breadWeight}
                                onChange={(e) => setForm({ ...form, breadWeight: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    {(form.product === 'pizza' || form.product === 'focaccia') && (
                        <div className="input-group position-relative">
                            <label htmlFor="shape">Kształt blachy do pieczenia :</label>
                            {form.product !== 'pizza' && (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={renderTooltip(
                                        form.product === 'focaccia'
                                            ? 'Wybierz blachę o wysokości co najmniej 5 cm!'
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
                                <option value="" disabled>
                                    Wybierz
                                </option>
                                <option value="rectangular">Prostokątny</option>
                                <option value="circular">Okrągły</option>
                            </select>
                        </div>
                    )}

                    {form.shape === 'rectangular' && form.product !== 'chleb' && (
                        <>
                            <div className="input-group position-relative">
                                <label htmlFor="length">Długość (cm):</label>
                                <input
                                    type="number"
                                    id="length"
                                    value={form.length}
                                    onChange={(e) => setForm({ ...form, length: e.target.value })}
                                />
                                <label htmlFor="depth"> Szerokość (cm):</label>
                                <input
                                    type="number"
                                    id="depth"
                                    value={form.depth}
                                    onChange={(e) => setForm({ ...form, depth: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {form.shape === 'circular' && form.product !== 'chleb' && (
                        <div className="input-group position-relative">
                            <label htmlFor="diameter">Średnica (cm):</label>
                            <input
                                type="number"
                                id="diameter"
                                value={form.diameter}
                                onChange={(e) => setForm({ ...form, diameter: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="input-group position-relative">
                        <label htmlFor="quantity">Ile sztuk?</label>
                        <input
                            type="number"
                            id="quantity"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group position-relative">
                        <label htmlFor="season">Pora roku:</label>
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip('W ciepłe pory roku zużyjesz mniej zakwasu niż w zimne.')}
                        >
                            <span className="question-mark">?</span>
                        </OverlayTrigger>
                        <select
                            id="season"
                            value={form.season}
                            onChange={(e) => setForm({ ...form, season: e.target.value })}
                            required
                        >
                            <option value="" disabled>
                                Wybierz
                            </option>
                            <option value="summer">Wiosna-Lato</option>
                            <option value="winter">Jesień-Zima</option>
                        </select>
                    </div>

                    <div className="input-group position-relative">
                        <label htmlFor="hydration">Hydratacja (%):</label>
                        <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip('Jeśli nie masz dużego doświadczenia, zalecam pozostawienie' +
                                ' domyślnego.')}
                        >
                            <span className="question-mark">?</span>
                        </OverlayTrigger>
                        <select
                            id="hydration"
                            value={form.hydration}
                            onChange={(e) => setForm({ ...form, hydration: parseInt(e.target.value, 10) })}
                        >
                            <option value="70">70</option>
                            <option value="75">75</option>
                            <option value="80">80</option>
                            <option value="85">85</option>
                            <option value="90">90</option>
                        </select>
                    </div>

                    <div className="button-group">
                        <button type="submit" disabled={!isFormValid()}>
                            Oblicz
                        </button>
                        <button type="button" onClick={resetForm} className="reset-btn">
                            Reset
                        </button>
                    </div>
                </form>

                {isLoading && <Spinner />}

                <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipe={recipe} />
            </div>
        </div>
    );
}

export default Calculator;
