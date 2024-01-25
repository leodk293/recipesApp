import React, { useState, useRef } from 'react';
import loader from './assets/loader.gif';
import './container.css';

export default function Container() {
    const inputRef = useRef();
    const [mealsData, setMealsData] = useState({
        loader: false,
        data: undefined,
        error: false,
    });

    let meals = '';

    async function fetchMeals() {
        const userChoice = inputRef.current.value;
        try {
            setMealsData({
                loader: true,
                data: undefined,
                error: false,
            });

            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userChoice}`);

            if (!response.ok) {
                setMealsData({
                    loader: false,
                    data: undefined,
                    error: true,
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            meals = responseData.meals;

            console.log(meals);

            setMealsData({
                loader: false,
                data: meals,
                error: false,
            });

        } catch (error) {
            console.log(error.message);
            setMealsData({
                loader: false,
                data: undefined,
                error: true,
            });
        }
    }

    return (
        <div className='d-flex flex-column align-items-center gy-5 mt-5 global-container'>
            <h1 className="text-light">Find every recipe you want 🍴</h1>
            <p style={{ fontSize: '20px' }} className="text-light fw-bold">Real food does not have ingredients, real food is ingredients</p>
            <p className="text-light fw-bold">-Jamie Oliver</p>
            <h1 className="text-light">Your Search Results:</h1>

            <form onSubmit={(event) => event.preventDefault()} className='d-flex' action=''>
                <input ref={inputRef} type='text' placeholder='Enter the name of a recipe...' />
                <button onClick={fetchMeals}>🔍</button>
            </form>

            {mealsData.loader && <img src={loader} alt='Loading...' />} {/* Show loader while fetching data */}

            {mealsData.data && (
                <div className='layout'>
                    {mealsData.data.map((element) => (
                        // <div className='image-layout' key={element.idMeal}>
                        //     <img key={element.idMeal} src={element.strMealThumb} alt={element.strMeal} />
                        //     <div className="meals-data">
                        //         <p className="text-dark">{element.strMeal}</p>
                        //         <a rel="noreferrer" target="_blank" href={element.strYoutube}>SEE VIDEO</a>
                        //     </div>
                        // </div>
                        <div key={element.idMeal} className="card" style={{width:'18rem'}}>
                            <img key={element.idMeal} src={element.strMealThumb} className="card-img-top" alt= {element.strMeal}/>
                            <div className="card-body d-flex flex-column align-items-center gy-4 dish-data">
                                <h5 className="card-title">{element.strMeal}</h5>    
                                <a rel="noreferrer" target="_blank" href={element.strYoutube}>SEE VIDEO</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {mealsData.error && <p style={{color:'red'}}>Error fetching meals data.</p>}
            {mealsData.data && mealsData.data.length === 0 && <p style={{color:'red'}}>No results found.</p>}
        </div>
    );
}
