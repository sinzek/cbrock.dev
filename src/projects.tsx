import type { Project } from "./utils";

export const projects: Project[] = [
	{
		title: "Bluprint Creative",
		source: "closed",
		subtitle: "Content operations platform for online creators",
		description: (
			<>
				Bluprint Creative is a project management platform built
				specifically for content creators. It brings ideas, scripts,
				thumbnails, schedules, and frame-accurate video reviews into one
				connected workspace, with much of the flexibility you&apos;d
				expect from Airtable. I built the platform myself, and maintain
				it with a small team of collaborators. It now includes more than
				273,000 lines of TypeScript, 112 Postgres tables, and supports
				thousands of paying users. Some of the larger systems I&apos;ve
				built include a video review tool with sprite-sheet scrubbing
				and credit-based 4K encoding, a visual automations engine, an AI
				agent that analyzes YouTube channels using seven custom tools,
				and a documentation pipeline that writes MDX and captures
				screenshots with Playwright using a custom agent skill. I also
				built much of the underlying infrastructure, including the data
				layer, menu system, and TypeScript utility library used
				throughout the application.
			</>
		),
		cover: {
			type: "image",
			src: "https://bluprint-images.b-cdn.net/etc/kanban-board.png",
			alt: "Bluprint Creative Kanban Board",
			href: "https://bluprintuniversity.com/creative",
		},
		technologies: [
			"typescript",
			"react",
			"nextjs",
			"postgres",
			"mdx",
			"vitest",
		],
		links: [
			{
				label: "Visit Live Site",
				href: "https://bluprintuniversity.com/creative",
				variant: "primary",
			},
			{
				label: "Guides",
				href: "https://bluprintuniversity.com/help",
				variant: "secondary",
			},
		],
		releaseLabel: "2024 - Present",
	},
	{
		title: "ts-chas",
		source: "open",
		subtitle: "TypeScript utilities & schema validation",
		description: (
			<>
				ts-chas is a functional programming and utility library for
				TypeScript, built around explicitly handling errors, defining
				runtime types, validating schemas, managing asynchronous
				operations, and composing functions. Unlike utility libraries
				that ship a pile of disparate modules, chas is designed as a
				single tightly integrated ecosystem: Result and Option for
				type-safe error handling and null-safety without try/catch or
				null checks, Task for lazy and resilient asynchronous
				operations, Guard for chainable validation and schema parsing,
				tagged errors for typed discriminated error unions and
				exhaustive matching, and pipe and flow for function composition.
				Because every module shares the same underlying types, errors
				stay typed and intelligible as they cross module boundaries. It
				now sits at the core of the data and schema layer in Bluprint
				Creative, where it parses and validates the data moving through
				the application.
			</>
		),
		cover: {
			type: "video",
			src: "/ts-chas-scroll.mp4",
			href: "https://github.com/sinzek/ts-chas",
			cropSides: true,
		},
		technologies: ["typescript", "vitest"],
		links: [
			{
				label: "Documentation",
				href: "https://docs.cbrock.dev",
				variant: "primary",
			},
			{
				label: "GitHub",
				href: "https://github.com/sinzek/ts-chas",
				variant: "secondary",
			},
			{
				label: "npm",
				href: "https://www.npmjs.com/package/ts-chas",
				variant: "secondary",
			},
		],
		releaseLabel: "2026 - Present",
	},
	{
		title: "menu-engine",
		source: "open",
		subtitle: "Framework-agnostic menu state machine",
		description: (
			<>
				menu-engine is a TypeScript library for building menus
				(dropdowns, popovers, tooltips, and nested submenus) without
				rewriting the same behavior in every project. It is built around
				a deterministic state machine, so transitions are predictable
				instead of emerging from a pile of event handlers. The library
				handles hover open delays and close timeouts, Amazon-style
				safe-triangle math that keeps a submenu open while the pointer
				cuts diagonally toward it, and a roving tabindex focus manager
				with arrow-key navigation and typeahead search. The core has no
				runtime dependencies and ships as dual ESM and CommonJS bundles
				with full type declarations, which lets it drop into React, Vue,
				Svelte, or any other web framework.
			</>
		),
		cover: {
			type: "video",
			src: "/menu-engine.mp4",
			href: "https://github.com/sinzek/menu-engine",
		},
		technologies: ["typescript", "vitest"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/sinzek/menu-engine",
				variant: "primary",
			},
			{
				label: "npm",
				href: "https://www.npmjs.com/package/menu-engine",
				variant: "secondary",
			},
		],
		releaseLabel: "2026",
	},
	{
		title: "imightthrow",
		source: "open",
		subtitle: "VS Code extension that flags throwing functions",
		description: (
			<>
				imightthrow is a small VS Code extension that marks the
				TypeScript and JavaScript functions in your codebase that can
				throw. It reads function bodies for throw statements and draws
				an inline decorator at call sites, at declarations, or both,
				with the text and color configurable. It exists because a thrown
				error is invisible in a TypeScript signature, so the one thing
				the type system will not tell you is where your exceptions come
				from.
			</>
		),
		cover: {
			type: "image",
			src: "https://camo.githubusercontent.com/7f759fa78b282dd2dec44b136d42b108c6000f6b7997d4a29644d95d909e94d1/68747470733a2f2f692e706f7374696d672e63632f43785166644e37462f5343522d32303235313130372d62686e692e706e67",
			alt: "imightthrow example screenshot",
			href: "https://github.com/sinzek/imightthrow",
		},
		technologies: ["typescript"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/sinzek/imightthrow",
				variant: "primary",
			},
			{
				label: "VS Code Marketplace",
				href: "https://marketplace.visualstudio.com/items?itemName=ChaseBrock.imightthrow",
				variant: "secondary",
			},
		],
		releaseLabel: "2025",
	},
	{
		title: "wp-bulk-email-password-reset",
		source: "open",
		subtitle: "WordPress plugin for bulk password resets",
		description: (
			<>
				A WordPress plugin for sending password reset emails to a large
				set of users at once. It runs the sends as a background process
				so the admin dashboard stays responsive, and streams a live log
				over AJAX so you can watch each message leave rather than guess
				whether the batch stalled halfway through. It is built to send
				emails through an SMTP server rather than the default PHP
				mailer.
			</>
		),
		technologies: ["php", "javascript"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/sinzek/wp-bulk-email-password-reset",
				variant: "primary",
			},
		],
		releaseLabel: "2024",
	},
	{
		title: "QueueSmart",
		source: "open",
		subtitle: "Queue management system",
		description: (
			<>
				A queue management system built with three other students for a
				software design course. It has a customer-facing dashboard and
				an admin-facing one, and covers live notifications, queue
				management, and report generation. We wrote the front end in
				Svelte and TypeScript against a C# and .NET backend, with
				generous test coverage throughout.
			</>
		),
		technologies: ["svelte", "typescript", "dotnet", "csharp"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/ImperfectBeta/COSC-4353",
				variant: "primary",
			},
		],
		releaseLabel: "2025 - 2026",
	},
	{
		title: "Zoo Database",
		source: "open",
		subtitle: "Full-stack zoo operations platform",
		description: (
			<>
				A full-stack web application that models the business and
				commercial operations of a zoo. I was the team lead, guiding and
				collaborating with four other students through the build. It
				showcases two dashboards, one customer-facing and one for
				employees, over a MySQL schema we designed in third normal form.
				The stack is deliberately minimal: strictly JavaScript, Node.js,
				React, CSS, and Vite, with no other dependencies. It is hosted
				on Vercel.
			</>
		),
		cover: {
			type: "image",
			src: "/the-zoo.png",
			alt: "Zoo Database Dashboard",
			href: "https://github.com/sinzek/zoo-database",
		},
		technologies: ["javascript", "nodejs", "mysql", "react", "vite"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/sinzek/zoo-database",
				variant: "primary",
			},
		],
		releaseLabel: "2025",
	},
	{
		title: "The Vault",
		source: "open",
		subtitle: "A 3D maze game",
		description: (
			<>
				The Vault is a first-person maze game I built for a computer
				graphics course, written in Python against raw OpenGL through
				PyGame. Every run generates a new vault: a depth-first carve
				produces the grid, a breadth-first search solves it, and a
				second traversal measures how deep each dead end sits off the
				solution path, so hazards and rewards can be placed by how far
				out of your way they are. Ten artefacts are hidden in each
				vault, five helpful and five harmful, paired onto the five
				platonic solids, which the game builds from their raw vertices
				at startup rather than loading models. All of them spawn
				bone-white, so the shape tells you what category of thing is
				coming but never whether you want it. The game also includes a
				headlamp spot-light with attenuated flares, exponential fog
				driving the blackout and survey effects, ceiling spike traps on
				offset phase cycles, a held minimap with a 20-second lifetime
				budget, and persistent best times.
			</>
		),
		cover: {
			type: "image",
			src: "/the-vault.png",
			alt: "The Vault Game Screenshot",
			href: "https://github.com/sinzek/the-vault",
		},
		technologies: ["python", "pygame", "opengl"],
		links: [
			{
				label: "GitHub",
				href: "https://github.com/sinzek/the-vault",
				variant: "primary",
			},
		],
		releaseLabel: "2026",
	},
];
