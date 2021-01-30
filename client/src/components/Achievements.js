import React, { useEffect, useState } from "react";
import CachedIcon from "@material-ui/icons/Cached";
import { updateUserData } from "../helpers/userHelpers";

const minimumValueOfMoneySpent = 50,
  minimumValueOfPurchasedGames = 1,
  minimumValueOfPurchasedDigitalGames = 5,
  minimumValueOfPurchasedPhysicalGames = 5;

export const AchievementsList = {
  achievingMoneySpent: {
    spend50Dollars: {
      value: minimumValueOfMoneySpent,
      achievementText: "Buy games for 50 $",
      estimatedDiscountForTheClient: 2,
    },
    spend100Dollars: {
      value: 100,
      achievementText: "Buy games for 100 $",
      estimatedDiscountForTheClient: 4,
    },
    spend1000Dollars: {
      value: 1000,
      achievementText: "Buy games for 1000 $",
      estimatedDiscountForTheClient: 6,
    },
  },
  achievingPurchasedGames: {
    purchased1Game: {
      value: minimumValueOfPurchasedGames,
      achievementText: "Buy one game",
      estimatedDiscountForTheClient: 0,
    },
    purchased5Game: {
      value: 5,
      achievementText: "Buy 5 games",
      estimatedDiscountForTheClient: 2,
    },
    purchased10Game: {
      value: 10,
      achievementText: "Buy 10 games",
      estimatedDiscountForTheClient: 6,
    },
  },
  loverOfDigitalGames: {
    purchased5DigitalGame: {
      value: minimumValueOfPurchasedDigitalGames,
      achievementText: "Buy 5 digital games",
      estimatedDiscountForTheClient: 2,
    },
    purchased10DigitalGame: {
      value: 10,
      achievementText: "Buy 10 digital games",
      estimatedDiscountForTheClient: 4,
    },
  },
  loverOfPhysicalGames: {
    purchased5PhysicalGame: {
      value: minimumValueOfPurchasedPhysicalGames,
      achievementText: "Buy 5 physical games",
      estimatedDiscountForTheClient: 2,
    },
    purchased10PhysicalGame: {
      value: 10,
      achievementText: "Buy 10 physical games",
      estimatedDiscountForTheClient: 4,
    },
  },
};

const Achievements = ({ user, UpdatingUserDataTriggered }) => {
  const [buttonToggle, setButtonToggle] = useState(false);
  const [userData, setUserData] = useState(user);
  let gamesBoughtFor = 0,
    numberOfGamePurchased = 0,
    numberOfPurchasedPhysicalCopiesOfTheGame = 0,
    numberOfPurchasedDigitalCopiesOfTheGame = 0,
    personalDiscount = 0;

  const reloadAchievementsClickHandler = () => {
    if (user?.purchasedGames.length) {
      numberOfGamePurchased += user.purchasedGames.length;

      user.purchasedGames.forEach((game) => {
        gamesBoughtFor += game.price;
        game.gameType === "Physical"
          ? numberOfPurchasedPhysicalCopiesOfTheGame++
          : numberOfPurchasedDigitalCopiesOfTheGame++;
      });
    }

    const achievements = [];

    const countingAchievements = (topic, value, minimumValue) => {
      for (let key in AchievementsList[topic]) {
        if (AchievementsList[topic][key].value <= value) {
          if (AchievementsList[topic][key].value === minimumValue) {
            achievements.push(AchievementsList[topic][key]);
          } else {
            achievements.pop();
            achievements.push(AchievementsList[topic][key]);
          }
        } else break;
      }
    };

    for (let topic in AchievementsList) {
      switch (topic) {
        case "achievingMoneySpent": {
          countingAchievements(topic, gamesBoughtFor, minimumValueOfMoneySpent);
          break;
        }
        case "achievingPurchasedGames": {
          countingAchievements(topic, numberOfGamePurchased, minimumValueOfPurchasedGames);
          break;
        }
        case "loverOfDigitalGames": {
          countingAchievements(topic, numberOfPurchasedDigitalCopiesOfTheGame, minimumValueOfPurchasedDigitalGames);
          break;
        }
        case "loverOfPhysicalGames": {
          countingAchievements(topic, numberOfPurchasedPhysicalCopiesOfTheGame, minimumValueOfPurchasedPhysicalGames);
          break;
        }
        default:
          break;
      }
    }

    user.achievements = achievements;
    achievements.forEach((achieve) => {
      personalDiscount += achieve.estimatedDiscountForTheClient;
    });
    user.personalDiscount = personalDiscount;

    setUserData(user);

    gamesBoughtFor = 0;
    numberOfGamePurchased = 0;
    numberOfPurchasedPhysicalCopiesOfTheGame = 0;
    numberOfPurchasedDigitalCopiesOfTheGame = 0;
    personalDiscount = 0;

    setButtonToggle((prevState) => !prevState);
  };

  useEffect(() => {
    updateUserData(userData._id, userData);
    UpdatingUserDataTriggered();
  }, [buttonToggle]);

  return (
    <>
      <button onClick={reloadAchievementsClickHandler}>
        <CachedIcon />
      </button>
      <div>
        {user?.achievements?.length
          ? user?.achievements.map((achieve) => <p key={achieve.achievementText}>{achieve.achievementText}</p>)
          : "No achievements. Try to update, maybe they will appear!"}
      </div>
    </>
  );
};

export default Achievements;
