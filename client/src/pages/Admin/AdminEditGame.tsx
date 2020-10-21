import React, { useState, useEffect } from "react";
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
  { label: "Digital", name: "isDigital" },
  { label: "Physical", name: "isPhysical" },
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

const initialEmptyForm = {
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
  _id: "",
};

const RenderGameForm = ({
  initialGameData,
  deleteGameClickHandler,
}: IProps) => {
  const dispatch = useDispatch();
  return (
    <>
      <h2 className="title">Edit Game</h2>
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
          isPhysical: initialGameData.isPhysical,
          isDigital: initialGameData.isDigital,
          _id: initialGameData._id,
        }}
        onSubmit={(values) => {
          console.log("Game has been edited...");
          dispatch(updateGameData(values._id, values));
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ values }) => (
          <Form className="form">
            {inputs.map((input) => {
              if (input.name === "isDigital" || input.name === "isPhysical") {
                return (
                  <Field key={input.name} name={input.name} label={input.label}>
                    {({ field }: FieldProps<FormValues>) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            color="primary"
                            checked={values[`${input.name}`]}
                          />
                        }
                        label={input.label}
                      />
                    )}
                  </Field>
                );
              }

              return (
                <Field key={input.name} name={input.name}>
                  {({ field }: FieldProps<FormValues>) => (
                    <div className="form__div">
                      <TextField
                        {...field}
                        required
                        label={input.label}
                        variant="outlined"
                      />
                    </div>
                  )}
                </Field>
              );
            })}
            <button type="submit" className="add-game-button">
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

const AdminEditGame: React.FC = () => {
  const dispatch = useDispatch();
  const { allGames } = useSelector((state: RootState) => state.games);
  const [initialGameData, setInitialGameData] = useState(initialEmptyForm);

  useEffect(() => {
    dispatch(getAllGames());
  }, []);

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
      <FormControl id="test">
        <InputLabel>Select game</InputLabel>
        {/* @ts-ignore */}
        <Select value={initialGameData?._id} onChange={selectHandleChange}>
          {allGames.map((game: FormValues) => {
            return (
              <MenuItem value={game._id} key={game._id}>
                {game.gameName}
              </MenuItem>
            );
          })}
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

export default AdminEditGame;
