import { Studio } from "@libsqlstudio/gui";
import SqliteDriver from "./driver.ts";
import "@libsqlstudio/gui/css";

export default function App() {
  return (
    <Studio
      driver={new SqliteDriver()}
      name="Turso Connection"
      theme="light"
      color="blue"
    />
  );
}
