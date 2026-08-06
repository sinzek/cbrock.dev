import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Navbar } from "./components/navbar.tsx";
import { ScrollToTop } from "./components/scroll-to-top.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<ScrollToTop />
			<Navbar />
			<Routes>
				<Route path="/" element={<App />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
