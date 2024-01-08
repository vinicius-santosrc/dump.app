import React, { createContext, useReducer, useContext } from 'react';

const AppContext = createContext();

const initialState = {
  pageData: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PAGE_DATA':
      return { ...state, pageData: action.payload };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };