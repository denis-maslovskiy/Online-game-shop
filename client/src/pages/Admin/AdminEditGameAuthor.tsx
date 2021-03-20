import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { RootState } from "../../redux/rootReducer";
import * as Yup from "yup";
import { Field, Form, Formik, FieldProps, FormikErrors, FormikTouched } from "formik";
// @ts-ignore
import { Image } from "cloudinary-react";
import { TextField, InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { getAllAuthors, adminUpdateGameAuthorData } from "../../redux/gameAuthor/gameAuthorActions";
import { DependenciesContext } from "../../context/DependenciesContext";
import Notification from "../../components/Notification";
import "react-datepicker/dist/react-datepicker.css";

interface FormValues {
  authorName: string;
  authorDescription: string;
  authorsGames: Array<Game>;
  yearOfFoundationOfTheCompany: Date;
  _id: string;
  authorLogo: string;
}

interface IProps {
  initialGameAuthorData: FormValues;
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
  authorLogo: string;
  _id: string;
}

const validationSchema = Yup.object().shape({
  authorDescription: Yup.string().required("Author description is required"),
  yearOfFoundationOfTheCompany: Yup.date().required("Year of foundation of the company is required"),
});

const checksForButton = (errors: FormikErrors<any>, touched: FormikTouched<any>) => {
  return (
    Boolean(errors.authorDescription && touched.authorDescription) ||
    Boolean(errors.yearOfFoundationOfTheCompany && touched.yearOfFoundationOfTheCompany)
  );
};

const inputs = [
  { label: "Author description", name: "authorDescription" },
  { label: "Year of foundation of the company", name: "yearOfFoundationOfTheCompany" },
];

const initialEmptyForm = {
  authorName: "",
  authorDescription: "",
  authorsGames: [],
  yearOfFoundationOfTheCompany: new Date(),
  authorLogo: "",
  _id: "",
};

const RenderGameForm = ({ initialGameAuthorData }: IProps) => {
  const [fileInputState, setFileInputState] = useState("");
  const [selectedFile, setSelectedFile] = useState<Blob>();
  const [previewSource, setPreviewSource] = useState<string | ArrayBuffer | null>("");

  const dispatch = useDispatch();
  const { cloudName } = useContext(DependenciesContext);
  const { userId } = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    setPreviewSource("");
    setFileInputState("");
    setSelectedFile(undefined);
  }, [initialGameAuthorData]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target!.files![0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const removeImgClickHandler = (imgId: string) => {
    initialGameAuthorData.authorLogo = "";
    document.querySelector(`[src*="${imgId}"]`)?.remove();
    document.querySelector(`[id*="${imgId}"]`)?.remove();
    dispatch(adminUpdateGameAuthorData(initialGameAuthorData._id, { ...initialGameAuthorData }, userId));
  };

  return (
    <div className="admin-edit-game-author-container">
      <div className="image-upload">
        <form className="image-upload__form">
          <label
            htmlFor="image-upload-input"
            className="image-upload__uploader"
            aria-disabled={!Boolean(initialGameAuthorData.authorName)}
          >
            Click to upload logo
          </label>

          <input
            id="image-upload-input"
            type="file"
            onChange={handleFileInputChange}
            value={fileInputState}
            disabled={!Boolean(initialGameAuthorData.authorName)}
          />
        </form>
        <div className="image-upload__image-preview image-preview">
          {previewSource ? (
            // @ts-ignore
            <img src={previewSource} alt="Chosen" className="image-preview__image" />
          ) : initialGameAuthorData.authorLogo ? (
            <div>
              <button
                id={initialGameAuthorData.authorLogo}
                onClick={() => removeImgClickHandler(initialGameAuthorData.authorLogo)}
                className="image-preview__remove-image-btn"
              >
                <ClearIcon />
              </button>
              <Image
                cloudName={cloudName}
                publicId={initialGameAuthorData.authorLogo}
                className="image-preview__image"
                alt="Author's Logo"
              />
            </div>
          ) : (
            <span className="image-preview__no-pictures default-text">There are no logo for this author.</span>
          )}
        </div>
      </div>

      <Formik
        initialValues={{
          authorDescription: initialGameAuthorData.authorDescription,
          yearOfFoundationOfTheCompany: initialGameAuthorData.yearOfFoundationOfTheCompany,
          authorName: initialGameAuthorData.authorName,
          authorsGames: initialGameAuthorData.authorsGames,
          authorLogo: initialGameAuthorData.authorLogo,
          _id: initialGameAuthorData._id,
        }}
        onSubmit={(values) => {
          dispatch(adminUpdateGameAuthorData(values._id, { ...values }, userId, selectedFile, true));
          window.scrollTo(0, 0);
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="form">
            <h3 className="titles">Edit Game Author Info</h3>
            {inputs.map((input) => {
              if (input.name === "authorDescription") {
                return (
                  <Field key={input.name} name={input.name}>
                    {({ field }: FieldProps<FormValues>) => (
                      <div className="form__div">
                        <TextField
                          {...field}
                          required
                          multiline
                          label={input.label}
                          //@ts-ignore
                          error={Boolean(errors[input.name]) && touched[input.name]}
                          //@ts-ignore
                          helperText={touched[input.name] ? errors[input.name] : ""}
                          variant="filled"
                          disabled={!Boolean(initialGameAuthorData.authorName)}
                          className="form__input"
                        />
                      </div>
                    )}
                  </Field>
                );
              }
              if (input.name === "yearOfFoundationOfTheCompany") {
                return (
                  <div className="form__div" key={input.name}>
                    <div className="form__datepicker">
                      <label className="default-text datepicker-label">{input.label}</label>
                      <DatePicker
                        selected={new Date(values.yearOfFoundationOfTheCompany)}
                        className="default-text"
                        dateFormat="MM-dd-yyyy"
                        name="yearOfFoundationOfTheCompany"
                        onChange={(date) => setFieldValue("yearOfFoundationOfTheCompany", date)}
                        disabled={!Boolean(initialGameAuthorData.authorName)}
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })}
            <button className="add-game-button titles" type="submit" disabled={checksForButton(errors, touched)}>
              Save changes
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const AdminEditGameAuthor: React.FC = () => {
  const [initialGameAuthorData, setInitialGameAuthorData] = useState(initialEmptyForm);

  const dispatch = useDispatch();
  const { successMsg, infoMsg, errorMsg } = useSelector((state: RootState) => state.notification);
  const { allGameAuthors } = useSelector((state: RootState) => state.gameAuthor);

  useEffect(() => {
    dispatch(getAllAuthors());
  }, [dispatch]);

  const selectHandleChange = (e: { target: HTMLInputElement }) => {
    const authorId = e.target.value;
    const gameAuthorData = allGameAuthors.find((author: Author) => {
      return author._id === authorId;
    });
    setInitialGameAuthorData(gameAuthorData);
  };

  return (
    <>
      {successMsg && <Notification values={{ successMsg }} />}
      {infoMsg && <Notification values={{ infoMsg }} />}
      {errorMsg && <Notification values={{ errorMsg }} />}
      <div className="edit-game-author-container">
        <div className="container-title-block edit-game-author-title">
          <h2 className="container-title titles">Edit Game Author</h2>
        </div>
        <div className="select-game-author-container">
          <FormControl className="select-game-author-container__select-game-author select-game-author">
            <InputLabel className="select-game-author__label">Select game author</InputLabel>
            <Select
              value={initialGameAuthorData?._id}
              // @ts-ignore
              onChange={selectHandleChange}
              className="select-game-author__select"
            >
              {allGameAuthors.map((author: Author) => {
                return (
                  <MenuItem value={author._id} key={author._id}>
                    {author.authorName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        {initialGameAuthorData && <RenderGameForm initialGameAuthorData={initialGameAuthorData} />}
      </div>
    </>
  );
};

export default AdminEditGameAuthor;
