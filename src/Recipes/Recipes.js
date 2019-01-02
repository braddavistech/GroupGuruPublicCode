import React, { Component } from "react";
import "./Recipes.css";
import { confirmAlert } from "react-confirm-alert";
import $ from "jquery";
import DataModules from "../modules/dataModules";
import _ from "lodash";
import firebase from "firebase";
import moment from "moment";

const db = firebase.firestore();

export default class Recipes extends Component {
  state = {
    addRecipe: false,
    ingredients: []
  }

  addBlur = () => {
    $(".navBarContainer").addClass("none");
    $("#root").addClass("none");
  }

  clearBlur = () => {
    $(".navBarContainer").removeClass("none");
    $("#root").removeClass("none");
  }

  removeIngredient = (i) => {
    let tempIngredients = this.state.ingredients;
    tempIngredients.splice(i, 1);
  }

  editRecipe = (recipe) => {
    this.addBlur();
    let i = -1;
    this.setState({ingredients: recipe.ingredients});
    let ingredients = recipe.ingredients.map(ingredient => {
      i++;
      let itemNum = i;
      return <React.Fragment><p className="ingredientsEditIndiv" key={i}>{ingredient.ingredient} - {ingredient.ingredientAmount} </p>
      <p className="removeIngredientEditIndiv" onClick={() => this.removeIngredient(itemNum)}>Remove Ingredient</p>
      </React.Fragment>
    })
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="addRecipeContainer">
            <h1 id="mainRecipeTitle">EDIT RECIPE</h1>
            <div id="addRecipeInoutDiv">
              <section id="recipeTextSection">
                <section className="indivIngredientTextEdit">
                  <p className="addRecipeTextTitle">Name</p>
                  <input className="recipeTextInput" defaultValue={recipe.name} ref={input => this.name = input} ></input>
                </section>
                <section className="indivIngredientTextEdit">
                  <p className="addRecipeTextTitle">Description</p>
                  <textarea className="recipeTextInputArea" defaultValue={recipe.description} ref={input => this.description = input} ></textarea>
                </section>
                <section className="indivIngredientTextEdit">
                  <p className="addRecipeTextTitle">Instructions</p>
                  <textarea className="recipeTextInputArea" defaultValue={recipe.instructions} ref={input => this.instructions = input} ></textarea>
                </section>
                <section className="indivIngredientTextEditIngredients">
                  <p className="addRecipeTextTitle">Ingredients</p>
                  {ingredients}
                  <input className="ingredientTextInput" placeholder="Add ingredient..." ref={input => this.ingredient = input} ></input>
                  <input className="ingredientTextInput" placeholder="Ingredient amount..." ref={input => this.ingredientAmount = input} ></input>
                  <button id="addNewIngredientBtn" onClick={this.addIngredient}>ADD INGREDIENT</button>
                </section>
              </section>
            </div>
            <div className="editRecipeBtn">
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="photoConfirmation" alt="Back" onClick={() => {
                this.setState({ingredients: []})
                this.clearBlur();
                onClose();
              }} />
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" className="photoConfirmation" alt="Save" onClick={() => {
                this.saveEditRecipe(recipe);
                this.clearBlur();
                onClose();
              }} />
            </div>
          </div>
        )
      }
    })
  }

  showRecipes = () => {
    let recipes = this.props.props.recipes.Recipes;
    let sortedRecipes = _.sortBy(recipes, "name", "desc")
    return sortedRecipes.map(recipe => {
      if (recipe.userId === this.props.props.currentUser.userId) {
        return <section className="recipeSlides">
          <p className="recipeName">{recipe.name}</p>
          <p className="recipeDesc">DESCRIPTION: {recipe.description}</p>
          <p className="recipeInst">INSTRUCTIONS: {recipe.instructions}</p>
          {recipe.ingredients.map(ingredient => {
            return <p className="recipeIngredients">{ingredient.ingredient} - {ingredient.ingredientAmount}</p>
          })
          }
          <img className="addNewRecipeBtn" src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FeditIcon.png?alt=media&token=5dd654c2-743f-4d30-b6d8-e30efe815cea" alt="Edit" onClick={() => {
            this.editRecipe(recipe)
          }
          } />
        </section>
      } else {
        return <section className="recipeSlides">
          <p className="recipeName">{recipe.name}</p>
          <p className="recipeDesc">DESCRIPTION: {recipe.description}</p>
          <p className="recipeInst">INSTRUCTIONS: {recipe.instructions}</p>
          {recipe.ingredients.map(ingredient => {
            return <p className="recipeIngredients">{ingredient.ingredient} - {ingredient.ingredientAmount}</p>
          })
          }
        </section>
      }
    })
  }


  addIngredient = () => {
    if (this.ingredient.value !== "" && this.ingredientAmount.value !== "") {
      let newIngredients = {};
      newIngredients.ingredient = this.ingredient.value;
      newIngredients.ingredientAmount = this.ingredientAmount.value;
      let allIngredients = this.state.ingredients;
      allIngredients.push(newIngredients);
      this.setState({ ingredients: allIngredients });
      this.ingredient.value = "";
      this.ingredientAmount.value = "";
    }
  }

  saveEditRecipe = (recipe) => {
    let canSave = true;
    let date = new Date()
    date = moment(date).utc().format()
    recipe.addedDate = date;
    recipe.name = this.name.value;
    recipe.description = this.description.value;
    recipe.ingredients = this.state.ingredients;
    recipe.instructions = this.instructions.value;
    recipe.userId = this.props.props.currentUser.userId;
    if (!this.name.value.replace(/\s/g, "").length) canSave = false;
    if (!this.instructions.value.replace(/\s/g, "").length) canSave = false;
    if (this.state.ingredients === []) canSave = false;
    if (canSave) {
      let allRecipes = [];
      this.props.props.recipes.Recipes.forEach(oldRecipe => {
        if (oldRecipe.recipeId !== recipe.recipeId) {
        allRecipes.push(oldRecipe)
        }
      })
      allRecipes.push(recipe)
      this.name.value = "";
      this.description.value = "";
      this.instructions.value = "";
      db.collection("recipes").doc("AllRecipes").set({ Recipes: allRecipes })
      this.setState({ ingredients: [], addRecipe: false })
    }
  }

  saveRecipe = () => {
    let canSave = true;
    let recipe = {};
    let date = new Date()
    date = moment(date).utc().format()
    recipe.addedDate = date;
    recipe.recipeId = DataModules.makeRandomId();
    recipe.name = this.name.value;
    recipe.description = this.description.value;
    recipe.ingredients = this.state.ingredients;
    recipe.instructions = this.instructions.value;
    recipe.userId = this.props.props.currentUser.userId;
    if (!this.name.value.replace(/\s/g, "").length) canSave = false;
    if (!this.instructions.value.replace(/\s/g, "").length) canSave = false;
    if (this.state.ingredients === []) canSave = false;
    if (canSave) {
      let allRecipes = [];
      this.props.props.recipes.Recipes.forEach(oldRecipe => {
        allRecipes.push(oldRecipe)
      })
      allRecipes.push(recipe)
      this.name.value = "";
      this.description.value = "";
      this.instructions.value = "";
      db.collection("recipes").doc("AllRecipes").set({ Recipes: allRecipes })
      this.setState({ ingredients: [], addRecipe: false })
    }
  }

  allIngredientsAmount = () => {
    let i = 0;
    if (this.state.ingredients.length === 0) {
      return <p className="ingredients">Please add ingredients to recipe.</p>
    } else {
      return this.state.ingredients.map(ingredients => {
        i++;
        return <p className="ingredients" key={i}>{ingredients.ingredient} - {ingredients.ingredientAmount}</p>
      })
    }
  }

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
        this.setState({addRecipe: false})
      }
    });
    let recipes = this.showRecipes();
    if (!this.state.addRecipe) {
      if (this.props.props.currentUser.userId !== "pgk933mCJVSOJg4DjnM0YPlkpW93") {
      return (
        <div className="mainRecipeContainer">
          <section id="mainRecipeTitleHeader">
            <article id="ggPhotoLogo"></article>
            <h1 id="pageRecipeTitle">RECIPES</h1>
          </section>
          <section className="recipeSlidesSection">
            <section className="innerRecipes">
              {recipes}
            </section>
          </section>
          <section className="addRecipeSection">
            <button className="addRecipeButton" onClick={() => this.setState({ addRecipe: true })}>ADD RECIPE</button>
          </section>
        </div>
      )
      } else {
        return (
          <div className="mainRecipeContainer">
            <section id="mainRecipeTitleHeader">
              <article id="ggPhotoLogo"></article>
              <h1 id="pageRecipeTitle">RECIPES</h1>
            </section>
            <section className="recipeSlidesSection">
              <section className="innerRecipes">
                {recipes}
              </section>
            </section>
          </div>
        )
      }
    } else {
      let ingredientsList = this.allIngredientsAmount();
      return (
        <div id="addRecipeContainer">
          <h1 id="mainRecipeTitle">ADD RECIPE</h1>
          <div id="addRecipeInoutDiv">
            <section id="recipeTextSection">
              <section className="indivIngredientTextEdit">
                <p className="addRecipeTextTitle">Name</p>
                <input className="recipeTextInput" placeholder="Name..." ref={input => this.name = input} ></input>
              </section>
              <section className="indivIngredientTextEdit">
                <p className="addRecipeTextTitle">Description</p>
                <textarea className="recipeTextInputArea" placeholder="Description..." ref={input => this.description = input} ></textarea>
              </section>
              <section className="indivIngredientTextEdit">
                <p className="addRecipeTextTitle">Instructions</p>
                <textarea className="recipeTextInputArea" placeholder="Cooking instructions..." ref={input => this.instructions = input} ></textarea>
              </section>
              <section className="indivIngredientTextEditIngredients">
                <p className="addRecipeTextTitle">Ingredients</p>
                <input className="ingredientTextInput" placeholder="Ingredient..." ref={input => this.ingredient = input} ></input>
                <input className="ingredientTextInput" placeholder="Amount..." ref={input => this.ingredientAmount = input} ></input>
                <button id="addNewIngredientBtn" onClick={this.addIngredient}>ADD INGREDIENT</button>
                {ingredientsList}
              </section>
            </section>
          </div>
          <div className="addPhotoBtnSection">
            <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="photoConfirmation" alt="Back" onClick={() => {
              this.setState({ addRecipe: false })
            }} />
            <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" className="photoConfirmation" alt="Save" onClick={() => {
              this.saveRecipe();
            }} />
          </div>
        </div>
      )
    }
  }
}
