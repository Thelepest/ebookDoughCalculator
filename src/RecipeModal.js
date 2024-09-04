import React from 'react';
import './Modal.css'; // Import CSS for modal

function RecipeModal({ isOpen, onClose, recipe }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
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
            </div>
        </div>
    );
}

export default RecipeModal;
