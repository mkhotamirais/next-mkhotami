import { account } from "../appwrite";

export type AppUser = Awaited<ReturnType<typeof account.get>>;
