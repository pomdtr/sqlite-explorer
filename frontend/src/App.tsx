import { Studio } from "@libsqlstudio/gui";
import SqliteDriver from "./driver.ts";
import { useLocalStorage } from "@uidotdev/usehooks";
import "@libsqlstudio/gui/css";

export default function App() {
  const [theme, saveTheme] = useLocalStorage<"light" | "dark">(
    "theme",
    "light",
  );

  return (
    <Studio
      driver={new SqliteDriver()}
      name="SQLite Explorer"
      theme={theme}
      onThemeChange={saveTheme}
      color="blue"
    />
  );
}
