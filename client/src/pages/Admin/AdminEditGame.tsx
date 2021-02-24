import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import * as Yup from "yup";
import { Field, Form, Formik, FieldProps } from "formik";
// @ts-ignore
import { Image } from "cloudinary-react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  adminUpdateGameData,
  getAllGames,
  deleteGame,
  adminUploadGameImagesWhenEditingGame,
} from "../../redux/games/gamesActions";
import {
  getAllAuthors,
  adminUpdateGameAuthorData,
  adminDeleteGameAuthor,
  adminAddAuthor,
} from "../../redux/gameAuthor/gameAuthorActions";
import { errorMessage } from "../../redux/notification/notificationActions";
import { DependenciesContext } from "../../context/DependenciesContext";
import Notification from "../../components/Notification";
import "./admineditgame.scss";
import "./adminaddgame.scss";

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
  imgSource: Array<string>;
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
  imgSource: [],
};

const RenderGameForm = ({ initialGameData, deleteGameClickHandler, allGameAuthors, userId }: IProps) => {
  const [fileInputState, setFileInputState] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
  const [previews, setPreviews] = useState<Array<object>>([]);

  const dispatch = useDispatch();
  const { cloudName } = useContext(DependenciesContext);
  const maxNumberOfImages = 6;

  const updateGameInAuthorsArray = (game: Game) => {
    let previousAuthor: Author = {
        authorName: "",
        authorDescription: "",
        authorsGames: [],
        yearOfFoundationOfTheCompany: new Date(),
        _id: "",
      },
      isAuthorAlreadyExist = false;

    allGameAuthors.forEach((author) => {
      author.authorsGames.forEach((authorGame) => {
        if (authorGame.gameName === game.gameName) {
          previousAuthor = author;
        }
      });
    });

    allGameAuthors.forEach((author) => {
      if (author.authorName === game.author) {
        if (previousAuthor.authorName !== game.author) {
          author.authorsGames.push(game); // Add a game to a new author
          dispatch(adminUpdateGameAuthorData(author._id, { ...author }, userId));

          previousAuthor.authorsGames.forEach((prevAuthorGame, index) => {
            if (prevAuthorGame.gameName === game.gameName) {
              previousAuthor.authorsGames.splice(index, 1); // Delete the game from the previous author
              if (previousAuthor.authorsGames.length) {
                return dispatch(adminUpdateGameAuthorData(previousAuthor._id, { ...previousAuthor }, userId));
              } else {
                return dispatch(adminDeleteGameAuthor(previousAuthor._id, { userId }));
              }
            }
          });
        } else {
          author.authorsGames.forEach((item, index) => {
            if (item.gameName === game.gameName) {
              author.authorsGames[index] = game;
              return dispatch(adminUpdateGameAuthorData(author._id, { ...author }, userId));
            }
          });
        }
        isAuthorAlreadyExist = true;
      }
    });

    if (!isAuthorAlreadyExist) {
      previousAuthor.authorsGames.forEach((prevAuthorGame, index) => {
        if (prevAuthorGame.gameName === game.gameName) {
          previousAuthor.authorsGames.splice(index, 1); // Delete the game from the previous author
          if (previousAuthor.authorsGames.length) {
            return dispatch(adminUpdateGameAuthorData(previousAuthor._id, { ...previousAuthor }, userId));
          } else {
            return dispatch(adminDeleteGameAuthor(previousAuthor._id, { userId }));
          }
        }
      });

      const newAuthor = {
        authorName: game.author,
        authorsGames: [game],
      };
      dispatch(adminAddAuthor({ ...newAuthor, userId }));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target!.files;
      if (initialGameData?.imgSource.length + files!.length > maxNumberOfImages) {
        setFileInputState("");
        setPreviews([]);
        throw new RangeError(
          `The maximum number of images is ${maxNumberOfImages}. You already have ${initialGameData?.imgSource.length}`
        );
      }
      setFileInputState(e.target.value);

      // File preview
      const fileList: Array<File> = Array.from(files!);
      const mappedFiles = fileList.map((file: any) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }));
      setPreviews(mappedFiles);
      setSelectedFiles(fileList);
    } catch (e) {
      dispatch(errorMessage(e.message));
    }
  };

  const removeImgClickHandler = (imgId: string) => {
    const index = initialGameData?.imgSource.indexOf(imgId, 0);
    initialGameData?.imgSource.splice(index, 1);
    document.querySelector(`[src*="${imgId}"]`)?.remove();
    document.querySelector(`[id*="${imgId}"]`)?.remove();
    dispatch(adminUpdateGameData(initialGameData._id, { ...initialGameData, userId }));
  };

  const removePreviewImgClickHandler = (srcIdString: string) => {
    let fileIndexForDelete = maxNumberOfImages + 1;
    previews.forEach((file: any, index) => {
      if (file.preview === srcIdString) fileIndexForDelete = index;
    });
    const updatedPreviewsAfterDeleting = previews;
    const updatedSelectedFilesAfterDeleting = selectedFiles;

    updatedPreviewsAfterDeleting.splice(fileIndexForDelete, 1);
    updatedSelectedFilesAfterDeleting.splice(fileIndexForDelete, 1);

    setSelectedFiles(updatedSelectedFilesAfterDeleting);
    setPreviews(updatedPreviewsAfterDeleting);

    document.querySelector(`[src*="${srcIdString}"]`)?.remove();
    document.querySelector(`[id*="${srcIdString}"]`)?.remove();
  };

  const submitFilesHandler = (e: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!selectedFiles.length) return;
    dispatch(adminUploadGameImagesWhenEditingGame(selectedFiles, initialGameData._id, userId));
  };

  return (
    <>
      <h2 className="title">Edit Game</h2>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {initialGameData?.imgSource?.map((imgId) => (
          <div key={imgId}>
            <button
              id={imgId}
              onClick={() => removeImgClickHandler(imgId)}
              style={{ position: "relative", bottom: "80%", left: "12%" }}
            >
              &times;
            </button>
            <Image cloudName={cloudName} publicId={imgId} width="200" />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        <h3>New images</h3>
        {previews &&
          previews.map((file: any) => {
            return (
              <div key={file.preview}>
                <button id={file.preview} onClick={() => removePreviewImgClickHandler(file.preview)}>
                  &times;
                </button>
                <img src={file.preview} style={{ width: "300px" }} />
              </div>
            );
          })}
      </div>

      <form id="image-form" onSubmit={submitFilesHandler} style={{ marginLeft: "50%" }}>
        <input
          id="input-test"
          type="file"
          multiple
          name="images"
          onChange={handleFileInputChange}
          value={fileInputState}
          disabled={!Boolean(initialGameData.gameName)}
        />
        <button type="submit" disabled={!Boolean(initialGameData.gameName)}>
          Upload new images
        </button>
      </form>

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
          imgSource: initialGameData.imgSource,
        }}
        onSubmit={(values) => {
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
                        disabled={!Boolean(initialGameData.gameName)}
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
                      <TextField
                        {...field}
                        required
                        label={input.label}
                        variant="outlined"
                        disabled={!Boolean(initialGameData.gameName)}
                      />
                    </div>
                  )}
                </Field>
              );
            })}
            <button type="submit" className="add-game-button" disabled={!Boolean(initialGameData.gameName)}>
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
  const [initialGameData, setInitialGameData] = useState(initialEmptyForm);

  const dispatch = useDispatch();
  const { allGames } = useSelector((state: RootState) => state.games);
  const { successMsg, infoMsg, errorMsg } = useSelector((state: RootState) => state.notification);
  const { allGameAuthors } = useSelector((state: RootState) => state.gameAuthor);
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

    const gameData = allGames.find((game: Game) => {
      return game._id === gameId;
    });

    allGameAuthors.forEach((author: Author) => {
      author.authorsGames.forEach((game, index: number) => {
        if (game.gameName === gameData.gameName) {
          author.authorsGames.splice(index, 1);

          if (!author.authorsGames.length) {
            dispatch(adminDeleteGameAuthor(author._id, { userId }));
          } else {
            dispatch(adminUpdateGameAuthorData(author._id, { ...author }, userId));
          }
        }
      });
    });
  };

  return (
    <>
      <FormControl>
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
