import { Navbar } from "./navbar";

export function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative flex flex-col min-h-dvh h-dvh min-w-dvw w-dvw max-w-dvw max-h-dvh bg-base-100 overflow-hidden">
			<Navbar />
			<main className="p-6 w-full h-full overflow-y-auto">{children}</main>
		</div>
	);
}
