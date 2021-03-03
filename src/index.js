import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
//import { createStore } from "redux";
//import rootReducer from "./reducer/rootReducer";
import App from "./App";
import Store from './store/store'

// const store = createStore(
//   rootReducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
