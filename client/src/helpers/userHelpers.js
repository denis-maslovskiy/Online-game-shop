import axios from "axios";

export const updateUserData = async (userId, user) => {
  try {
    await axios.put(`/api/user/update-user-data/${userId}`, user);
  } catch (e) {
    console.log(e);
  }
};

export const reloadAchievements = async (user) => {
  const { data } = await axios.get("/api/achievement/get-all-achievements");
  const allAchievements = data;

  let gamesBoughtFor = 0,
    numberOfGamePurchased = 0,
    numberOfPurchasedPhysicalGames = 0,
    numberOfPurchasedDigitalGames = 0,
    personalDiscount = 0;

  const minimumValueOfMoneySpent = 50,
    minimumValueOfPurchasedGames = 1,
    minimumValueOfPurchasedDigitalGames = 5,
    minimumValueOfPurchasedPhysicalGames = 5;

  const ACHIEVING_MONEY_SPENT = "achievingMoneySpent",
    ACHIEVING_PURCHASED_GAMES = "achievingPurchasedGames",
    LOVER_OF_DIGITAL_GAMES = "loverOfDigitalGames",
    LOVER_OF_PHYSICAL_GAMES = "loverOfPhysicalGames";

  if (user?.purchasedGames.length) {
    numberOfGamePurchased += user.purchasedGames.length;

    user.purchasedGames.forEach((game) => {
      gamesBoughtFor += +game.price;
      game.gameType === "Physical" ? numberOfPurchasedPhysicalGames++ : numberOfPurchasedDigitalGames++;
    });
  }

  const achievementsResult = [];
  const achievementsObj = {};

  allAchievements.forEach((achieve) => {
    achievementsObj[achieve.achievementTopic] = {};
  });
  allAchievements.forEach((achieve) => {
    achievementsObj[achieve.achievementTopic][achieve.achievementName] = {
      value: achieve.achievementValue,
      achievementText: achieve.achievementText,
      estimatedDiscountForTheClient: achieve.estimatedDiscountForTheClient,
    };
  });

  const handleCountAchievements = (topic, value, minimumValue) => {
    for (let key in achievementsObj[topic]) {
      if (achievementsObj[topic][key].value <= value) {
        if (achievementsObj[topic][key].value === minimumValue) {
          achievementsResult.push(achievementsObj[topic][key]);
        } else {
          achievementsResult.pop();
          achievementsResult.push(achievementsObj[topic][key]);
        }
      } else break;
    }
  };

  for (let topic in achievementsObj) {
    switch (topic) {
      case ACHIEVING_MONEY_SPENT: {
        handleCountAchievements(topic, gamesBoughtFor, minimumValueOfMoneySpent);
        break;
      }
      case ACHIEVING_PURCHASED_GAMES: {
        handleCountAchievements(topic, numberOfGamePurchased, minimumValueOfPurchasedGames);
        break;
      }
      case LOVER_OF_DIGITAL_GAMES: {
        handleCountAchievements(topic, numberOfPurchasedDigitalGames, minimumValueOfPurchasedDigitalGames);
        break;
      }
      case LOVER_OF_PHYSICAL_GAMES: {
        handleCountAchievements(topic, numberOfPurchasedPhysicalGames, minimumValueOfPurchasedPhysicalGames);
        break;
      }
      default:
        break;
    }
  }

  user.achievements = achievementsResult;
  achievementsResult.forEach((achieve) => {
    personalDiscount += achieve.estimatedDiscountForTheClient;
  });
  user.personalDiscount = personalDiscount;

  await updateUserData(user._id, user);

  gamesBoughtFor = 0;
  numberOfGamePurchased = 0;
  numberOfPurchasedPhysicalGames = 0;
  numberOfPurchasedDigitalGames = 0;
  personalDiscount = 0;
};
