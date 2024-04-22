import React, { Children, useContext, useEffect, useState } from 'react'
import fakeStore from '../apis'
import { ALL_MEALS_URL } from '../constants'

const AppContext = React.createContext()

export const useGlobalContext = () => {
  return useContext(AppContext)
}

function AppProvider({ children }) {
  const [meals, setMeals] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState({})
  const selectMeal = (id) => {
    // console.log({ id })
    const meal = meals.find(meal => meal.idMeal === id)
    // console.log({ meal })
    setSelectedMeal(meal)
    setShowModal(true)
  }

  const [favoriteFood, setFavoriteFood] = useState([])
  // console.log("favoriteFood", favoriteFood)
  const addMealToFavoriteFood = (id) => {
    // console.log({ id })
    const meal = meals.find(meal => meal.idMeal === id)
    // console.log({ meal })
    const alreadyFavorite = favoriteFood.find(meal => meal.idMeal === id)
    // console.log({ alreadyFavorite })
    if (alreadyFavorite) return
    const updatedFavoriteFood = [...favoriteFood, meal]
    setFavoriteFood(updatedFavoriteFood)
  }

  const removeMealFromFavoriteFood = (id) => {
    const updatedFavoriteFood = favoriteFood.filter(food => food.idMeal !== id)
    setFavoriteFood(updatedFavoriteFood)
  }

  const [mealSearch, setMealSearch] = useState('')
  console.log("mealSearch", mealSearch)

  const fetchMeals = async (url) => {
    setIsLoading(true)
    try {
      const response = await fakeStore().get(url)
      console.log("response", response)
      if (response.data.meals) {
        setMeals(response.data.meals)
      } else {
        setMeals([])
      }
    } catch (error) {
      console.log("error", error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMeals(ALL_MEALS_URL)
  }, [])

  useEffect(() => {
    if(mealSearch)
      fetchMeals(`${ALL_MEALS_URL}${mealSearch}`)
  }, [mealSearch])

  return (
    <AppContext.Provider
      value={{
        isLoading,
        meals,
        selectMeal,
        selectedMeal,
        setSelectedMeal,
        setShowModal,
        showModal,

        favoriteFood,
        addMealToFavoriteFood,
        removeMealFromFavoriteFood,

        setMealSearch,
        fetchMeals,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider