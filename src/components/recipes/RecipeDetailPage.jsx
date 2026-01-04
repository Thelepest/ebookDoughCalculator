import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './RecipeDetailPage.css';
import '../../App.css';
import translations from '../../utils/translations';
import { FaWindowClose } from 'react-icons/fa';
import allproducts from '../../assets/allproducts.jpg';
import pic1 from '../../assets/pic1.jpg';

const RecipeDetailPage = ({ lang }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { recipeId } = useParams();
    const [calculatedRecipe, setCalculatedRecipe] = useState(null);

    useEffect(() => {
        // Check if we have calculated recipe data from calculator
        if (location.state?.recipe) {
            setCalculatedRecipe(location.state.recipe);
        }
    }, [location.state]);

    // Recipe data
    const recipeData = {
        'focaccia': {
            name: translations[lang].focaccia,
            image: allproducts,
            defaultIngredients: [
                `${translations[lang].flour} 500 gr`,
                `${translations[lang].wat} 350 gr`,
                `${translations[lang].salt} 10 gr`,
                `${translations[lang].sourdough} 100 gr`,
                `${translations[lang].oil} 5 ${translations[lang].oil3}`
            ],
            process: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        },
        'pane': {
            name: translations[lang].bread,
            image: allproducts,
            defaultIngredients: [
                `${translations[lang].flour} 500 gr`,
                `${translations[lang].wat} 350 gr`,
                `${translations[lang].salt} 10 gr`,
                `${translations[lang].sourdough} 100 gr`
            ],
            process: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        'pizza': {
            name: translations[lang].pizza,
            image: allproducts,
            defaultIngredients: [
                `${translations[lang].flour} 500 gr`,
                `${translations[lang].wat} 350 gr`,
                `${translations[lang].salt} 10 gr`,
                `${translations[lang].sourdough} 100 gr`
            ],
            process: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        'buns': {
            name: translations[lang].buns || 'Buns',
            image: pic1,
            defaultIngredients: [
                `${translations[lang].flour} 500 gr`,
                `${translations[lang].wat} 300 gr`,
                `${translations[lang].salt} 10 gr`,
                `${translations[lang].sourdough} 100 gr`,
                'Burro 50 gr'
            ],
            process: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        'pan-brioche': {
            name: translations[lang].panBrioche || 'Pan Brioche',
            image: pic1,
            defaultIngredients: [
                `${translations[lang].flour} 500 gr`,
                `${translations[lang].wat} 250 gr`,
                `${translations[lang].salt} 10 gr`,
                `${translations[lang].sourdough} 100 gr`,
                'Burro 100 gr',
                'Uova 2'
            ],
            process: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        },
        'panettone-milanese': {
            name: translations[lang].panettoneMilanese || 'Panettone stile "milanese"',
            image: pic1,
            defaultIngredients: [
                `${translations[lang].flour} 500 gr`,
                `${translations[lang].wat} 200 gr`,
                `${translations[lang].salt} 10 gr`,
                `${translations[lang].sourdough} 150 gr`,
                'Burro 150 gr',
                'Uova 3',
                'Zucchero 100 gr',
                'Uvetta 100 gr'
            ],
            process: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
        },
        'pane-burro': {
            name: translations[lang].paneBurro || 'Pane al burro',
            image: pic1,
            defaultIngredients: [
                `${translations[lang].flour} 500 gr`,
                `${translations[lang].wat} 300 gr`,
                `${translations[lang].salt} 10 gr`,
                `${translations[lang].sourdough} 100 gr`,
                'Burro 80 gr'
            ],
            process: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
    };

    const recipe = recipeData[recipeId];
    
    if (!recipe) {
        return (
            <div className="page-container">
                <h2>Ricetta non trovata</h2>
                <button onClick={() => navigate('/recipes')} className="home-btn pages-button">
                    Torna alle ricette
                </button>
            </div>
        );
    }

    // Get ingredients - use calculated if available and matches recipe
    const getIngredients = () => {
        if (!calculatedRecipe) {
            return recipe.defaultIngredients;
        }

        // Map recipe IDs to product names in calculated recipe
        const recipeToProduct = {
            'focaccia': 'Focaccia',
            'pane': 'Chleb',
            'pizza': 'Pizza'
        };

        const productName = recipeToProduct[recipeId];
        if (productName && calculatedRecipe.product === productName) {
            // Use calculated ingredients
            const ingredients = [
                `${translations[lang].flour} ${calculatedRecipe.flour} gr`,
                `${translations[lang].wat} ${calculatedRecipe.water} gr`,
                `${translations[lang].salt} ${calculatedRecipe.salt} gr`,
                `${translations[lang].sourdough} ${calculatedRecipe.levain} gr`
            ];
            
            // Add oil for focaccia
            if (recipeId === 'focaccia') {
                ingredients.push(
                    `${translations[lang].oil} ${calculatedRecipe.oil} ${calculatedRecipe.oil === 1 ? translations[lang].oil1 : (calculatedRecipe.oil < 5 ? translations[lang].oil2 : translations[lang].oil3)}`
                );
            }
            
            return ingredients;
        }

        return recipe.defaultIngredients;
    };

    const ingredients = getIngredients();

    return (
        <div className="page-container">
            <h2 className="section-title">{recipe.name}</h2>
            
            <div className="recipe-detail-content">
                <div className="recipe-detail-image-container">
                    <img src={recipe.image} alt={recipe.name} className="recipe-detail-image" />
                </div>

                <div className="recipe-detail-ingredients">
                    <h3>{translations[lang].ingredients || 'Ingredienti'}:</h3>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className="recipe-detail-process">
                    <h3>{translations[lang].process || 'Processo'}:</h3>
                    <p>{recipe.process}</p>
                </div>
            </div>

            <div className="button-group centered-buttons">
                <button 
                    type="button" 
                    onClick={() => navigate('/recipes')} 
                    className="home-btn pages-button"
                >
                    <FaWindowClose style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    {translations[lang].goBack}
                </button>
            </div>
        </div>
    );
};

export default RecipeDetailPage;

