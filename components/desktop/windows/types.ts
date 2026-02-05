export type Window =
	| "intro.md"
	| "about-me.md"
	| "projects.html"
	| "work-experience.pdf"
	| "contact.txt"
	| (string & {});

export type WindowConfig = {
	id: Window;
	pos: { x: number; y: number };
	size: { width: number; height: number };
	open: boolean;
	minimized: boolean;
};

export type WindowResizeDir = "e" | "s" | "se" | "w" | "sw";
