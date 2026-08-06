import { projects } from "./projects";
import { ProjectCard } from "./components/project-card";
import { ArrowLineDownIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { downloadResume } from "./utils";

export default function App() {
	return (
		<>
			<main className="flex min-h-screen flex-col pt-24 px-4 container mx-auto">
				<section id="overview" className="mb-8">
					<h3 className="mb-2 text-xl font-semibold text-accent-300">
						Chase Brock
					</h3>
					<h1 className="mb-8 text-3xl font-bold">
						Software Engineer, CS Student
					</h1>
					<p className="mb-8 2xl:text-lg text-base">
						I&apos;m a full-time software engineer and computer
						science student at the University of Houston, graduating
						in December 2026.
						<br />
						<br />I build production software that supports the
						workflows of thousands of paying users. In my current
						role, I lead a small team to develop a content
						operations platform for online creators. Internally,
						this platform is used by our production team of over 30
						people, including video editors, designers, and
						production staff. My work spans subscription billing,
						authentication, product design, data modeling, media
						infrastructure, and third-party integrations.
						<br />
						<br />
						When existing tools don&apos;t meet our needs, I build
						custom solutions myself, such as internal libraries and
						developer tooling that make our codebases easier for the
						team to work with.
					</p>
					<p className="mb-8 2xl:text-lg text-base">
						Interested in learning more about me or my work?
						Let&apos;s talk.
					</p>
					<p className="2xl:text-lg text-base">
						GitHub:{" "}
						<a
							href="https://github.com/sinzek"
							target="_blank"
							rel="noopener noreferrer"
						>
							@sinzek
						</a>
						<br />
						Email:{" "}
						<a
							href="mailto:chase@cbrock.dev"
							target="_blank"
							rel="noopener noreferrer"
						>
							chase.p.brock@gmail.com
						</a>
						<br />
						LinkedIn:{" "}
						<a
							href="https://www.linkedin.com/in/chasepbrock/"
							target="_blank"
							rel="noopener noreferrer"
						>
							@chasepbrock
						</a>
						<br />
					</p>
					<div className="flex items-center gap-2">
						Resume:
						<a
							onClick={downloadResume}
							className="inline-flex items-center gap-1.5 cursor-pointer no-underline hover:text-accent-200 transition-colors"
						>
							<ArrowLineDownIcon className="size-4" />
							Download
						</a>
					</div>
				</section>
				<section
					id="projects"
					className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
				>
					{projects
						.sort((a, b) =>
							b.releaseLabel.localeCompare(a.releaseLabel),
						)
						.sort((a) =>
							a.releaseLabel.includes("Present") ? -1 : 1,
						)
						.map((p) => (
							<ProjectCard
								key={`${p.title}-${p.source}`}
								{...p}
							/>
						))}
				</section>
				<footer className="mt-16 py-8 flex flex-col items-start gap-2 text-sm text-ink-400 border-t">
					<p>
						Chase Brock ∙ B.Sc. Computer Science, SWE Capstone ∙ 2+
						years of professional software engineering experience
					</p>
					<a
						href="mailto:chase.p.brock@gmail.com"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-1"
					>
						Email: chase.p.brock@gmail.com
					</a>
					<a
						href="https://www.linkedin.com/in/chasepbrock/"
						target="_blank"
						rel="noopener noreferrer"
					>
						LinkedIn: @chasepbrock
					</a>
					<button
						onClick={() => {
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
						className="text-accent-300 mt-2 hover:text-accent-200 flex items-center gap-1.5 transition-colors"
					>
						Back to top
						<ArrowUpIcon />
					</button>
				</footer>
			</main>
		</>
	);
}
