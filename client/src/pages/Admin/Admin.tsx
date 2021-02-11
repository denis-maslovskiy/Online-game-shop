import React, { useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AdminAddGame from "./AdminAddGame";
import AdminEditGame from "./AdminEditGame";
import AdminStatistic from "./AdminStatistic";
import AdminEditGameAuthor from "./AdminEditGameAuthor";
import AdminAddAchievement from "./AdminAddAchievement";
import AdminEditAchievement from "./AdminEditAchievement";
import AdminPlanningFutureDiscounts from './AdminPlanningFutureDiscounts';
import "./admin.scss";

type Anchor = "left";

const Admin = () => {
  const [state, setState] = useState({
    left: false,
  });
  const [adminOption, setAdminOption] = useState("Statistic");

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

  function clickHandler(text: string) {
    setAdminOption(text);
  }

  const adminOptions = [
    "Statistic",
    "Add new game",
    "Edit game",
    "Add new achievement",
    "Edit achievement",
    "Edit game author",
    "Planning future discounts"
  ];

  const list = (anchor: Anchor) => (
    <div role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        {adminOptions.map((text) => (
          <ListItem button key={text} onClick={() => clickHandler(text)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <div>
        {(["left"] as Anchor[]).map((anchor) => (
          <React.Fragment key={anchor}>
            <Button id="button" onClick={toggleDrawer(anchor, true)}>
              Click to choose admin option
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
      {adminOption === "Add new game" && <AdminAddGame />}
      {adminOption === "Edit game" && <AdminEditGame />}
      {adminOption === "Statistic" && <AdminStatistic />}
      {adminOption === "Edit game author" && <AdminEditGameAuthor />}
      {adminOption === "Add new achievement" && <AdminAddAchievement />}
      {adminOption === "Edit achievement" && <AdminEditAchievement />}
      {adminOption === "Planning future discounts" && <AdminPlanningFutureDiscounts />}
    </>
  );
};

export default Admin;
