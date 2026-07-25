import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTracker from "./components/PageTracker";

import Home from "./pages/Home";
import SalesRoleplay from "./pages/SalesRoleplay";
import Pricing from "./pages/Pricing";
import CaseStudies from "./pages/CaseStudies";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <>
      {/* Mounted once, above the routes: records every pathname visited
          during the session into localStorage under "visited_pages". */}
      <PageTracker />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sales-roleplay" element={<SalesRoleplay />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </>
  );
}
