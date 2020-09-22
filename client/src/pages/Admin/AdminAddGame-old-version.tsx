import React from "react";
import { withFormik, FormikProps } from "formik";
import * as Yup from "yup";

import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./adminaddgame.scss";
// import axios from "axios";
// // import { connect } from "react-redux";
// import { useDispatch } from "react-redux";


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
    { label: "Release date", name: "releaseDate", value: values.releaseDate },
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
          <FormControlLabel
          aria-required
            control={
              <Checkbox
                name="isPhysical"
                color="primary"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            }
            label="Is Physical"
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                name="isDigital"
                color="primary"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            }
            label="Is Digital"
          />
        </div>
        {inputs.map((input) => {
          if (input.name === "gameDescription") {
            return (
              <div className="form__div" key={input.name}>
                <TextField
                  className="form__input"
                  required
                  label={input.label}
                  variant="outlined"
                  multiline
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={input.value}
                  name={input.name}
                />
              </div>
            );
          }
          if (input.name === "numberOfPhysicalCopies" && !values.isPhysical) {
            return (
              <div className="form__div" key={input.name}>
                <TextField
                  disabled
                  className="form__input"
                  required
                  label={input.label}
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={input.value}
                  name={input.name}
                />
              </div>
            );
          }
          return (
            <div className="form__div" key={input.name}>
              <TextField
                className="form__input"
                required
                label={input.label}
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={input.value}
                name={input.name}
              />
            </div>
          );
        })}
        <button
          type="submit"
          className='add-game-button'
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
    rating: Yup.number().required("Rating is required"),
    releaseDate: Yup.string().required("Release date is required"),
    author: Yup.string().required("Author is required"),
    genre: Yup.string().required("Genre is required"),
    numberOfPhysicalCopies: Yup.number().required(
      "Number of physical copies is required"
    ),
    price: Yup.number().required("Price is required"),
    isPhysical: Yup.boolean(),
    isDigital: Yup.boolean(),
  }),

  // const dispatch = useDispatch();  

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
    { setSubmitting }
  ) {
    console.log("test");

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
    console.log("newGame: ", newGame);
    // (async function () {
    //   try {
    //     const response = await axios.post("/api/games/createOrUpdateGame", {
    //       ...newGame,
    //     });
    //     console.log(response);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // })();
    setSubmitting(false);
  },
})(InnerForm);

export default AdminAddGame;
