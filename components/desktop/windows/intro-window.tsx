import { useWindowContext } from "@/components/desktop/windows/window-context";
import { WindowModal } from "@/components/desktop/windows/window-modal";

export function IntroWindow() {
	const { closeWindow, useWindow } = useWindowContext();
	const cfg = useWindow("intro.md");

	return (
		<>
			<WindowModal open={cfg.open} close={() => closeWindow("intro.md")} cfg={cfg}>
				<p className="mb-4 font-sans">
					Hello! I&apos;m Chase Brock, a software developer with a passion for creating innovative solutions.
					Welcome to my personal website, where you can learn more about me, my projects, and my experience.
				</p>
				<p>Feel free to explore the different sections and reach out if you&apos;d like to connect!</p>
			</WindowModal>
		</>
	);
}
