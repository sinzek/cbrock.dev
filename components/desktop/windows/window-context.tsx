"use client";

import { useWindowManager } from "@/components/desktop/windows/use-window-manager";
import { createContext, useContext, type ReactNode } from "react";

type WindowContextProps = ReturnType<typeof useWindowManager>;

const WindowContext = createContext<WindowContextProps | null>(null);

export function WindowContextProvider({ children }: { children: ReactNode }) {
	const windowManager = useWindowManager();

	return (
		<WindowContext.Provider
			value={{
				...windowManager,
			}}
		>
			{children}
		</WindowContext.Provider>
	);
}

export function useWindowContext() {
	const context = useContext(WindowContext);
	if (!context) {
		throw new Error("useWindowContext must be used within a WindowContextProvider");
	}
	return context;
}
