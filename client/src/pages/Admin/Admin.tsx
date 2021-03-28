import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SwipeableDrawer, Button, List, ListItem, ListItemText } from "@material-ui/core";
import { RootState } from "../../redux/rootReducer";
import { clearOptionForAdmin } from "../../redux/user/userActions";
import AdminAddGame from "./AdminAddGame";
import AdminEditGame from "./AdminEditGame";
import AdminStatistic from "./AdminStatistic";
import AdminEditGameAuthor from "./AdminEditGameAuthor";
import AdminPlanningFutureDiscounts from "./AdminPlanningFutureDiscounts";
import "./admin.scss";

type Anchor = "left";

const Admin = () => {
  const [state, setState] = useState({
    left: false,
  });
  const [adminOption, setAdminOption] = useState("Statistic");

  const dispatch = useDispatch();
  const {
    adminOptionData: { optionName },
  } = useSelector((state: RootState) => state.user);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  function listItemClickHandler(text: string) {
    dispatch(clearOptionForAdmin());
    setAdminOption(text);
  }

  const adminOptions = ["Statistic", "Add new game", "Edit game", "Edit game author", "Planning future discounts"];

  const list = (anchor: Anchor) => (
    <div role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        {adminOptions.map((text) => (
          <ListItem button key={text} onClick={() => listItemClickHandler(text)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderAdminOption = (option: string) => {
    switch (option) {
      case "Add new game":
        return <AdminAddGame />;
      case "Edit game":
        return <AdminEditGame />;
      case "Statistic":
        return <AdminStatistic />;
      case "Edit game author":
        return <AdminEditGameAuthor />;
      case "Planning future discounts":
        return <AdminPlanningFutureDiscounts />;
      default:
        return <AdminStatistic />;
    }
  };

  return (
    <>
      <div className="admin-select-option">
        {(["left"] as Anchor[]).map((anchor) => (
          <React.Fragment key={anchor}>
            <Button id="button" onClick={toggleDrawer(anchor, true)}>
              <span className="admin-select-option__text default-text">Click to choose admin option</span>
            </Button>
            <SwipeableDrawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              {list(anchor)}
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
      {optionName ? renderAdminOption(optionName) : renderAdminOption(adminOption)}
    </>
  );
};

export default Admin;
