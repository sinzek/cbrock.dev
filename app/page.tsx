"use client";
import { DesktopIcon } from "@/components/desktop/desktop-icon";
import { AboutMeWindow } from "@/components/desktop/windows/about-me-window";
import { IntroWindow } from "@/components/desktop/windows/intro-window";
import { useWindowContext } from "@/components/desktop/windows/window-context";
import { NAVBAR_HEIGHT } from "@/constants/general";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { FileTextIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function Home() {
	const [boundsRef, setBoundsRef] = useState<HTMLDivElement | null>(null);
	const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>({
		introduction: { x: 20, y: 25 },
		"about-me": { x: 20, y: 125 },
	});
	const { openWindow, updateWindowPos, getWindow } = useWindowContext();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 2 },
		}),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { id } = event.active;
		const delta = event.delta;

		if (id.toString().startsWith("window-modal-")) {
			const windowId = id.toString().replace("window-modal-", "");
			const currentWindow = getWindow(windowId);

			let newY = currentWindow.pos.y + delta.y;
			let newX = currentWindow.pos.x + delta.x;

			// prevent moving under taskbar
			if (newY < NAVBAR_HEIGHT) {
				newY = NAVBAR_HEIGHT;
			} else if (newY + currentWindow.size.height > window.innerHeight) {
				newY = window.innerHeight - currentWindow.size.height;
			}

			if (newX < 0) {
				newX = 0;
			} else if (newX + currentWindow.size.width > window.innerWidth) {
				newX = window.innerWidth - currentWindow.size.width;
			}

			updateWindowPos(windowId, {
				x: newX,
				y: newY,
			});
			return;
		}

		if (!boundsRef) return;
		const boundsRect = boundsRef.getBoundingClientRect();
		const iconWidth = 80; // w-20 = 80px
		const iconHeight = 80; // h-20

		setIconPositions(prev => {
			const currentX = prev[id as string]?.x ?? 0;
			const currentY = prev[id as string]?.y ?? 0;

			const newX = currentX + delta.x;
			const newY = currentY + delta.y;

			return {
				...prev,
				[id as string]: {
					x: Math.max(0, Math.min(newX, boundsRect.width - iconWidth)),
					y: Math.max(0, Math.min(newY, boundsRect.height - iconHeight)),
				},
			};
		});
	}

	return (
		<div className="w-full h-full flex">
			<div
				className="absolute inset-0 z-0"
				style={{
					backgroundImage: 'url("/grainy-texture.webp")',
					backgroundSize: "500px 500px",
					backgroundPosition: "center",
					backgroundRepeat: "repeat",
				}}
			/>
			<div className="absolute inset-0 z-0 bg-secondary/20" />
			<div ref={setBoundsRef} className="absolute inset-0 z-2 w-full h-full">
				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<DesktopIcon
						id="introduction"
						label="intro.md"
						onClick={() => openWindow("intro.md")}
						icon={FileTextIcon}
						iconClassName="text-blue-700"
						position={iconPositions["introduction"]}
					/>
					<DesktopIcon
						id="about-me"
						label="about-me.md"
						onClick={() => openWindow("about-me.md")}
						icon={FileTextIcon}
						iconClassName="text-blue-700"
						position={iconPositions["about-me"]}
					/>
					<IntroWindow />
					<AboutMeWindow />
				</DndContext>
			</div>
		</div>
	);
}
