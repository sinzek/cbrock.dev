import { useWindowContext } from "@/components/desktop/windows/window-context";
import { WindowModal } from "@/components/desktop/windows/window-modal";

export function AboutMeWindow() {
	const { closeWindow, useWindow } = useWindowContext();
	const cfg = useWindow("about-me.md");

	return (
		<>
			<WindowModal open={cfg.open} close={() => closeWindow("about-me.md")} cfg={cfg}>
				<p className="mb-4 font-sans">
					Hi! I&apos;m Chase Brock, a software developer specializing in building web applications with a
					focus on React and TypeScript. I love creating intuitive user experiences and writing clean,
					maintainable code.
				</p>
				<p>
					When I&apos;m not coding, I enjoy hiking, photography, and exploring new technologies. Feel free to
					check out my projects and get in touch!
				</p>
			</WindowModal>
		</>
	);
}
