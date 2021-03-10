// TODO: Не работает отчистка формы
// TODO: Сделать кнопку недоступной до тех пор, пока все поля не буду заполнены
// TODO: Игра добавляется, если чекбоксы isPhysical/isDigital оба пустые

import React, { useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Form, Formik, FormikErrors, FormikTouched } from "formik";
import { addGame } from "../../redux/games/gamesActions";
import { errorMessage } from "../../redux/notification/notificationActions";
import Notification from "../../components/Notification";
import "./adminaddgame.scss";
import { FormControl, FormHelperText } from "@material-ui/core";

const validationSchema = Yup.object().shape({
  gameName: Yup.string().required("Game name is a required field"),
  gameDescription: Yup.string().required("Game description is a required field"),
  releaseDate: Yup.string().required("Release date is a required field"),
  author: Yup.string().required("Author is a required field"),
  genre: Yup.string().required("Genre is a required field"),
  price: Yup.number().min(0).required("Price is a required field"),
  numberOfPhysicalCopies: Yup.number().min(0),
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
    Boolean(errors.gameName && touched.gameName) ||
    Boolean(errors.gameDescription && touched.gameDescription) ||
    Boolean(errors.releaseDate && touched.releaseDate) ||
    Boolean(errors.author && touched.author) ||
    Boolean(errors.genre && touched.genre) ||
    Boolean(errors.numberOfPhysicalCopies && touched.numberOfPhysicalCopies) ||
    Boolean(errors.price && touched.price) ||
    Boolean(errors.isPhysical && touched.isPhysical) ||
    Boolean(errors.isDigital && touched.isDigital) ||
    Boolean(errors.discount && touched.discount)
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
  isDigital: true,
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

const AdminAddGame: React.FC = () => {
  const [fileInputState, setFileInputState] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
  const [previews, setPreviews] = useState<Array<object>>([]);
  const maxNumberOfImages = 6;

  const dispatch = useDispatch();

  const { successMsg, errorMsg } = useSelector((state: RootState) => state.notification);

  const { userId } = JSON.parse(localStorage.getItem("userData")!);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target!.files;
      if (files!.length > maxNumberOfImages) {
        setPreviews([]);
        setFileInputState("");
        throw new RangeError(`The maximum number of images is ${maxNumberOfImages}`);
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

  const removeImgClickHandler = (srcIdString: string) => {
    let fileIndexForDelete = maxNumberOfImages + 1;
    previews.forEach((item: any, index) => {
      if (item.preview === srcIdString) fileIndexForDelete = index;
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

  return (
    <>
      {successMsg && <Notification values={{ successMsg }} />}
      {errorMsg && <Notification values={{ errorMsg }} />}
      <h2 className="title">Add new game</h2>

      <form style={{ marginLeft: "50%" }}>
        <input type="file" multiple onChange={handleFileInputChange} value={fileInputState} />
      </form>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {previews &&
          previews.map((file: any) => {
            return (
              <div key={file.preview}>
                <button id={file.preview} onClick={() => removeImgClickHandler(file.preview)}>
                  &times;
                </button>
                <img src={file.preview} alt="Preview" style={{ width: "300px" }} />
              </div>
            );
          })}
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          dispatch(addGame({ ...values }, selectedFiles, userId));
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
          <Form className="form">
            <div className="form__checkboxes">
              <FormControl error={!values.isDigital && !values.isPhysical}>
                <FormControlLabel
                  control={<Checkbox name="isPhysical" color="primary" onChange={handleChange} onBlur={handleBlur} />}
                  label="Physical"
                />
                <FormControlLabel
                  control={<Checkbox name="isDigital" color="primary" onChange={handleChange} onBlur={handleBlur} defaultChecked />}
                  label="Digital"
                />
                {!values.isDigital && !values.isPhysical && <FormHelperText>You must choose at least one type of game</FormHelperText>}
              </FormControl>
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
                      error={Boolean(errors[input.name]) && touched[input.name]}
                      helperText={touched[input.name] ? errors[input.name] : ""}
                    />
                  </div>
                );
              }
              if (input.name === "numberOfPhysicalCopies") {
                return (
                  <div className="form__div" key={input.name}>
                    <TextField
                      disabled={!values.isPhysical}
                      className="form__input"
                      required={values.isPhysical}
                      label={input.label}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name={input.name}
                      defaultValue={0}
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      error={
                        touched[input.name] &&
                        values.isPhysical &&
                        Boolean(
                          values.numberOfPhysicalCopies < 0 ||
                            (!values.numberOfPhysicalCopies && values.numberOfPhysicalCopies !== 0)
                        )
                      }
                      helperText={
                        touched[input.name] &&
                        values.isPhysical &&
                        Boolean(
                          values.numberOfPhysicalCopies < 0 ||
                            (!values.numberOfPhysicalCopies && values.numberOfPhysicalCopies !== 0)
                        )
                          ? "Number Of Physical Copies is a required field and must be greater than or equal to 0"
                          : ""
                      }
                    />
                  </div>
                );
              }
              if (input.name === "price") {
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
                      defaultValue={0}
                      InputProps={{ inputProps: { min: 0 } }}
                      error={Boolean(errors[input.name]) && touched[input.name]}
                      helperText={touched[input.name] ? errors[input.name] : ""}
                    />
                  </div>
                );
              }
              if (input.name === "discount") {
                return (
                  <div className="form__div" key={input.name}>
                    <TextField
                      className="form__input"
                      label={input.label}
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name={input.name}
                      type="number"
                      defaultValue={0}
                      InputProps={{ inputProps: { min: 0 } }}
                      error={Boolean(values.discount < 0 || (!values.discount && values.discount !== 0))}
                      helperText={
                        touched[input.name] &&
                        Boolean(values.discount < 0 || (!values.discount && values.discount !== 0))
                          ? "Discount must be greater than or equal to 0"
                          : ""
                      }
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
                    //@ts-ignore
                    error={Boolean(errors[input.name]) && touched[input.name]}
                    //@ts-ignore
                    helperText={touched[input.name] ? errors[input.name] : ""}
                  />
                </div>
              );
            })}
            <button
              type="submit"
              id="form-submit"
              className="add-game-button"
              disabled={checksForButton(isSubmitting, errors, touched)}
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
