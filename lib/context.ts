import { createContext } from 'react';
import { User } from 'firebase/auth';

type userType = {
  user: User;
  username: string;
};

export const UserContext = createContext<userType | null>({
  user: null,
  username: null,
});
