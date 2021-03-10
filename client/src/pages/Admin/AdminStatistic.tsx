import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell } from "recharts";
import { RootState } from "../../redux/rootReducer";
import { getAllUsers } from "../../redux/user/userActions";
import { getAllAchievements } from "../../redux/achievement/achievementActions";
import "./admin-statistic.scss";

interface User {
  dateOfRegistration: Date;
  email: string;
  gamesInTheBasket: Array<PurchasedGame>;
  isAdmin: boolean;
  password: string;
  personalDiscount: number;
  purchasedGames: Array<PurchasedGame>;
  username: string;
  __v: number;
  _id: string;
}

interface PurchasedGame {
  dateAddedToBasket: Date;
  gameId: string;
  gameName: string;
  gameType: string;
  price: number;
}

interface RenderCustomizedLabel {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  payload: {
    name: string;
  };
}

interface Achieve {
  achievementTopic: string;
  achievementName: string;
  achievementText: string;
  achievementValue: number;
  estimatedDiscountForTheClient: number;
}

const AdminStatistic: React.FC = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state: RootState) => state.user);
  const { allAchievements } = useSelector((state: RootState) => state.achievement);
  const { userId } = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    dispatch(getAllUsers({ userId }));
    dispatch(getAllAchievements());
  }, [dispatch, userId]);

  let gamesBoughtFor = 0,
    usersPerMonth = 0,
    usersForTheLastMonth = 0,
    numberOfGamePurchased = 0,
    numberOfPurchasedPhysicalCopiesOfTheGame = 0,
    numberOfPurchasedDigitalCopiesOfTheGame = 0;
  const howManyAndWhatGamesWerePurchased = {};

  allUsers.forEach((user: User) => {
    if (user?.purchasedGames.length) numberOfGamePurchased += user.purchasedGames.length;
    user?.purchasedGames.forEach((game: PurchasedGame) => {
      gamesBoughtFor += +game.price;
      // @ts-ignore
      howManyAndWhatGamesWerePurchased[game.gameName]
        ? // @ts-ignore
          howManyAndWhatGamesWerePurchased[game.gameName]++
        : // @ts-ignore
          (howManyAndWhatGamesWerePurchased[game.gameName] = 1);
      game.gameType === "Physical"
        ? numberOfPurchasedPhysicalCopiesOfTheGame++
        : numberOfPurchasedDigitalCopiesOfTheGame++;
    });
    if (new Date(user.dateOfRegistration).getMonth() === new Date().getMonth()) {
      usersPerMonth++;
    }
    if (
      (new Date().getMonth() === 0 && 11 === new Date(user.dateOfRegistration).getMonth()) ||
      new Date().getMonth() - 1 === new Date(user.dateOfRegistration).getMonth()
    ) {
      usersForTheLastMonth++;
    }
  });

  const PhysicalDigitalChartData = [
    { name: "Physical", value: numberOfPurchasedPhysicalCopiesOfTheGame },
    { name: "Digital", value: numberOfPurchasedDigitalCopiesOfTheGame },
  ];
  const PhysicalDigitalChartColors: Array<string> = [];
  const HowManyAndWhatGamesWerePurchasedChartData = [];
  const HowManyAndWhatGamesWerePurchasedChartColors: Array<string> = [];

  const defaultChartSettings = {
    width: 500,
    height: 300,
    cx: 200,
    cy: 150,
  };
  const [chartSettings, setChartSettings] = useState(defaultChartSettings);

  useEffect(() => {
    // This solution is too hackish,
    // but this is the only way to set the correct resolution for the charts
    // and avoid any errors/rerenders
    if (window.innerWidth <= 590) {
      setTimeout(() => {
        setChartSettings({ width: 290, height: 200, cx: 200, cy: 125 });
        document.querySelectorAll("svg.recharts-surface").forEach((chart) => {
          chart.setAttribute("viewBox", "0 0 500 300");
        });
      }, 0);
    }
  }, []);

  window.onresize = function () {
    if (window.innerWidth <= 590) {
      setChartSettings({ width: 290, height: 200, cx: 200, cy: 125 });
      document.querySelectorAll("svg.recharts-surface").forEach((chart) => {
        chart.setAttribute("viewBox", "0 0 500 300");
      });
    } else {
      setChartSettings(defaultChartSettings);
    }
  };

  for (let key in howManyAndWhatGamesWerePurchased) {
    // @ts-ignore
    HowManyAndWhatGamesWerePurchasedChartData.push({ name: key, value: howManyAndWhatGamesWerePurchased[key] });
    HowManyAndWhatGamesWerePurchasedChartColors.push(
      "#" + (Math.random().toString(16) + "000000").substring(2, 8).toUpperCase()
    );
  }

  for (let i = 0; i < 2; i++) {
    PhysicalDigitalChartColors.push("#" + (Math.random().toString(16) + "000000").substring(2, 8).toUpperCase());
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    payload,
  }: RenderCustomizedLabel) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`} ({payload.name})
      </text>
    );
  };

  const ArrayOfAllAvailableAchievements: Array<string> = [];
  let firstAchievementsColumnLength = 0;

  if (allAchievements.length) {
    allAchievements.forEach((achieve: Achieve) => {
      ArrayOfAllAvailableAchievements.push(achieve.achievementText);
    });

    firstAchievementsColumnLength = Math.ceil(ArrayOfAllAvailableAchievements.length / 2);
  }

  return (
    <div className="admin-statistic-container">
      <div className="container-title-block statistic">
        <h2 className="container-title">Statistic</h2>
      </div>
      <div className="admin-statistic-container__admin-statistic-content admin-statistic-content">
        <div className="admin-statistic-content__statistic">
          <p>
            Total users: <span>{allUsers.length}</span>
          </p>
          <p>
            Number of games purchased: <span>{numberOfGamePurchased}</span>
          </p>
          <p>
            Games bought for <span>{gamesBoughtFor.toFixed(2)} $</span>
          </p>
          <p>
            Users per month: <span>{usersPerMonth}</span>
          </p>
          <p>
            Users for the last month: <span>{usersForTheLastMonth}</span>
          </p>
          <p>
            Number of purchased physical copies of the game: <span>{numberOfPurchasedPhysicalCopiesOfTheGame}</span>
          </p>
          <p>
            Number of purchased digital copies of the game: <span>{numberOfPurchasedDigitalCopiesOfTheGame}</span>
          </p>
        </div>
        <div className="admin-statistic-content__charts">
          <PieChart width={chartSettings.width} height={chartSettings.height}>
            <Pie
              data={PhysicalDigitalChartData}
              cx={chartSettings.cx}
              cy={chartSettings.cy}
              // @ts-ignore
              label={renderCustomizedLabel}
              outerRadius={80}
              dataKey="value"
            >
              {PhysicalDigitalChartData.map((entry, index) => (
                <Cell
                  key={PhysicalDigitalChartColors[index] || 0}
                  fill={PhysicalDigitalChartColors[index % PhysicalDigitalChartColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
          <PieChart width={chartSettings.width} height={chartSettings.height}>
            <Pie
              data={HowManyAndWhatGamesWerePurchasedChartData}
              cx={chartSettings.cx}
              cy={chartSettings.cy}
              // @ts-ignore
              label={renderCustomizedLabel}
              outerRadius={80}
              dataKey="value"
            >
              {HowManyAndWhatGamesWerePurchasedChartData.map((entry, index) => (
                <Cell
                  key={HowManyAndWhatGamesWerePurchasedChartColors[index]}
                  fill={
                    HowManyAndWhatGamesWerePurchasedChartColors[
                      index % HowManyAndWhatGamesWerePurchasedChartColors.length
                    ]
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="admin-statistic-content__statistic-achievements statistic-achievements">
          <h3 className="static-field">List of all available achievements</h3>

          <div className="statistic-achievements__container">
            <div>
              {ArrayOfAllAvailableAchievements.map((item, index) => {
                if (index < firstAchievementsColumnLength) {
                  return <p key={item}>{item}</p>;
                }
              })}
            </div>
            <div>
              {ArrayOfAllAvailableAchievements.map((item, index) => {
                if (index >= firstAchievementsColumnLength) {
                  return <p key={item}>{item}</p>;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistic;
