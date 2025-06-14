import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/page-components/Header";
import Signup from "./pages/Signup";
import { Toaster } from "@/components/ui/sonner";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/page-components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
