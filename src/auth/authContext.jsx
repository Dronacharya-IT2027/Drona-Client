import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  verify: async () => {},
  logout: () => {}
});

export default AuthContext;
