import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* React Router keeps the scroll position across navigations, which lands you
   halfway down a new page when you click through from a card. */
export function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
	}, [pathname]);

	return null;
}
