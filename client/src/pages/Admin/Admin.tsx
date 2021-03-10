import React, { useState } from "react";
import { SwipeableDrawer, Button, List, ListItem, ListItemText } from "@material-ui/core";
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

  const adminOptions = ["Statistic", "Add new game", "Edit game", "Edit game author", "Planning future discounts"];

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
      <div className="admin-select-option">
        {(["left"] as Anchor[]).map((anchor) => (
          <React.Fragment key={anchor}>
            <Button id="button" onClick={toggleDrawer(anchor, true)}>
              <span className="admin-select-option__text">Click to choose admin option</span>
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
      {adminOption === "Planning future discounts" && <AdminPlanningFutureDiscounts />}
    </>
  );
};

export default Admin;
