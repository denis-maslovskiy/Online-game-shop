// TODO: Не работает отчистка формы
// TODO: Сделать кнопку недоступной до тех пор, пока все поля не буду заполнены
// TODO: Игра добавляется, если чекбоксы isPhysical/isDigital оба пустые

import React, { useEffect } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Form, Formik, FormikErrors, FormikTouched } from "formik";
import { addGame } from "../../redux/games/gamesActions";
import { getAllAuthors, adminUpdateGameAuthorData, adminAddAuthor } from "../../redux/gameAuthor/gameAuthorActions";
import Notification from "../../components/Notification";
import "./adminaddgame.scss";

const validationSchema = Yup.object().shape({
  gameName: Yup.string().required("Game name is required"),
  gameDescription: Yup.string().required("Game description is required"),
  releaseDate: Yup.string().required("Release date is required"),
  author: Yup.string().required("Author is required"),
  genre: Yup.string().required("Genre is required"),
  numberOfPhysicalCopies: Yup.number().required("Number of physical copies is required"),
  price: Yup.number().required("Price is required"),
  isPhysical: Yup.boolean(),
  isDigital: Yup.boolean(),
  discount: Yup.number().min(0).max(100),
});

const inputs = [
  { label: "Game Name", name: "gameName" },
  {
    label: "Game Description",
    name: "gameDescription",
  },
  { label: "Release date", name: "releaseDate" },
  { label: "Author", name: "author" },
  { label: "Genre", name: "genre" },
  {
    label: "Number of physical copies",
    name: "numberOfPhysicalCopies",
  },
  { label: "Price", name: "price" },
  { label: "Discount", name: "discount" },
];

const checksForButton = (isSubmitting: boolean, errors: FormikErrors<any>, touched: FormikTouched<any>) => {
  return (
    isSubmitting ||
    !!(errors.gameName && touched.gameName) ||
    !!(errors.gameDescription && touched.gameDescription) ||
    !!(errors.releaseDate && touched.releaseDate) ||
    !!(errors.author && touched.author) ||
    !!(errors.genre && touched.genre) ||
    !!(errors.numberOfPhysicalCopies && touched.numberOfPhysicalCopies) ||
    !!(errors.price && touched.price) ||
    !!(errors.isPhysical && touched.isPhysical) ||
    !!(errors.isDigital && touched.isDigital) ||
    !!(errors.discount && touched.discount)
  );
};

const initialValues = {
  gameName: "",
  gameDescription: "",
  releaseDate: "",
  author: "",
  genre: "",
  numberOfPhysicalCopies: 0,
  price: 0,
  isPhysical: false,
  isDigital: false,
  discount: 0,
};

interface Game {
  gameName: string;
  gameDescription: string;
  releaseDate: string;
  author: string;
  genre: string;
  numberOfPhysicalCopies: number;
  price: number;
  isPhysical: boolean;
  isDigital: boolean;
  discount: number;
}

interface Author {
  authorName: string;
  authorDescription: string;
  authorsGames: Array<Game>;
  yearOfFoundationOfTheCompany: Date;
  _id: string;
}

const AdminAddGame: React.FC = () => {
  const dispatch = useDispatch();
  const { successMsg, errorMsg } = useSelector((state: RootState) => state.notification);
  const { allGameAuthors } = useSelector((state: RootState) => state.gameAuthor);
  const numericalInputs = ["numberOfPhysicalCopies", "price"];
  const { userId } = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    dispatch(getAllAuthors());
  }, []);

  const checkingTheExistenceOfTheAuthor = (game: Game) => {
    let isAuthorAlreadyExist = false;
    allGameAuthors.forEach((author: Author) => {
      if (author.authorName === game.author) {
        author.authorsGames.push(game);
        dispatch(adminUpdateGameAuthorData(author._id, { ...author, userId }));
        isAuthorAlreadyExist = true;
      }
    });
    if (!isAuthorAlreadyExist) {
      const newAuthor = {
        authorName: game.author,
        authorsGames: [game],
      };
      dispatch(adminAddAuthor({ ...newAuthor, userId }));
    }
  };

  return (
    <>
      {successMsg && <Notification values={{ successMsg }} />}
      {errorMsg && <Notification values={{ errorMsg }} />}
      <h2 className="title">Add new game</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          dispatch(addGame({ ...values, userId }));
          checkingTheExistenceOfTheAuthor(values);
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
          <Form className="form">
            <div className="form__checkboxes">
              <div>
                <FormControlLabel
                  aria-required
                  control={<Checkbox name="isPhysical" color="primary" onChange={handleChange} onBlur={handleBlur} />}
                  label="Is Physical"
                />
              </div>
              <div>
                <FormControlLabel
                  control={<Checkbox name="isDigital" color="primary" onChange={handleChange} onBlur={handleBlur} />}
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
                      name={input.name}
                    />
                  </div>
                );
              }
              if (numericalInputs.includes(input.name)) {
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
            <button type="submit" className="add-game-button" disabled={checksForButton(isSubmitting, errors, touched)}>
              Add game
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AdminAddGame;
