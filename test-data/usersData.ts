import generateRandomEmail from "../utils/generateRandomEmails";

export const credentials = {
  userOne: {
    email: "mkvak@gmail.com",
    password: "Barselona-1987",
  },
  userTwo: {
    email: "mkvak2@gmail.com",
    password: "Qwe12345",
  },
  randomUser: {
    email: generateRandomEmail(),
    password: "Qwer1234",
  },
};
