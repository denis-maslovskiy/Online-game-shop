// TODO: 26.09 - Не отображается контент в чекбоксах

import React, { useState, useEffect, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Field, Form, Formik, FieldProps } from "formik";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  updateGameData,
  getAllGames,
  deleteGame,
} from "../../redux/games/gamesActions";
import { RootState } from "../../redux/rootReducer";
import "./admineditgame.scss";
import "./adminaddgame.scss";

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
  _id: string;
}

interface IProps {
  initialGameData: FormValues;
  deleteGameClickHandler: (id: string) => void;
}

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

const RenderGameForm = ({
  initialGameData,
  deleteGameClickHandler,
}: IProps) => {
  const dispatch = useDispatch();
  return (
    <>
      <Formik
        initialValues={{
          gameName: initialGameData.gameName,
          gameDescription: initialGameData.gameDescription,
          rating: initialGameData.rating,
          releaseDate: initialGameData.releaseDate,
          author: initialGameData.author,
          genre: initialGameData.genre,
          numberOfPhysicalCopies: initialGameData.numberOfPhysicalCopies,
          price: initialGameData.price,
          isPhysical: true,
          isDigital: initialGameData.isDigital,
          _id: initialGameData._id,
        }}
        onSubmit={(values) => {
          console.log("Game has been edited...");
          dispatch(updateGameData(values._id, values));
        }}
        validationSchema={validationSchema}
      >
        {({ errors, touched, values, isSubmitting }) => (
          <Form className="form">
            <Field
            // name="isPhysical"
            >
              {({ field }: FieldProps<FormValues>) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      // name="isPhysical"
                      color="primary"
                      {...field}
                    />
                  }
                  label="Is Physical"
                />
              )}
            </Field>

            <Field name="isDigital">
              {({ field }: FieldProps<FormValues>) => (
                <FormControlLabel
                  {...field}
                  control={<Checkbox name="isDigital" color="primary" />}
                  label="Is Digital"
                />
              )}
            </Field>

            {inputs.map((input) => {
              return (
                <Field key={input.name} name={input.name}>
                  {({ field }: FieldProps<FormValues>) => (
                    <div className="form__div">
                      <TextField
                        {...field}
                        className="form__input"
                        required
                        label={input.label}
                        variant="outlined"
                      />
                    </div>
                  )}
                </Field>
              );
            })}
            <button
              type="submit"
              className="add-game-button"
              disabled={
                isSubmitting ||
                !!(errors.gameName && touched.gameName) ||
                !!(errors.gameDescription && touched.gameDescription)
              }
            >
              Save changes
            </button>
            <button
              className="delete-game-button"
              onClick={() => deleteGameClickHandler(values._id)}
            >
              Delete game
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

const AdminAddGame: React.FC = () => {
  const dispatch = useDispatch();
  const { allGames } = useSelector((state: RootState) => state.games);
  const [initialGameData, setInitialGameData] = useState<FormValues | null>(
    null
  );

  useEffect(() => {
    dispatch(getAllGames());
  }, []);
  // @ts-ignore
  const gamesOptions = allGames.map((game) => {
    return (
      <MenuItem value={game._id} key={game._id}>
        {game.gameName}
      </MenuItem>
    );
  });

  const selectHandleChange = (event: React.FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    const gameId = event.target.value;
    // @ts-ignore
    const gameData = allGames.find((game) => {
      return game._id === gameId;
    });

    setInitialGameData(gameData);
  };

  const deleteGameClickHandler = async (gameId: string) => {
    dispatch(deleteGame(gameId));
  };

  return (
    <>
      <FormControl>
        <InputLabel>Select game</InputLabel>
        {/* @ts-ignore */}
        <Select value={initialGameData?.gameName} onChange={selectHandleChange}>
          {gamesOptions}
        </Select>
      </FormControl>

      {initialGameData && (
        <RenderGameForm
          initialGameData={initialGameData}
          deleteGameClickHandler={deleteGameClickHandler}
        />
      )}
    </>
  );
};

export default AdminAddGame;
