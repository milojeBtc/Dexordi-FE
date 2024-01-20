import { createContext, useContext } from "react";

interface contextProps {
  loading: any;
  setLoading: (c: any) => void;
}

export const UserContext = createContext<contextProps>({
  loading: false,
  setLoading: () => {},
});

export const useUserContext = () => useContext(UserContext);
