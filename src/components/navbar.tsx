import { ArrowUpRightIcon } from "@phosphor-icons/react";

const sections = [
	{ label: "Projects", href: "/" },
	{
		label: "Resume",
		href: "/chase-brock-resume-2026.pdf",
		target: "_blank",
		rel: "noopener noreferrer",
	},
];

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 border-b bg-ink-900/85 backdrop-blur">
			<nav className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
				<a
					href="/#overview"
					className="text-sm text-ink-100 no-underline hover:text-accent-300 transition-colors"
				>
					cbrock<span className="text-accent-400">.dev</span>
				</a>
				<div className="flex items-center gap-1">
					{sections.map((section) => (
						<a
							key={section.href}
							href={section.href}
							target={section.target}
							rel={section.rel}
							className="text-sm text-ink-300 no-underline px-3 py-1 hover:text-accent-300 hover:bg-ink-800/60 transition-colors"
						>
							{section.label}
						</a>
					))}
					<a
						href="https://github.com/sinzek"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-sm text-ink-300 no-underline px-3 py-1 hover:text-accent-300 hover:bg-ink-800/60 transition-colors"
					>
						GitHub
						<ArrowUpRightIcon />
					</a>
					<a
						href="mailto:chase.p.brock@gmail.com"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-sm text-ink-300 no-underline px-3 py-1 hover:text-accent-300 hover:bg-ink-800/60 transition-colors"
					>
						Contact
						<ArrowUpRightIcon />
					</a>
				</div>
			</nav>
		</header>
	);
}
