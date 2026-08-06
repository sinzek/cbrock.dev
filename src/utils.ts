import type { ReactNode } from "react";

export const Technologies = {
	typescript: {
		label: "TypeScript",
		text: "text-[#4f91de]",
		border: "border-[#4f91de]/70",
		background: "bg-[#4f91de]/10",
	},
	javascript: {
		label: "JavaScript",
		text: "text-[#f0db4f]",
		border: "border-[#f0db4f]/70",
		background: "bg-[#f0db4f]/10",
	},
	react: {
		label: "React",
		text: "text-[#61dafb]",
		border: "border-[#61dafb]/70",
		background: "bg-[#61dafb]/10",
	},
	nextjs: {
		label: "NextJS",
		text: "text-[#ededed]",
		border: "border-[#ededed]/70",
		background: "bg-[#ededed]/10",
	},
	svelte: {
		label: "Svelte",
		text: "text-[#ff5a2d]",
		border: "border-[#ff5a2d]/70",
		background: "bg-[#ff5a2d]/10",
	},
	dotnet: {
		label: ".NET",
		text: "text-[#7c5cf5]",
		border: "border-[#7c5cf5]/70",
		background: "bg-[#7c5cf5]/10",
	},
	postgres: {
		label: "PostgreSQL",
		text: "text-[#7fa8cc]",
		border: "border-[#7fa8cc]/70",
		background: "bg-[#7fa8cc]/10",
	},
	mysql: {
		label: "MySQL",
		text: "text-[#35a7bf]",
		border: "border-[#35a7bf]/70",
		background: "bg-[#35a7bf]/10",
	},
	csharp: {
		label: "C#",
		text: "text-[#d07bdd]",
		border: "border-[#d07bdd]/70",
		background: "bg-[#d07bdd]/10",
	},
	vite: {
		label: "Vite",
		text: "text-[#a46cff]",
		border: "border-[#a46cff]/70",
		background: "bg-[#a46cff]/10",
	},
	vitest: {
		label: "Vitest",
		text: "text-[#a9d94a]",
		border: "border-[#a9d94a]/70",
		background: "bg-[#a9d94a]/10",
	},
	php: {
		label: "PHP",
		text: "text-[#9ba0e0]",
		border: "border-[#9ba0e0]/70",
		background: "bg-[#9ba0e0]/10",
	},
	mdx: {
		label: "MDX",
		text: "text-[#fcb32c]",
		border: "border-[#fcb32c]/70",
		background: "bg-[#fcb32c]/10",
	},
	python: {
		label: "Python",
		text: "text-[#5b9fd6]",
		border: "border-[#5b9fd6]/70",
		background: "bg-[#5b9fd6]/10",
	},
	pygame: {
		label: "PyGame",
		text: "text-[#6bc46d]",
		border: "border-[#6bc46d]/70",
		background: "bg-[#6bc46d]/10",
	},
	opengl: {
		label: "OpenGL",
		text: "text-[#85b2cc]",
		border: "border-[#85b2cc]/70",
		background: "bg-[#85b2cc]/10",
	},
	nodejs: {
		label: "NodeJS",
		text: "text-[#6cc24a]",
		border: "border-[#6cc24a]/70",
		background: "bg-[#6cc24a]/10",
	},
} as const satisfies Record<
	string,
	{ label: string; border: string; text: string; background: string }
>;

export type Technology = keyof typeof Technologies;

export type Project = {
	title: string;
	source: "open" | "closed";
	subtitle: string;
	description: ReactNode;
	cover?:
		| {
				type: "image";
				src: string;
				alt: string;
				href?: string;
		  }
		| {
				type: "video";
				src: string;
				href?: string;
				cropSides?: boolean;
		  };
	technologies: Technology[];
	links: {
		label: string;
		href: string;
		variant: "primary" | "secondary";
		internal?: boolean;
	}[];
	releaseLabel: string;
};

export function downloadResume() {
	const a = document.createElement("a");
	a.href = "/chase-brock-resume-2026.pdf";
	a.download = "chase-brock-resume-2026.pdf";

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
