import { RouterProvider } from "react-router";
import { AuthProvider } from "./auth-context";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}