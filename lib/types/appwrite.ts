import { Models } from "appwrite";

export type UserPrefs = Models.Preferences & {
  avatar?: string | null;
};

export type User = Models.User<UserPrefs>;
