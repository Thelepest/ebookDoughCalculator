import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipesPage.css';
import '../../App.css';
import translations from '../../utils/translations';
import { FaWindowClose, FaChevronDown, FaChevronUp, FaLock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import PremiumModal from '../premium/PremiumModal';
import allproducts from '../../assets/allproducts.jpg';
import pic1 from '../../assets/pic1.jpg';

const RecipesPage = ({ lang }) => {
    const navigate = useNavigate();
    const { subscriptionTier } = useAuth();
    const [openAccordions, setOpenAccordions] = useState({});
    const [premiumModalOpen, setPremiumModalOpen] = useState(false);

    const recipes = {
        easy: [
            { 
                id: 'focaccia', 
                name: translations[lang].focaccia, 
                needsCalculator: true,
                image: allproducts,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
            },
            { 
                id: 'pane', 
                name: translations[lang].bread, 
                needsCalculator: true,
                image: allproducts,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
            }
        ],
        medium: [
            { 
                id: 'pizza', 
                name: translations[lang].pizza, 
                needsCalculator: true,
                image: allproducts,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
            },
            { 
                id: 'buns', 
                name: translations[lang].buns || 'Buns', 
                needsCalculator: false,
                image: pic1,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
            },
            { 
                id: 'pan-brioche', 
                name: translations[lang].panBrioche || 'Pan Brioche', 
                needsCalculator: false,
                image: pic1,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
            }
        ],
        hard: [
            { 
                id: 'panettone-milanese', 
                name: translations[lang].panettoneMilanese || 'Panettone stile "milanese"', 
                needsCalculator: false,
                image: pic1,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
            },
            { 
                id: 'pane-burro', 
                name: translations[lang].paneBurro || 'Pane al burro', 
                needsCalculator: false,
                image: pic1,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
            }
        ]
    };

    const toggleAccordion = (recipeId) => {
        setOpenAccordions(prev => ({
            ...prev,
            [recipeId]: !prev[recipeId]
        }));
    };

    const handleRecipeClick = (recipe, e) => {
        e.stopPropagation(); // Prevent accordion toggle
        
        // Check if recipe is premium and user is not premium
        const isPremiumRecipe = recipe.groupKey === 'hard';
        if (isPremiumRecipe && subscriptionTier === 'free') {
            setPremiumModalOpen(true);
            return;
        }

        if (recipe.needsCalculator) {
            // Navigate to calculator first, then to recipe detail
            navigate('/calculator', { state: { targetRecipe: recipe.id } });
        } else {
            // Navigate directly to recipe detail
            navigate(`/recipes/${recipe.id}`);
        }
    };

    const RecipeAccordion = ({ recipe, groupKey }) => {
        const isOpen = openAccordions[recipe.id];
        const isPremiumRecipe = groupKey === 'hard';
        const isLocked = isPremiumRecipe && subscriptionTier === 'free';

        return (
            <div className={`recipe-accordion ${isLocked ? 'recipe-accordion-locked' : ''}`}>
                <button
                    className="recipe-accordion-header"
                    onClick={() => toggleAccordion(recipe.id)}
                    aria-expanded={isOpen}
                >
                    <span className="recipe-accordion-title">
                        {recipe.name}
                        {isLocked && <FaLock className="recipe-lock-icon" />}
                    </span>
                    {isOpen ? (
                        <FaChevronUp className="recipe-accordion-icon" />
                    ) : (
                        <FaChevronDown className="recipe-accordion-icon" />
                    )}
                </button>
                {isOpen && (
                    <div className="recipe-accordion-content">
                        <div className="recipe-accordion-image-container">
                            <img src={recipe.image} alt={recipe.name} className="recipe-accordion-image" />
                            {isLocked && (
                                <div className="recipe-premium-overlay">
                                    <FaLock className="premium-overlay-icon" />
                                    <span>{translations[lang].premiumLocked || 'Premium'}</span>
                                </div>
                            )}
                        </div>
                        <p className="recipe-accordion-description">{recipe.description}</p>
                        <button
                            className="recipe-accordion-action-btn pages-button"
                            onClick={(e) => handleRecipeClick({ ...recipe, groupKey }, e)}
                        >
                            {isLocked 
                                ? (translations[lang].unlockPremium || 'Sblocca Premium')
                                : (translations[lang].goToRecipe || 'Vai alla ricetta')
                            }
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="page-container">
            <h2 className="section-title">{translations[lang].recipesTitle || 'Ricette'}</h2>
            
            <div className="recipes-list-content">
                {/* Easy Recipes */}
                <div className="recipe-group">
                    <h3 className="recipe-group-title">{translations[lang].difficultyEasy || 'Facili'}</h3>
                    <div className="recipes-list">
                        {recipes.easy.map((recipe) => (
                            <RecipeAccordion key={recipe.id} recipe={recipe} groupKey="easy" />
                        ))}
                    </div>
                </div>

                {/* Medium Recipes */}
                <div className="recipe-group">
                    <h3 className="recipe-group-title">{translations[lang].difficultyMedium || 'Medie'}</h3>
                    <div className="recipes-list">
                        {recipes.medium.map((recipe) => (
                            <RecipeAccordion key={recipe.id} recipe={recipe} groupKey="medium" />
                        ))}
                    </div>
                </div>

                {/* Hard Recipes */}
                <div className="recipe-group">
                    <h3 className="recipe-group-title">{translations[lang].difficultyHard || 'Difficili'}</h3>
                    <div className="recipes-list">
                        {recipes.hard.map((recipe) => (
                            <RecipeAccordion key={recipe.id} recipe={recipe} groupKey="hard" />
                        ))}
                    </div>
                </div>
            </div>

            <PremiumModal 
                isOpen={premiumModalOpen} 
                onClose={() => setPremiumModalOpen(false)} 
                lang={lang}
            />

            <div className="button-group centered-buttons">
                <button 
                    type="button" 
                    onClick={() => navigate('/')} 
                    className="home-btn pages-button"
                >
                    <FaWindowClose style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    {translations[lang].goBack}
                </button>
            </div>
        </div>
    );
};

export default RecipesPage;
