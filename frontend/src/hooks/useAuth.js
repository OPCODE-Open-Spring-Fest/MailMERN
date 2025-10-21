import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook for authentication context
export default function useAuth() {
  return useContext(AuthContext);
}
