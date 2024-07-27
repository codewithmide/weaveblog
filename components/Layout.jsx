import { div } from "@chakra-ui/react";
import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div>
      <NavBar />
      <div as="main" mt="60px">
        {children}
      </div>
    </div>
  );
}
