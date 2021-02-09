import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import * as Yup from "yup";
import { Field, Form, Formik, FieldProps } from "formik";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { adminUpdateGameData, getAllGames, deleteGame } from "../../redux/games/gamesActions";
import Notification from "../../components/Notification";
import "./admineditgame.scss";
import "./adminaddgame.scss";

import {
  getAllAuthors,
  adminUpdateGameAuthorData,
  adminDeleteGameAuthor,
  adminAddAuthor,
} from "../../redux/gameAuthor/gameAuthorActions";

interface FormValues {
  gameName: string;
  gameDescription: string;
  releaseDate: string;
  author: string;
  genre: string;
  numberOfPhysicalCopies: number;
  price: number;
  isPhysical: boolean;
  isDigital: boolean;
  _id: string;
  discount: number;
}

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
  _id: string;
}

interface Author {
  authorName: string;
  authorDescription: string;
  authorsGames: Array<Game>;
  yearOfFoundationOfTheCompany: Date;
  _id: string;
}

interface IProps {
  initialGameData: FormValues;
  deleteGameClickHandler: (id: string) => void;
  allGameAuthors: Array<Author>;
  userId: string;
}

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
  discount: Yup.string().min(0).max(100),
});

const inputs = [
  { label: "Digital", name: "isDigital" },
  { label: "Physical", name: "isPhysical" },
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

const initialEmptyForm = {
  gameName: "",
  gameDescription: "",
  releaseDate: "",
  author: "",
  genre: "",
  numberOfPhysicalCopies: 0,
  price: 0,
  isPhysical: false,
  isDigital: false,
  _id: "",
  discount: 0,
};

const RenderGameForm = ({ initialGameData, deleteGameClickHandler, allGameAuthors, userId }: IProps) => {
  const dispatch = useDispatch();

  const updateGameInAuthorsArray = (game: Game) => {
    let updatedAuthor: Author = {
        authorName: "",
        authorDescription: "",
        authorsGames: [],
        yearOfFoundationOfTheCompany: new Date(),
        _id: "",
      },
      authorId = "",
      isAuthorAlreadyExist = false,
      previousAuthor: Author = {
        authorName: "",
        authorDescription: "",
        authorsGames: [],
        yearOfFoundationOfTheCompany: new Date(),
        _id: "",
      };

    allGameAuthors.forEach((author) => {
      author.authorsGames.forEach((authorGame) => {
        if (authorGame.gameName === game.gameName) {
          previousAuthor = author;
        }
      });
    });

    allGameAuthors.forEach((author) => {
      if (author.authorName === game.author) {
        author.authorsGames.forEach((item, index) => {
          authorId = author._id;
          if (previousAuthor.authorName !== game.author) {
            author.authorsGames.push(game); // Add a game to a new author
            updatedAuthor = author;

            previousAuthor.authorsGames.forEach((prevAuthorGame, index) => {
              if (prevAuthorGame.gameName === game.gameName) {
                previousAuthor.authorsGames.splice(index, 1); // Delete the game from the previous author
                dispatch(adminUpdateGameAuthorData(previousAuthor._id, { ...previousAuthor, userId }));
              }
            });
          } else if (item.gameName === game.gameName) {
            author.authorsGames[index] = game;
            return (updatedAuthor = author);
          } else {
            author.authorsGames.push(game);
            updatedAuthor = author;
          }
        });

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

    dispatch(adminUpdateGameAuthorData(authorId, { ...updatedAuthor, userId }));
  };

  return (
    <>
      <h2 className="title">Edit Game</h2>
      <Formik
        initialValues={{
          gameName: initialGameData.gameName,
          gameDescription: initialGameData.gameDescription,
          releaseDate: initialGameData.releaseDate,
          author: initialGameData.author,
          genre: initialGameData.genre,
          numberOfPhysicalCopies: initialGameData.numberOfPhysicalCopies,
          price: initialGameData.price,
          isPhysical: initialGameData.isPhysical,
          isDigital: initialGameData.isDigital,
          _id: initialGameData._id,
          discount: initialGameData.discount,
        }}
        onSubmit={(values) => {
          const { userId } = JSON.parse(localStorage.getItem("userData")!);
          dispatch(adminUpdateGameData(values._id, { ...values, userId }));
          updateGameInAuthorsArray(values);
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
                        // @ts-ignore
                        control={<Checkbox {...field} color="primary" checked={values[`${input.name}`]} />}
                        label={input.label}
                      />
                    )}
                  </Field>
                );
              }

              if (input.name === "numberOfPhysicalCopies" && !values.isPhysical) {
                return (
                  <Field key={input.name} name={input.name}>
                    {({ field }: FieldProps<FormValues>) => (
                      <div className="form__div">
                        <TextField disabled {...field} required label={input.label} variant="outlined" />
                      </div>
                    )}
                  </Field>
                );
              }

              return (
                <Field key={input.name} name={input.name}>
                  {({ field }: FieldProps<FormValues>) => (
                    <div className="form__div">
                      <TextField {...field} required label={input.label} variant="outlined" />
                    </div>
                  )}
                </Field>
              );
            })}
            <button type="submit" className="add-game-button">
              Save changes
            </button>
            <button type="button" className="delete-game-button" onClick={() => deleteGameClickHandler(values._id)}>
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
  const { successMsg, infoMsg, errorMsg } = useSelector((state: RootState) => state.notification);
  const { allGameAuthors } = useSelector((state: RootState) => state.gameAuthor);
  const [initialGameData, setInitialGameData] = useState(initialEmptyForm);

  const { userId } = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    dispatch(getAllGames());
    dispatch(getAllAuthors());
  }, []);

  const selectHandleChange = (event: React.FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    const gameId = event.target.value;
    const gameData = allGames.find((game: Game) => {
      return game._id === gameId;
    });

    setInitialGameData(gameData);
  };

  const deleteGameClickHandler = async (gameId: string) => {
    dispatch(deleteGame(gameId, { userId }));

    let updatedAuthor: Author = {
        authorName: "",
        authorDescription: "",
        authorsGames: [],
        yearOfFoundationOfTheCompany: new Date(),
        _id: "",
      },
      authorId = "";
    const gameData = allGames.find((game: Game) => {
      return game._id === gameId;
    });

    allGameAuthors.forEach((author: Author) => {
      author.authorsGames.forEach((game, index: number) => {
        if (game.gameName === gameData.gameName) {
          author.authorsGames.splice(index, 1);
          updatedAuthor = author;
          authorId = author._id;
        }
      });
    });

    if (!updatedAuthor.authorsGames.length) {
      dispatch(adminDeleteGameAuthor(authorId, { userId }));
    } else {
      dispatch(adminUpdateGameAuthorData(authorId, { ...updatedAuthor, userId }));
    }
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

      {successMsg && <Notification values={{ successMsg }} />}
      {infoMsg && <Notification values={{ infoMsg }} />}
      {errorMsg && <Notification values={{ errorMsg }} />}
      {initialGameData && (
        <RenderGameForm
          initialGameData={initialGameData}
          deleteGameClickHandler={deleteGameClickHandler}
          allGameAuthors={allGameAuthors}
          userId={userId}
        />
      )}
    </>
  );
};

export default AdminEditGame;
