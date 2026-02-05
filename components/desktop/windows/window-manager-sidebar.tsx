"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/general";
import { AppWindowIcon, FileTextIcon, SidebarIcon, XIcon, type Icon } from "@phosphor-icons/react";
import { SIDEBAR_MANAGER_WIDTH } from "./constants";
import type { Window } from "./types";
import { useWindowContext } from "./window-context";

function getIconFromExtension(windowId: Window): Icon {
	const extension = windowId.split(".").pop()?.toLowerCase();

	if (!extension) return AppWindowIcon;

	switch (extension) {
		case "txt":
		case "md":
		case "pdf":
			return FileTextIcon;
		case "jpg":
		case "jpeg":
		case "png":
			return AppWindowIcon;
		default:
			return AppWindowIcon;
	}
}

export function WindowManagerSidebar() {
	const {
		windows,
		closeWindow,
		windowManagerSidebarOpen: open,
		setWindowManagerSidebarOpen: setOpen,
		setFocusedWindowId,
		focusedWindowId,
		setWindowMinimized,
	} = useWindowContext();

	const openWindows = Object.values(windows).filter(w => w.open);

	return (
		<div
			className={cn(
				"z-1002 transition-[right,opacity] shadow-xl duration-200 absolute top-2 bottom-2 bg-base-100 border border-neutral/50 rounded-sm",
				open ? "opacity-100 pointer-events-auto right-2" : "opacity-0 pointer-events-none -right-48",
			)}
			style={{
				width: SIDEBAR_MANAGER_WIDTH,
			}}
		>
			<div className="p-3 flex items-center justify-between border-b border-b-neutral/50 bg-base-300 rounded-t-sm">
				<h2 className="text-base/none font-medium font-sans">Active Windows</h2>
				<div className="tooltip tooltip-bottom" data-tip="Hide">
					<Button onClick={() => setOpen(false)}>
						<SidebarIcon size={18} className="rotate-180" />
					</Button>
				</div>
			</div>
			<div className="w-full flex-1 p-3">
				{openWindows.length === 0 ?
					<p className="text-sm text-neutral">No active windows</p>
				:	<ul className="space-y-2">
						{openWindows.map(window => {
							const IconComponent = getIconFromExtension(window.id);
							return (
								<li
									key={window.id}
									role="button"
									tabIndex={0}
									className={cn(
										"relative btn btn-md py-0 h-8 bg-primary/10 border-transparent hover:border-transparent font-bold w-full justify-start",
										focusedWindowId === window.id && !window.minimized ?
											"bg-blue-500/30 border-blue-500 hover:border-blue-500"
										:	"hover:bg-blue-500/15",
									)}
									onClick={() => {
										setFocusedWindowId(window.id);
										setWindowMinimized(window.id, false);
									}}
									onKeyDown={e => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											setFocusedWindowId(window.id);
											setWindowMinimized(window.id, false);
										}
									}}
								>
									<span
										className={cn(
											"flex flex-row items-center gap-2",
											window.minimized && "italic text-base-content/50",
										)}
									>
										<IconComponent className="size-4.5" />
										{window.id}
									</span>
									<button
										className="btn btn-sm p-0 size-6 bg-transparent border-transparent hover:bg-base-200 active:bg-base-300 hover:border-neutral/50 absolute top-1/2 -translate-y-1/2 hover:-translate-y-1/2 right-1"
										onClick={e => {
											e.stopPropagation();
											closeWindow(window.id);
										}}
									>
										<span className="sr-only">Close {window.id}</span>
										<XIcon className="size-4" />
									</button>
								</li>
							);
						})}
					</ul>
				}
			</div>
		</div>
	);
}
