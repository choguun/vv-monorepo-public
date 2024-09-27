import "@rainbow-me/rainbowkit/styles.css";

import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Lobby } from "./Lobby";
import { Main } from "./Main";
import { MudProvider } from "./Providers/MudProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Main />
      </>
    ),
  },
  {
    path: "/lobby",
    element: (
      <>
        <Lobby />
      </>
    ),
  },
]);

export function App() {
  return (
    <MudProvider>
        <Toaster
          toastOptions={{
            duration: 3000,
          }}
        />
        <RouterProvider router={router} />
    </MudProvider>
  );
}
