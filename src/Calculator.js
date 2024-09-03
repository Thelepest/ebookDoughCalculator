import React, { useState } from 'react';
import './Calculator.css';
import RecipeModal from './RecipeModal';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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

    const isFormValid = () => {
        const { shape, product, quantity, season } = form;
        if (!shape || !product || quantity <= 0 || !season) return false;
        if (shape === 'rectangular' && (form.length <= 0 || form.depth <= 0)) return false;
        return !(shape === 'circular' && form.diameter <= 0);
    };

    const calculateRecipe = () => {
        const { shape, length, depth, diameter, product, quantity, season, hydration } = form;
        const numProducts = quantity;
        const hydratation = hydration / 100;
        const isSummer = season === 'summer';

        let M = 0;
        if (shape === 'circular') {
            M = Math.PI * Math.pow(diameter / 2, 2);
        } else if (shape === 'rectangular') {
            M = length * depth;
        }

        let F = 0;
        if (product === 'focaccia') {
            F = M * 1.5;
        } else if (product === 'pizza') {
            F = M * 0.6;
        }

        const flour = numProducts * (1 / (1 + hydratation + 0.02 + (isSummer ? 0.1 : 0.2)));
        const water = hydratation * flour;
        const salt = 0.02 * flour;
        const levain = (isSummer ? 0.1 : 0.2) * flour;

        setRecipe({
            product: product.charAt(0).toUpperCase() + product.slice(1),
            quantity: numProducts,
            flour: Math.ceil(flour * F),
            water: Math.ceil(water * F),
            salt: Math.ceil(salt * F),
            levain: Math.ceil(levain * F),
        });
        setIsModalOpen(true);
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
            <h2>Obliczenie ilości ciasta</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    calculateRecipe();
                }}
            >
                <div className="input-group position-relative">
                    <label htmlFor="shape">Kształt blachy do pieczenia :</label>
                    <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip('Wybierz blachę o wysokości co najmniej 5 cm!')}
                    >
                        <span className="question-mark">?</span>
                    </OverlayTrigger>
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

                {form.shape === 'rectangular' && (
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

                {form.shape === 'circular' && (
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
                    <label htmlFor="product">Co pieczesz dzisiaj?</label>
                    <select
                        id="product"
                        value={form.product}
                        onChange={(e) => setForm({ ...form, product: e.target.value })}
                        required
                    >
                        <option value="" disabled>
                            Wybierz
                        </option>
                        <option value="focaccia">Focaccia</option>
                        <option value="pizza">Pizza</option>
                    </select>
                </div>

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

            <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipe={recipe} />
        </div>
    );
}

export default Calculator;
