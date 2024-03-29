import { ReactNode, createContext, useEffect, useReducer, useRef } from "react";
import { buildActions } from "./actions-builder";
import { reducer } from "./reducers";
import { actions } from "./actions";

type UserContextProps = {
  state: StateProps;
  action: {
    signIn: () => void;
    signOut: () => void;
  };
};

type UserProviderProps = {
  children: ReactNode;
};

export type StateProps = typeof globalState;

export const globalState = {
  user: {
    name: "",
    avatarUrl: "",
    email: "",
    id: "",
  },
};

export const UserContext = createContext({} as UserContextProps);

export function UserContextProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(reducer, globalState);

  useEffect(() => {
    const user = localStorage.getItem("@ticket_manager_user");

    if (user) {
      dispatch({ type: actions.SET_USER, payload: JSON.parse(user) });
    }
  }, []);

  const action = useRef(buildActions(dispatch));

  return (
    <UserContext.Provider value={{ state, action: action.current }}>
      {children}
    </UserContext.Provider>
  );
}
