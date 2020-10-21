// TODO: Не работает отчистка формы
// TODO: Сделать кнопку недоступной до тех пор, пока все поля не буду заполнены

import React from "react";
import * as Yup from "yup";

import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./adminaddgame.scss";
import { Form, Formik } from "formik";
import { addGame } from "../../helpers/gameHelpers";
import "./adminaddgame.scss";

const validationSchema = Yup.object().shape({
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
});

const inputs = [
  { label: "Game Name", name: "gameName" },
  {
    label: "Game Description",
    name: "gameDescription",
  },
  { label: "Rating", name: "rating" },
  { label: "Release date", name: "releaseDate" },
  { label: "Author", name: "author" },
  { label: "Genre", name: "genre" },
  {
    label: "Number of physical copies",
    name: "numberOfPhysicalCopies",
  },
  { label: "Price", name: "price" },
];

const initialValues = {
  gameName: "",
  gameDescription: "",
  rating: 0,
  releaseDate: "",
  author: "",
  genre: "",
  numberOfPhysicalCopies: 0,
  price: 0,
  isPhysical: false,
  isDigital: false,
};

const AdminAddGame: React.FC = () => {
  return (
    <>
      <h2 className="title">Add new game</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, {resetForm}) => {
          addGame(values);
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {({
          errors,
          touched,
          handleChange,
          handleBlur,
          values,
          isSubmitting,
        }) => (
          <Form className="form">
            <div className="form__checkboxes">
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
                      name={input.name}
                    />
                  </div>
                );
              }
              if (
                input.name === "numberOfPhysicalCopies" &&
                !values.isPhysical
              ) {
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
                      name={input.name}
                    />
                  </div>
                );
              }
              if (
                input.name === "numberOfPhysicalCopies" ||
                input.name === "rating" ||
                input.name === "price"
              ) {
                return (
                  <div className="form__div" key={input.name}>
                    <TextField
                      className="form__input"
                      required
                      label={input.label}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name={input.name}
                      type="number"
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
                    name={input.name}
                  />
                </div>
              );
            })}
            <button
              type="submit"
              className="add-game-button"
              disabled={
                isSubmitting ||
                !!(errors.gameName && touched.gameName) ||
                !!(errors.gameDescription && touched.gameDescription) ||
                !!(errors.rating && touched.rating) ||
                !!(errors.releaseDate && touched.releaseDate) ||
                !!(errors.author && touched.author) ||
                !!(errors.genre && touched.genre) ||
                !!(
                  errors.numberOfPhysicalCopies &&
                  touched.numberOfPhysicalCopies
                ) ||
                !!(errors.price && touched.price) ||
                !!(errors.isPhysical && touched.isPhysical) ||
                !!(errors.isDigital && touched.isDigital)
              }
            >
              Add game
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AdminAddGame;
