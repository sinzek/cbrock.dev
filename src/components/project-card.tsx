import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Technologies, type Project } from "../utils";

export function ProjectCard({
	title,
	source,
	subtitle,
	description,
	cover,
	technologies,
	links,
	releaseLabel,
}: Project) {
	const sourceLabel = source === "open" ? "Open Source" : "Closed Source";

	return (
		<article className="flex flex-col border bg-gray-900/25 shadow-lg shadow-black/40 hover:border-accent-400/25 transition-colors">
			<div className="flex items-start justify-between gap-3 p-4 border-b bg-gray-900">
				<div className="flex flex-col gap-1">
					<h2 className="text-[15px] font-medium leading-tight">
						{title}
					</h2>
					<p className="text-xs text-ink-500">{releaseLabel}</p>
				</div>
				<a
					className={`text-xs px-2 py-0.5 border no-underline shrink-0 whitespace-nowrap ${source === "open" ? "text-emerald-300 border-emerald-600/50 bg-emerald-500/7" : "text-amber-200 border-amber-400/50 bg-amber-400/7"}`}
					href={
						source === "open" && cover ? cover.href : links[0].href
					}
					target="_blank"
					rel="noopener noreferrer"
				>
					{sourceLabel}
				</a>
			</div>
			{cover && (
				<div className="p-4 border-b">
					<a
						href={cover.href}
						target="_blank"
						rel="noopener noreferrer"
					>
						{cover.type === "image" ? (
							<img
								src={cover.src}
								alt={cover.alt}
								className="w-full h-auto object-cover border border-ink-700/25"
							/>
						) : (
							<div className="overflow-hidden border border-ink-700/25">
								<video
									src={cover.src}
									controls={false}
									className={`block ${cover.cropSides ? "w-[111%] max-w-none ml-[-5.5%] -mt-px" : ""} h-auto`}
									disablePictureInPicture
									muted
									autoPlay
									loop
									playsInline
								/>
							</div>
						)}
					</a>
				</div>
			)}
			<div className="p-4 flex flex-col gap-3">
				<p className="text-sm text-ink-400">{subtitle}</p>
				<p className="text-sm text-ink-300 leading-[1.8]">
					{description}
				</p>
			</div>
			<div className="p-4 flex flex-wrap items-center gap-2">
				{technologies.map((tech) => {
					const techInfo = Technologies[tech];
					return (
						<span
							key={tech}
							className={`text-xs px-2 py-0.5 border ${techInfo.text} ${techInfo.border} ${techInfo.background}`}
						>
							{techInfo.label}
						</span>
					);
				})}
			</div>
			<div className="p-4 flex flex-wrap items-center gap-2 border-t mt-auto">
				{links.map((link) => {
					const className = `inline-flex items-center gap-1.5 text-sm ${link.variant === "primary" ? "border-accent-400/50 bg-accent-400/10 text-accent-300 hover:border-accent-400/75 hover:bg-accent-400/20" : "border-ink-600/70 bg-ink-600/10 text-ink-300 hover:border-ink-600 hover:bg-ink-600/25"} border px-3 py-1 no-underline`;

					return link.internal ? (
						<Link key={link.href} to={link.href} className={className}>
							{link.label}
							<ArrowRightIcon />
						</Link>
					) : (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className={className}
						>
							{link.label}
							<ArrowUpRightIcon />
						</a>
					);
				})}
			</div>
		</article>
	);
}
