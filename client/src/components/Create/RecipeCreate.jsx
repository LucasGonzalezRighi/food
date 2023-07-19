import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postRecipe, getTypeDiets } from '../../Redux/actions';
import { useDispatch, useSelector } from "react-redux";
import styles from './RecipeCreate.module.css';

function controlForm(input) {
  const reg = new RegExp('^[0-9]+$');
  let errors = {};
  if (!input.title) errors.title = 'please put the title of the recipe';
  if (!input.summary) errors.summary = 'please put the summary of the recipe';
  if (input.healthScore < 0 || input.healthScore > 100 || !reg.test(input.healthScore))
    errors.healthScore = 'put a healthScore between 0-100';
  if (!input.image) errors.image = "please add an image to your recipe";
  if (!input.typeDiets || input.typeDiets.length === 0) errors.typeDiets = "please select at least one type of diet for your recipe";

  return errors;
}

export default function CreateRecipe() {
  const dispatch = useDispatch();

  let listDiets = useSelector((state) => state.typeDiets);
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState({
    title: '',
    summary: '',
    healthScore: '',
    analyzedInstructions: '',
    typeDiets: [],
    image: ''
  });

  useEffect(() => {
    dispatch(getTypeDiets());
  }, [dispatch]);

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
    setErrors(
      controlForm({
        ...input,
        [e.target.name]: e.target.value
      })
    );
  }

  function handleSelect(e) {
    setInput({
      ...input,
      typeDiets: [...input.typeDiets, e.target.value]
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { title, summary, healthScore, analyzedInstructions, typeDiets, image } = input;
    try {
      await dispatch(postRecipe({
        title,
        summary,
        healthScore,
        analyzedInstructions,
        typeDiets: [typeDiets], // Convertimos el tipo de dieta en un array
        image
      }));
      alert('Congratulations! You have created a new recipe!');
      setInput({
        title: '',
        summary: '',
        healthScore: '',
        analyzedInstructions: '',
        typeDiets: [],
        image: ''
      });
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  }

  function handleDelete(e) {
    setInput({
      ...input,
      typeDiets: input.typeDiets.filter((diet) => diet !== e)
    });
  }

  return (
    <div className={styles.bkg}>
      <div className={styles.container}>
        <Link to="/home">
          <button className={styles.btn}>BACK TO HOME</button>
        </Link>
        <h1 className={styles.h1}>Create your own recipe!</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="title"
              value={input.title}
              onChange={handleChange}
            />
            {errors.title && <p className={styles.error}>{errors.title}</p>}
          </div>
          <hr></hr>
          <div>
            <label>Summary:</label>
            <input
              type="text"
              name="summary"
              value={input.summary}
              onChange={handleChange}
            />
            {errors.summary && <p className={styles.error}>{errors.summary}</p>}
          </div>
          <hr></hr>
          <div>
            <label>Health score:</label>
            <input
              type="text"
              name="healthScore"
              value={input.healthScore}
              onChange={handleChange}
            />
            {errors.healthScore && <p className={styles.error}>{errors.healthScore}</p>}
          </div>
          <hr></hr>
          <div>
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={input.image}
              onChange={handleChange}
            />
            {errors.image && <p className={styles.error}>{errors.image}</p>}
          </div>
          <hr></hr>
          <div>
            <label>Step by step:</label>
            <input
              type="text"
              name="analyzedInstructions"
              value={input.analyzedInstructions}
              onChange={handleChange}
            />
          </div>
          <hr></hr>
          <select onChange={handleSelect} className={styles.select}>
            {listDiets?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <hr></hr>
          {input.typeDiets.map((e) => {
            return (
              <div key={e}>
                <h5 className={styles.types}>{e}</h5>
                <button className={styles.btnx} onClick={() => handleDelete(e)}>
                  X
                </button>
              </div>
            );
          })}
          {errors.title || errors.summary || errors.healthScore || errors.image || errors.typeDiets ? (
            <p className={styles.adv}>Please complete all the inputs to create your recipe.</p>
          ) : (
            <button type="submit" className={styles.correct}>Create Recipe</button>
          )}
        </form>
        <hr></hr>
      </div>
    </div>
  );
}
