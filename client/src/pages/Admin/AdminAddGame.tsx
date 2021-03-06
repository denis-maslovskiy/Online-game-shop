import React, { useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { RootState } from "../../redux/rootReducer";
import { TextField, Checkbox, FormControlLabel, FormControl, FormHelperText } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { Form, Formik, FormikErrors, FormikTouched } from "formik";
import { addGame } from "../../redux/games/gamesActions";
import { errorMessage } from "../../redux/notification/notificationActions";
import Notification from "../../components/Notification";
import "react-datepicker/dist/react-datepicker.css";
import "./adminaddgame.scss";

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

interface FormValues {
  gameName: string;
  gameDescription: string;
  releaseDate: Date;
  author: string;
  genre: string;
  numberOfPhysicalCopies: number;
  price: number;
  isPhysical: boolean;
  isDigital: boolean;
  discount: number;
}

const checksForButton = (errors: FormikErrors<any>, touched: FormikTouched<any>, values: FormValues) => {
  if (!values.isPhysical) delete errors.numberOfPhysicalCopies;
  return (
    Boolean(errors.gameName && touched.gameName) ||
    Boolean(!values.gameName) ||
    Boolean(errors.gameDescription && touched.gameDescription) ||
    Boolean(!values.gameDescription) ||
    Boolean(errors.author && touched.author) ||
    Boolean(!values.author) ||
    Boolean(errors.genre && touched.genre) ||
    Boolean(!values.genre) ||
    Boolean(errors.numberOfPhysicalCopies && touched.numberOfPhysicalCopies) ||
    Boolean(errors.price && touched.price) ||
    Boolean(errors.isPhysical && touched.isPhysical) ||
    Boolean(errors.isDigital && touched.isDigital) ||
    Boolean(errors.discount && touched.discount) ||
    Boolean(!values.isDigital && !values.isPhysical) ||
    Boolean(checksForDiscountField(values.discount))
  );
};

const checksForDefaultFields = (errors: FormikErrors<any>, touched: FormikTouched<any>, fieldName: string) => {
  return Boolean(errors[fieldName]) && touched[fieldName];
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

const initialValues = {
  gameName: "",
  gameDescription: "",
  releaseDate: new Date(),
  author: "",
  genre: "",
  numberOfPhysicalCopies: 0,
  price: 0,
  isPhysical: false,
  isDigital: true,
  discount: 0,
};

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
      <div className="admin-add-game-container">
        <div className="container-title-block add-game-title">
          <h2 className="container-title titles">Add new game</h2>
        </div>

        <div className="admin-add-game-container__image-upload image-upload">
          <form className="image-upload__form add-game-upload-form">
            <label htmlFor="image-upload-input" className="image-upload__uploader titles">
              Click to upload images
            </label>
            <input
              id="image-upload-input"
              type="file"
              multiple
              onChange={handleFileInputChange}
              value={fileInputState}
            />
          </form>

          <div className="image-upload__image-preview image-preview">
            {previews &&
              previews.map((file: any) => {
                return (
                  <div key={file.preview}>
                    <button
                      className="image-preview__remove-image-btn titles"
                      id={file.preview}
                      onClick={() => removeImgClickHandler(file.preview)}
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
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            dispatch(addGame({ ...values }, selectedFiles, userId, resetForm));
            setPreviews([]);
            window.scrollTo(0, 0);
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
        >
          {({ errors, touched, handleChange, handleBlur, values, setFieldValue }) => (
            <Form className="form">
              <FormControl error={!values.isDigital && !values.isPhysical} className="form__checkboxes checkboxes">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isPhysical"
                      color="primary"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.isPhysical || false}
                    />
                  }
                  label="Physical"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isDigital"
                      color="primary"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.isDigital || false}
                    />
                  }
                  label="Digital"
                />
                {!values.isDigital && !values.isPhysical && (
                  <FormHelperText className="checkboxes__helper-text">
                    You must choose at least one type of game
                  </FormHelperText>
                )}
              </FormControl>
              {inputs.map((input) => {
                if (input.name === "gameDescription") {
                  return (
                    <div className="form__div" key={input.name}>
                      <TextField
                        autoComplete="off"
                        className="form__input"
                        required
                        label={input.label}
                        variant="filled"
                        multiline
                        value={values.gameDescription || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={input.name}
                        error={Boolean(checksForDefaultFields(errors, touched, input.name))}
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
                        autoComplete="off"
                        className="form__input"
                        required={values.isPhysical}
                        label={input.label}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={input.name}
                        type="number"
                        value={values.numberOfPhysicalCopies || 0}
                        InputProps={{ inputProps: { min: 0 } }}
                        error={Boolean(
                          checksForNumberOfPhysicalCopiesField(
                            touched,
                            values.numberOfPhysicalCopies,
                            values.isPhysical
                          )
                        )}
                        helperText={numberOfPhysicalCopiesFieldHelperText(
                          touched,
                          values.numberOfPhysicalCopies,
                          values.isPhysical
                        )}
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
                        autoComplete="off"
                        label={input.label}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={input.name}
                        type="number"
                        value={values.price || 0}
                        InputProps={{ inputProps: { min: 0, step: "any" } }}
                        error={Boolean(checksForDefaultFields(errors, touched, input.name))}
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
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={input.name}
                        type="number"
                        value={values.discount || 0}
                        InputProps={{ inputProps: { min: 0 } }}
                        error={Boolean(checksForDiscountField(values.discount))}
                        helperText={discountFieldHelperText(touched, values.discount)}
                      />
                    </div>
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
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="form__div" key={input.name}>
                    <TextField
                      className="form__input"
                      required
                      autoComplete="off"
                      label={input.label}
                      variant="filled"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name={input.name}
                      //@ts-ignore
                      value={values[input.name] || ""}
                      //@ts-ignore
                      error={Boolean(checksForDefaultFields(errors, touched, input.name))}
                      //@ts-ignore
                      helperText={touched[input.name] ? errors[input.name] : ""}
                    />
                  </div>
                );
              })}
              <button
                type="submit"
                id="form-submit"
                className="add-game-button titles"
                disabled={checksForButton(errors, touched, values)}
              >
                Add game
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AdminAddGame;
