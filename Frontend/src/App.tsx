import { Routes, Route } from "react-router-dom";
import Hauptseite from "./pages/Haupseite/Haupseite";
import Auth from "./components/Auth";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Einkaufsliste from "./pages/Einkaufliste/Einkaufsliste";
import CreateList from "./pages/Einkaufliste/CreateList";
import Layout from "./components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import NotFound from "./components/NotFound";
import FoodManagement from "./pages/Lebensmittel/FoodManagement";
import TokenVerifizierung from "./context/TokenVerifizierung";
import KassenbuchNavi from "./pages/Kassenbuch/KassenbuchNavi";
import Liste from "./pages/Kassenbuch/Kassenbuch_Page_Liste";
import Neu from "./pages/Kassenbuch/Kassenbuch_Page_Neu";
import Eingaenge from "./pages/Kassenbuch/Kassenbuch_Page_Eingaenge";
import Ausgaenge from "./pages/Kassenbuch/Kassenbuch_Page_Ausgaenge";
import { DarkModeProvider } from "./context/DarkModeContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<Hauptseite />} />

          <Route path="/login" element={<Auth />} />
          <Route path="*" element={<NotFound />} />

          {/* Navbar */}
          <Route
            element={
              <TokenVerifizierung>
                <Layout />
              </TokenVerifizierung>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/kassenbuch" element={<KassenbuchNavi />}>
              <Route index element={<Liste />} />
              <Route path="eingaenge" element={<Eingaenge />} />
              <Route path="ausgaenge" element={<Ausgaenge />} />
              <Route path="neu" element={<Neu />} />
            </Route>
            <Route path="/lebensmittel" element={<FoodManagement />} />
            <Route path="/einkaufsliste" element={<Einkaufsliste />} />
            <Route path="/einkaufliste" element={<Einkaufsliste />} />

            <Route path="/einkaufliste/create" element={<CreateList />} />
          </Route>
        </Routes>
      </DarkModeProvider>
    </QueryClientProvider>
  );
};

export default App;
