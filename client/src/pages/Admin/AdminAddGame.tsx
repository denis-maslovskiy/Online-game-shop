import React, { useState } from "react";
import { withFormik, FormikProps } from "formik";
import * as Yup from "yup";

interface FormValues {
  gameName: string;
  gameDescription: string;
  rating: number;
  releaseDate: string;
  author: string;
  genre: string;
  numberOfPhysicalCopies: number;
  price: number;
  isPhysical: boolean;
  isDigital: boolean;
}

interface OtherProps {
  title?: string;
}

interface MyFormProps {
  initialGameName?: string;
  initialGameDescription?: string;
  initialRating?: number;
  initialReleaseDate?: string;
  initialAuthor?: string;
  initialGenre?: string;
  initialNumberOfPhysicalCopies?: number;
  initialPrice?: number;
  initialIsPhysical?: boolean;
  initialIsDigital?: boolean;
}

const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  // const [newGame, setNewGame] = useState({
  //   gameName: "",
  //   gameDescription: "",
  //   rating: 0,
  //   releaseDate: "",
  //   author: "",
  //   genre: "",
  //   numberOfPhysicalCopies: 0,
  //   price: 0,
  //   isPhysical: false,
  //   isDigital: false,
  // });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    title,
  } = props;

  const inputs = [
    { label: "Game Name", name: "gameName", value: values.gameName },
    {
      label: "Game Description",
      name: "gameDescription",
      value: values.gameDescription,
    },
    { label: "Rating", name: "rating", value: values.rating },
    { label: "Release Date", name: "releaseDate", value: values.releaseDate },
    { label: "Author", name: "author", value: values.author },
    { label: "Genre", name: "genre", value: values.genre },
    {
      label: "Number of physical copies",
      name: "numberOfPhysicalCopies",
      value: values.numberOfPhysicalCopies,
    },
    { label: "Price", name: "price", value: values.price },
  ];

  return (
    <div className="container">
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Is Physical</label>
          <input
            type="checkbox"
            name="isPhysical"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <label>Is Digital</label>
          <input
            type="checkbox"
            name="isDigital"
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        {inputs.map((input) => {
          if (input.name === "gameDescription") {
            return (
              <div key={input.name}>
                <label>{input.label}</label>
                <textarea
                  name={input.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={input.value}
                />
              </div>
            );
          }
          if (input.name === "numberOfPhysicalCopies" && !values.isPhysical) {
            return (
              <div key={input.name}>
                <label>{input.label}</label>
                <input
                  width={50}
                  type="text"
                  name={input.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={input.value}
                  disabled
                />
              </div>
            );
          }
          return (
            <div key={input.name}>
              <label>{input.label}</label>
              <input
                width={50}
                type="text"
                name={input.name}
                onChange={handleChange}
                onBlur={handleBlur}
                value={input.value}
              />
            </div>
          );
        })}
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !!(errors.gameName && touched.gameName) ||
            !!(errors.gameDescription && touched.gameDescription)
          }
        >
          Add game
        </button>
      </form>
    </div>
  );
};

const AdminAddGame = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: (props) => ({
    gameName: props.initialGameName || "",
    gameDescription: props.initialGameDescription || "",
    rating: props.initialRating || 0,
    releaseDate: props.initialReleaseDate || "",
    author: props.initialAuthor || "",
    genre: props.initialGenre || "",
    numberOfPhysicalCopies: props.initialNumberOfPhysicalCopies || 0,
    price: props.initialPrice || 0,
    isPhysical: props.initialIsPhysical || false,
    isDigital: props.initialIsDigital || false,
  }),

  validationSchema: Yup.object().shape({
    gameName: Yup.string().required("Game name is required"),
    gameDescription: Yup.string().required("Game description is required"),
  }),

  handleSubmit(
    {
      gameName,
      gameDescription,
      rating,
      releaseDate,
      author,
      genre,
      numberOfPhysicalCopies,
      price,
      isPhysical,
      isDigital,
    }: FormValues,
    { props, setSubmitting, setErrors }
  ) {
    const newGame = {
      gameName,
      gameDescription,
      rating,
      releaseDate,
      author,
      genre,
      numberOfPhysicalCopies,
      price,
      isPhysical,
      isDigital,
    };
    console.log('newGame: ', newGame);
  },
})(InnerForm);

export default AdminAddGame;
