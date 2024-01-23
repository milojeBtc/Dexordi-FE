import { createContext, useContext } from "react";

interface contextProps {
  loading: any;
  setLoading: (c: any) => void;
  connected: boolean,
  setConnected: (c:any) => void;
}

export const UserContext = createContext<contextProps>({
  loading: false,
  setLoading: () => {},
  connected: false,
  setConnected: () => {}
});

export const useUserContext = () => useContext(UserContext);
