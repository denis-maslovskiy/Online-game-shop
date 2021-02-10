import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { RootState } from "../../redux/rootReducer";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import { Field, Form, Formik, FieldProps, FormikErrors, FormikTouched } from "formik";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { getAllAuthors, adminUpdateGameAuthorData } from "../../redux/gameAuthor/gameAuthorActions";
import Notification from "../../components/Notification";

interface FormValues {
  authorName: string;
  authorDescription: string;
  authorsGames: Array<Game>;
  yearOfFoundationOfTheCompany: Date;
  _id: string;
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
  _id: string;
}

const validationSchema = Yup.object().shape({
  authorDescription: Yup.string().required("Author description is required"),
  yearOfFoundationOfTheCompany: Yup.date().required("Year of foundation of the company is required"),
});

const checksForButton = (isSubmitting: boolean, errors: FormikErrors<any>, touched: FormikTouched<any>) => {
  return (
    isSubmitting ||
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
  _id: "",
};

const RenderGameForm = ({ initialGameAuthorData }: IProps) => {
  const dispatch = useDispatch();

  return (
    <>
      <h2>Edit Game Author</h2>
      <Formik
        initialValues={{
          authorDescription: initialGameAuthorData.authorDescription,
          yearOfFoundationOfTheCompany: initialGameAuthorData.yearOfFoundationOfTheCompany,
          authorName: initialGameAuthorData.authorName,
          authorsGames: initialGameAuthorData.authorsGames,
          _id: initialGameAuthorData._id,
        }}
        onSubmit={(values) => {
          const { userId } = JSON.parse(localStorage.getItem("userData")!);
          console.log(values, values.yearOfFoundationOfTheCompany);
          dispatch(adminUpdateGameAuthorData(values._id, { ...values, userId }));
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            {inputs.map((input) => {
              if (input.name === "authorDescription") {
                return (
                  <Field key={input.name} name={input.name}>
                    {({ field }: FieldProps<FormValues>) => (
                      <div>
                        <TextField {...field} required multiline label={input.label} variant="outlined" />
                      </div>
                    )}
                  </Field>
                );
              }
              if (input.name === "yearOfFoundationOfTheCompany") {
                return (
                  <div key={input.name}>
                    <DatePicker
                      selected={new Date(values.yearOfFoundationOfTheCompany)}
                      dateFormat="MM-dd-yyyy"
                      name="yearOfFoundationOfTheCompany"
                      onChange={(date) => setFieldValue("yearOfFoundationOfTheCompany", date)}
                    />
                  </div>
                );
              }
            })}
            <button type="submit" disabled={checksForButton(isSubmitting, errors, touched)}>
              Save changes
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

const AdminEditGameAuthor: React.FC = () => {
  const dispatch = useDispatch();
  const { successMsg, infoMsg, errorMsg } = useSelector((state: RootState) => state.notification);
  const { allGameAuthors } = useSelector((state: RootState) => state.gameAuthor);
  const [initialGameAuthorData, setInitialGameAuthorData] = useState(initialEmptyForm);

  useEffect(() => {
    dispatch(getAllAuthors());
  }, []);

  const selectHandleChange = (event: React.FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    const authorId = event.target.value;
    const gameAuthorData = allGameAuthors.find((author: Author) => {
      return author._id === authorId;
    });

    setInitialGameAuthorData(gameAuthorData);
  };

  return (
    <>
      <FormControl>
        <InputLabel>Select game author</InputLabel>
        {/* @ts-ignore */}
        <Select value={initialGameAuthorData?._id} onChange={selectHandleChange}>
          {allGameAuthors.map((author: Author) => {
            return (
              <MenuItem value={author._id} key={author._id}>
                {author.authorName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {successMsg && <Notification values={{ successMsg }} />}
      {infoMsg && <Notification values={{ infoMsg }} />}
      {errorMsg && <Notification values={{ errorMsg }} />}
      {initialGameAuthorData && <RenderGameForm initialGameAuthorData={initialGameAuthorData} />}
    </>
  );
};

export default AdminEditGameAuthor;
