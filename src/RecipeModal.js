import React from 'react';
import './Modal.css';
import surfmath from './surfmath.jpg';
import bilancia from './bilancia.jpg';
import translations from "./translations";


function RecipeModal({ isOpen, onClose, recipe, lang }) {
    if (!isOpen) return null;
    const isHighFlourContent = recipe.flour > 9999;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {!isHighFlourContent ? (
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="align">
                        <button className="modal-close" onClick={onClose}>X</button>
                        <h2>{translations[lang].recipeDetails}</h2>
                    </div>
                    <p>
                        <span>{translations[lang].rec}</span> {translations[lang].products[recipe.product]}<br />
                        <span>{translations[lang].pieces}</span> {recipe.quantity}<br />
                        <span>{translations[lang].flour}</span> {recipe.flour} gr<br />
                        <span>{translations[lang].wat}</span> {recipe.water} gr<br />
                        <span>{translations[lang].salt}</span> {recipe.salt} gr<br />
                        <span>{translations[lang].sourdough}</span> {recipe.levain} gr<br />
                        {recipe.product === 'Focaccia' && (
                            <>
                                <span>{translations[lang].oil}</span> {recipe.oil} {recipe.oil === 1 ? translations[lang].oil1 :
                                (recipe.oil < 5 ? translations[lang].oil2 : translations[lang].oil3)}<br />
                            </>
                        )}
                    </p>
                    <img className="modal-image" src={surfmath} alt="Surfmath" />
                </div>
            ) : (
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close-fat" onClick={onClose}>X</button>
                    <h2>{translations[lang].fatBoy}</h2>
                    <span className="span-fat">
                        {translations[lang].fatBoy1}<br/>{recipe.product},<br/>
                        {translations[lang].fatBoy2}<br/>{translations[lang].fatBoy3}<br/>{translations[lang].fatBoy4}</span>
                    <img className="modal-image-fat" src={bilancia} alt="Surfmath" />
                </div>
            )};
        </div>
    );
}

export default RecipeModal;
