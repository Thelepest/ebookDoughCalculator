import React, { useState } from 'react';
import './Modal.css';
import surfmath from '../../assets/surfmath.jpg';
import bilancia from '../../assets/bilancia.jpg';
import translations from "../../utils/translations";
import ContactModal from "../contact-modal/ContactModal";
import { FaWindowClose } from "react-icons/fa";


function RecipeModal({ isOpen, onClose, recipe, lang }) {
    const [contactModalOpen, setContactModalOpen] = useState(false);
    
    if (!isOpen) return null;
    const isHighFlourContent = recipe.flour > 9999;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                {!isHighFlourContent ? (
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{translations[lang].recipeDetails}</h2>
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

                        <div className="modal-buttons-group">
                            <button className="modal-button modal-close-btn" onClick={onClose}>
                                <FaWindowClose style={{ marginRight: "8px" }} />
                                {translations[lang].close}
                            </button>
                            <button className="modal-button modal-teach-btn" onClick={() => setContactModalOpen(true)}>
                                {translations[lang].teachMe}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{translations[lang].fatBoy}</h2>
                        <span className="span-fat">
                            {translations[lang].fatBoy1}<br/>{recipe.product},<br/>
                            {translations[lang].fatBoy2}<br/>{translations[lang].fatBoy3}<br/>{translations[lang].fatBoy4}</span>
                        <img className="modal-image-fat" src={bilancia} alt="Surfmath" />

                        <div className="modal-buttons-group fatboy">
                            <button className="modal-button modal-close-btn" onClick={onClose}>
                                <FaWindowClose style={{ marginRight: "8px" }} />
                                {translations[lang].close}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ContactModal 
                isOpen={contactModalOpen} 
                onClose={() => setContactModalOpen(false)} 
                message={translations[lang].contactMessageRecipe + translations[lang].products[recipe.product]}
                lang={lang}
            />
        </>
    );
}

export default RecipeModal;
