import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import { useDarkMode } from "./hooks/useDarkMode";

export default function App() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <div className="min-h-screen bg-bg text-ink font-body">
      <div className="max-w-3xl mx-auto px-5">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main>
          <HomePage />
        </main>
        <Footer />
      </div>
    </div>
  );
}
