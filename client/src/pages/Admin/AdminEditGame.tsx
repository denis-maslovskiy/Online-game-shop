// TODO: после загрузки формы в нее не вносятся изменения ||  Update: 16.09 - похоже что пофикшено
// Update: 16.09 - Игра не обновляется(в onSubmit ничего нет).

import React, { useState, useEffect, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { getGameInfo, getAllGames, deleteGame } from "../../redux/games/gamesActions";
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

const RenderGameForm = ({initialGameData, deleteGameClickHandler}) => {
  console.log(initialGameData);
  
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
          isPhysical: initialGameData.isPhysical,
          isDigital: initialGameData.isDigital
        }}
        // onSubmit={(values, { resetForm }) => {
        //   dispatch(addGame(values));
        //   resetForm();
        // }}
        onSubmit={() => console.log("changes saved")}
        validationSchema={validationSchema}
      >
        {({
          errors,
          touched,
          values,
          isSubmitting,
        }) => (
          <Form className="form">
            <Field
              name="isPhysical"
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  control={
                    <Checkbox
                      name="isPhysical"
                      color="primary"
                    />
                  }
                  label="Is Physical"
                />
              )}
            />

            <Field
              name="isDigital"
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  control={
                    <Checkbox
                      name="isDigital"
                      color="primary"
                    />
                  }
                  label="Is Digital"
                />
              )}
            />

            {inputs.map(input => {
              return (
                <Field
                  name={input.name}
                  render={({ field }) => (
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
                />
              )
            })}

            {/* <Field
              name='gameName'
              render={({ field }) => (
                <div className='form__div'>
                  <TextField
                    {...field}
                    className='form__input'
                    required
                    label='game name'
                    variant='outlined'
                  />
                </div>
              )}
            /> */}

            //? Пока не удалять
            {/* <Field
              name="gameName"
              render={({ field }) => (
                
                  <div>
                    <TextField
                      {...field}
                      className='form__input'
                      required
                      label='game name'
                      variant="outlined"
                    />
                  </div>
              
              )
              }
            /> */}
            
            {/* {inputs.map((input) => {
              if (input.name === "gameDescription") {
                return (
                  <div className="form__div" key={input.name}>
                    <TextField
                      className="form__input"
                      required
                      label={input.label}
                      variant="outlined"
                      multiline
                      name={input.name}
                      // defaultValue={initialGameData[input.name]}
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
                      name={input.name}
                      // defaultValue={0}
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
                    name={input.name}
                    // defaultValue={initialGameData[input.name]}
                  />
                </div>
              );
            })} */}
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
            <button className="delete-game-button" onClick={() => deleteGameClickHandler(values._id)}>
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
  const { allGames } = useSelector((state) => state.games);
  const [initialGameData, setInitialGameData] = useState(null);

  useEffect(() => {
    dispatch(getAllGames());
  }, []);

  const gamesOptions = allGames.map((game) => {
    return (
      <MenuItem value={game._id} key={game._id}>
        {game.gameName}
      </MenuItem>
    );
  });

  const selectHandleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const gameId = event.target.value;

    const gameData = allGames.find((game) => {
      return game._id === gameId;
    });

    console.log("gameData", gameData);
    setInitialGameData(gameData);
  };

  const deleteGameClickHandler = (gameId: string) => {
    console.log('game deleted');
    console.log(gameId);
    dispatch(deleteGame(gameId))
  }

  return (
    <>
      <FormControl>
        <InputLabel>Select game</InputLabel>
        <Select value={gamesOptions} onChange={selectHandleChange}>{gamesOptions}</Select>
      </FormControl>

      {initialGameData && <RenderGameForm initialGameData={initialGameData} deleteGameClickHandler={deleteGameClickHandler}/>}
    </>
  );
};

export default AdminAddGame;
