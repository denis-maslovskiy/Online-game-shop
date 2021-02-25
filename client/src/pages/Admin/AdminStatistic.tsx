import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell } from "recharts";
import { RootState } from "../../redux/rootReducer";
import { getAllUsers } from "../../redux/user/userActions";
import { getAllAchievements } from "../../redux/achievement/achievementActions";

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
  }, []);

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
  const PhysicalDigitalChartColors: Array<string> = ["#0088FE", "#00C49F"];
  const HowManyAndWhatGamesWerePurchasedChartData = [];
  const HowManyAndWhatGamesWerePurchasedChartColors: Array<string> = [];

  for (let key in howManyAndWhatGamesWerePurchased) {
    // @ts-ignore
    HowManyAndWhatGamesWerePurchasedChartData.push({ name: key, value: howManyAndWhatGamesWerePurchased[key] });
    HowManyAndWhatGamesWerePurchasedChartColors.push(
      "#" + (Math.random().toString(16) + "000000").substring(2, 8).toUpperCase()
    );
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

  if (allAchievements.length) {
    allAchievements.forEach((achieve: Achieve) => {
      ArrayOfAllAvailableAchievements.push(achieve.achievementText);
    });
  }

  return (
    <div>
      <h2>Statistic</h2>
      <div>
        <p>Total users: {allUsers.length}</p>
        <p>Number of games purchased: {numberOfGamePurchased}</p>
        <p>Games bought for {gamesBoughtFor.toFixed(2)} $</p>
        <p>Users per month: {usersPerMonth}</p>
        <p>Users for the last month: {usersForTheLastMonth}</p>
        <p>Number of purchased physical copies of the game: {numberOfPurchasedPhysicalCopiesOfTheGame}</p>
        <p>Number of purchased digital copies of the game: {numberOfPurchasedDigitalCopiesOfTheGame}</p>
        <PieChart width={800} height={400}>
          <Pie
            data={PhysicalDigitalChartData}
            cx={300}
            cy={200}
            // @ts-ignore
            label={renderCustomizedLabel}
            outerRadius={80}
            dataKey="value"
          >
            {PhysicalDigitalChartData.map((entry, index) => (
              <Cell
                key={PhysicalDigitalChartColors[index]}
                fill={PhysicalDigitalChartColors[index % PhysicalDigitalChartColors.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <PieChart width={800} height={400}>
          <Pie
            data={HowManyAndWhatGamesWerePurchasedChartData}
            cx={300}
            cy={200}
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
      <div>
        <h3>List of all available achievements</h3>
        {ArrayOfAllAvailableAchievements.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
};

export default AdminStatistic;
