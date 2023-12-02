import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Login.tsx";
import { OAuth } from "./OAuth.tsx";
import { App } from "./App.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: (
      <div>
        <h1>404</h1>
        <p>Not Found</p>
      </div>
    ),
  },
  { path: "/oauth", element: <OAuth /> },
  { path: "/draw/:streamer", element: <App /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
