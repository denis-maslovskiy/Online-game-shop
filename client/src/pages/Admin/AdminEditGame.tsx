import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { RootState } from "../../redux/rootReducer";
import * as Yup from "yup";
import { Field, Form, Formik, FieldProps, FormikTouched, FormikErrors } from "formik";
// @ts-ignore
import { Image } from "cloudinary-react";
import { TextField, Checkbox, FormControlLabel, FormControl, FormHelperText } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ClearIcon from "@material-ui/icons/Clear";
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
import "react-datepicker/dist/react-datepicker.css";
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
  rating: number;
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
  numberOfPhysicalCopies: Yup.number().min(0),
  price: Yup.number().min(0).required("Price is required"),
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
  { label: "Author", name: "author" },
  { label: "Genre", name: "genre" },
  {
    label: "Number of physical copies",
    name: "numberOfPhysicalCopies",
  },
  { label: "Price", name: "price" },
  { label: "Discount", name: "discount" },
  { label: "Release date", name: "releaseDate" },
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
  rating: 0,
};

const RenderGameForm = ({ initialGameData, deleteGameClickHandler, allGameAuthors, userId }: IProps) => {
  const [fileInputState, setFileInputState] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
  const [previews, setPreviews] = useState<Array<object>>([]);

  const dispatch = useDispatch();
  const { cloudName } = useContext(DependenciesContext);
  const maxNumberOfImages = 6;

  useEffect(() => {
    setPreviews([]);
    setSelectedFiles([]);
  }, [initialGameData]);

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
    dispatch(adminUpdateGameData(initialGameData._id, { ...initialGameData }, userId));
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

  if (!selectedFiles.length) {
    if (document.getElementById("uploader-submit-btn")) {
      document.getElementById("uploader-submit-btn")!.style.display = "none";
    }
  } else {
    if (document.getElementById("uploader-submit-btn")) {
      document.getElementById("uploader-submit-btn")!.style.display = "block";
    }
  }

  const checksForButton = (errors: FormikErrors<any>, touched: FormikTouched<any>, values: FormValues) => {
    if (!values.isPhysical) delete errors.numberOfPhysicalCopies;
    return (
      Boolean(errors.gameName && touched.gameName) ||
      Boolean(errors.gameDescription && touched.gameDescription) ||
      Boolean(errors.author && touched.author) ||
      Boolean(errors.genre && touched.genre) ||
      Boolean(errors.numberOfPhysicalCopies && touched.numberOfPhysicalCopies) ||
      Boolean(errors.price && touched.price) ||
      Boolean(errors.isPhysical && touched.isPhysical) ||
      Boolean(errors.isDigital && touched.isDigital) ||
      Boolean(errors.discount && touched.discount) ||
      Boolean(!values.isDigital && !values.isPhysical) ||
      Boolean(checksForDiscountField(values.discount))
    );
  };

  const checkboxHelperText = (isDigital: boolean, isPhysical: boolean, fieldName: string, gameName: string) => {
    return !isDigital && !isPhysical && fieldName === "isPhysical" && Boolean(gameName);
  };

  const checksForNumberOfPhysicalCopiesField = (
    touched: FormikTouched<any>,
    numberOfPhysicalCopiesValue: number,
    isPhysical: boolean
  ) => {
    return (
      touched.numberOfPhysicalCopies &&
      isPhysical &&
      Boolean(numberOfPhysicalCopiesValue < 0 || (!numberOfPhysicalCopiesValue && numberOfPhysicalCopiesValue !== 0))
    );
  };

  const numberOfPhysicalCopiesFieldHelperText = (
    touched: FormikTouched<any>,
    numberOfPhysicalCopiesValue: number,
    isPhysical: boolean
  ) => {
    return touched.numberOfPhysicalCopies &&
      isPhysical &&
      Boolean(numberOfPhysicalCopiesValue < 0 || (!numberOfPhysicalCopiesValue && numberOfPhysicalCopiesValue !== 0))
      ? "Number Of Physical Copies is a required field and must be greater than or equal to 0"
      : "";
  };

  const checksForDiscountField = (discountValue: number) => {
    return Boolean(discountValue < 0 || (!discountValue && discountValue !== 0));
  };

  const discountFieldHelperText = (touched: FormikTouched<any>, discountValue: number) => {
    return touched.discount && Boolean(discountValue < 0 || (!discountValue && discountValue !== 0))
      ? "Discount must be greater than or equal to 0"
      : "";
  };

  return (
    <div className="admin-edit-game-container">
      <div className="admin-edit-game-container__existing-images image-preview">
        {initialGameData?.imgSource?.length ? (
          initialGameData?.imgSource?.map((imgId) => (
            <div key={imgId}>
              <button
                id={imgId}
                onClick={() => removeImgClickHandler(imgId)}
                className="image-preview__remove-image-btn"
              >
                <ClearIcon className="clear-icon" />
              </button>
              <Image cloudName={cloudName} publicId={imgId} className="image-preview__image" />
            </div>
          ))
        ) : (
          <span className="image-preview__no-pictures default-text">There are no pictures for this game.</span>
        )}
      </div>

      <div className="image-upload">
        <h3 className="titles">New images</h3>
        <form className="image-upload__form" onSubmit={submitFilesHandler}>
          <label
            htmlFor="image-upload-input"
            className="image-upload__uploader titles"
            aria-disabled={!Boolean(initialGameData.gameName)}
          >
            Click to choose images
          </label>
          <input
            id="image-upload-input"
            type="file"
            multiple
            onChange={handleFileInputChange}
            value={fileInputState}
            disabled={!Boolean(initialGameData.gameName)}
          />
          <button
            id="uploader-submit-btn"
            type="submit"
            className="image-upload__uploader titles"
            disabled={!Boolean(initialGameData.gameName) || !Boolean(selectedFiles.length)}
          >
            Upload new images
          </button>
        </form>

        <div className="image-upload__image-preview image-preview">
          {previews &&
            previews.map((file: any) => {
              return (
                <div key={file.preview}>
                  <button
                    id={file.preview}
                    className="image-preview__remove-image-btn"
                    onClick={() => removePreviewImgClickHandler(file.preview)}
                  >
                    <ClearIcon className="clear-icon" />
                  </button>
                  <img src={file.preview} className="image-preview__image" alt="Preview" />
                </div>
              );
            })}
        </div>
      </div>

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
          rating: initialGameData.rating,
        }}
        onSubmit={(values) => {
          dispatch(adminUpdateGameData(values._id, { ...values }, userId));
          updateGameInAuthorsArray(values);
          window.scrollTo(0, 0);
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <Form className="form">
            <h3 className="titles">
              <span className="static-field">Edit Info </span>
              {initialGameData.gameName ? (
                <span>
                  <span className="static-field">of </span>
                  {initialGameData.gameName}
                </span>
              ) : (
                ""
              )}
            </h3>
            {inputs.map((input) => {
              if (input.name === "isDigital" || input.name === "isPhysical") {
                return (
                  <Field key={input.name} name={input.name} label={input.label}>
                    {({ field }: FieldProps<FormValues>) => (
                      <FormControl error={!values.isDigital && !values.isPhysical}>
                        <FormControlLabel
                          // @ts-ignore
                          control={<Checkbox {...field} color="primary" checked={values[`${input.name}`]} />}
                          label={input.label}
                          disabled={!Boolean(initialGameData.gameName)}
                          className={input.name === "isDigital" ? "edit-game-digital-checkbox" : ""}
                        />
                        {checkboxHelperText(
                          values.isDigital,
                          values.isPhysical,
                          input.name,
                          initialGameData.gameName
                        ) && (
                          <FormHelperText className="edit-game-checkbox-helper-text">
                            You must choose at least one type of game
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  </Field>
                );
              }

              if (input.name === "numberOfPhysicalCopies") {
                return (
                  <Field key={input.name} name={input.name}>
                    {({ field }: FieldProps<FormValues>) => (
                      <div className="form__div">
                        <TextField
                          disabled={!values.isPhysical}
                          {...field}
                          required
                          label={input.label}
                          className="form__input"
                          variant="filled"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          error={checksForNumberOfPhysicalCopiesField(
                            touched,
                            values.numberOfPhysicalCopies,
                            values.isPhysical
                          )}
                          helperText={numberOfPhysicalCopiesFieldHelperText(
                            touched,
                            values.numberOfPhysicalCopies,
                            values.isPhysical
                          )}
                        />
                      </div>
                    )}
                  </Field>
                );
              }

              if (input.name === "gameDescription") {
                return (
                  <Field key={input.name} name={input.name}>
                    {({ field }: FieldProps<FormValues>) => (
                      <div className="form__div">
                        <TextField
                          {...field}
                          required
                          label={input.label}
                          variant="filled"
                          className="form__input"
                          multiline
                          disabled={!Boolean(initialGameData.gameName)}
                          //@ts-ignore
                          error={Boolean(errors[input.name]) && touched[input.name]}
                          //@ts-ignore
                          helperText={touched[input.name] ? errors[input.name] : ""}
                        />
                      </div>
                    )}
                  </Field>
                );
              }

              if (input.name === "discount") {
                return (
                  <Field key={input.name} name={input.name}>
                    {({ field }: FieldProps<FormValues>) => (
                      <div className="form__div">
                        <TextField
                          {...field}
                          label={input.label}
                          className="form__input"
                          variant="filled"
                          disabled={!Boolean(initialGameData.gameName)}
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          error={Boolean(checksForDiscountField(values.discount))}
                          helperText={discountFieldHelperText(touched, values.discount)}
                        />
                      </div>
                    )}
                  </Field>
                );
              }

              if (input.name === "releaseDate") {
                return (
                  <div className="form__div" key={input.name}>
                    <div className="form__datepicker">
                      <label className="default-text datepicker-label">{input.label}</label>
                      <DatePicker
                        selected={new Date(values.releaseDate || Date.now())}
                        dateFormat="MM-dd-yyyy"
                        name="releaseDate"
                        className="default-text"
                        onChange={(date) => setFieldValue("releaseDate", date)}
                        disabled={!Boolean(initialGameData.gameName)}
                      />
                    </div>
                  </div>
                );
              }
              if (input.name === "price") {
                return (
                  <Field key={input.name} name={input.name}>
                    {({ field }: FieldProps<FormValues>) => (
                      <div className="form__div">
                        <TextField
                          {...field}
                          required
                          label={input.label}
                          variant="filled"
                          className="form__input"
                          disabled={!Boolean(initialGameData.gameName)}
                          type="number"
                          InputProps={{ inputProps: { min: 0, step: "any" } }}
                          //@ts-ignore
                          error={Boolean(errors[input.name]) && touched[input.name]}
                          //@ts-ignore
                          helperText={touched[input.name] ? errors[input.name] : ""}
                        />
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
                        variant="filled"
                        className="form__input"
                        disabled={!Boolean(initialGameData.gameName)}
                        //@ts-ignore
                        error={Boolean(errors[input.name]) && touched[input.name]}
                        //@ts-ignore
                        helperText={touched[input.name] ? errors[input.name] : ""}
                      />
                    </div>
                  )}
                </Field>
              );
            })}
            <button
              type="submit"
              className="add-game-button titles"
              disabled={checksForButton(errors, touched, values)}
            >
              Save changes
            </button>
            <button
              type="button"
              className="delete-game-button titles"
              disabled={!Boolean(initialGameData.gameName)}
              onClick={() => deleteGameClickHandler(values._id)}
            >
              Delete game
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const AdminEditGame: React.FC = () => {
  const [initialGameData, setInitialGameData] = useState(initialEmptyForm);
  const [autocompleteValue, setAutocompleteValue] = useState("");

  const dispatch = useDispatch();
  const { allGames } = useSelector((state: RootState) => state.games);
  const { successMsg, infoMsg, errorMsg } = useSelector((state: RootState) => state.notification);
  const { allGameAuthors } = useSelector((state: RootState) => state.gameAuthor);
  const {
    adminOptionData: { optionData },
  } = useSelector((state: RootState) => state.user);
  const { userId } = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    dispatch(getAllGames());
    dispatch(getAllAuthors({ userId }));
  }, [dispatch, userId]);

  useEffect(() => {
    if (optionData?.gameName) {
      setInitialGameData(optionData);
      setAutocompleteValue(optionData.gameName);
    }
  }, [optionData]);

  const deleteGameClickHandler = async (gameId: string) => {
    dispatch(deleteGame(gameId, { userId }));
    setInitialGameData(initialEmptyForm);
    setAutocompleteValue("");
    window.scrollTo(0, 0);

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

  const onAutocompleteChangeHandler = (e: Event, value: FormValues) => {
    if (value) {
      setAutocompleteValue(value.gameName);
      // @ts-ignore
      setInitialGameData(value);
    }
  };

  return (
    <>
      {successMsg && <Notification values={{ successMsg }} />}
      {infoMsg && <Notification values={{ infoMsg }} />}
      {errorMsg && <Notification values={{ errorMsg }} />}
      <div className="title-and-select-container">
        <div className="container-title-block edit-game-title">
          <h2 className="container-title titles">Edit Game</h2>
        </div>
        <div className="select-game-container">
          <Autocomplete
            className="select-game-container__select-game"
            options={allGames}
            inputValue={autocompleteValue}
            onInputChange={(e, newInputValue) => {
              setAutocompleteValue(newInputValue);
            }}
            getOptionLabel={(option) => option.gameName}
            getOptionSelected={() => true}
            renderInput={(params) => (
              <TextField {...params} label="Select Game" inputProps={{ ...params.inputProps }} />
            )}
            // @ts-ignore
            onChange={onAutocompleteChangeHandler}
          />
        </div>
      </div>

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
