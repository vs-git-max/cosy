import bcrypt from "bcrypt";

export const encryptPassword = async (password: string, salt = 12) =>
  await bcrypt.hash(password, salt);

export const confirmPassword = async (
  inputPassword: string,
  userPassword: string,
) => await bcrypt.compare(inputPassword, userPassword);
