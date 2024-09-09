import React from 'react';
import './Modal.css';
import surfmath from './surfmath.jpg';
import bilancia from './bilancia.jpg';


function RecipeModal({ isOpen, onClose, recipe }) {
    if (!isOpen) return null;
    const isHighFlourContent = recipe.flour > 9999;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {!isHighFlourContent ? (
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>X</button>
                    <h2>Szczegóły twojego przepisu</h2>
                    <p>
                        <span>Przepis:</span> {recipe.product}<br />
                        <span>Sztuki:</span> {recipe.quantity}<br />
                        <span>Mąka:</span> {recipe.flour} gr<br />
                        <span>Woda:</span> {recipe.water} gr<br />
                        <span>Sól:</span> {recipe.salt} gr<br />
                        <span>Zakwas:</span> {recipe.levain} gr<br />
                        {recipe.product === 'Focaccia' && (
                            <>
                                <span>Oliwa:</span> {recipe.oil} {recipe.oil === 1 ? 'łyżka' : 'łyżki'}<br />
                            </>
                        )}
                    </p>
                    <img className="modal-image" src={surfmath} alt="Surfmath" />
                </div>
            ) : (
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close-fat" onClick={onClose}>X</button>
                    <h2>Uwaga, wykryte obżartuch!</h2>
                    <span className="span-fat">
                        Rozumiem Twoją ochotę <br/>na {recipe.product},<br/>
                    specjalista dietetyk <br/>Dr. Drożdże <br/> zaraz cię przyjmie!</span>
                    <img className="modal-image-fat" src={bilancia} alt="Surfmath" />
                </div>
            )};
        </div>
    );
}

export default RecipeModal;
