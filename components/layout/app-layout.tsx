import { WindowManagerSidebar } from "../desktop/windows/window-manager-sidebar";
import { Navbar } from "./navbar";

export function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative flex flex-col min-h-dvh h-dvh min-w-dvw w-dvw max-w-dvw max-h-dvh bg-base-100 overflow-hidden">
			<Navbar />
			<main className="relative w-full flex-1 overflow-hidden">
				{children}

				<WindowManagerSidebar />
			</main>
		</div>
	);
}
