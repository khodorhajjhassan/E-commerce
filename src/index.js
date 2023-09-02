import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react.js"; // Import PersistGate
import App from "./App.js";
import "./index.css";
import { persistor, store } from "./redux/store.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          //console.log('State rehydration complete.');
        }}
        onError={(error) => {
          console.error("Error during state rehydration:", error);
        }}
      >
        {" "}
        {/* Add PersistGate */}
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
