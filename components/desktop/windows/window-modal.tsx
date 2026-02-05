import type { WindowConfig, WindowResizeDir } from "@/components/desktop/windows/types";
import { useWindowContext } from "@/components/desktop/windows/window-context";
import { NAVBAR_HEIGHT } from "@/constants/general";
import { cn } from "@/lib/general";
import { useDraggable } from "@dnd-kit/core";
import { CaretDownIcon, CornersInIcon, MinusIcon, SquareHalfIcon, SquareIcon, XIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_WINDOW_SIZE, MAX_WINDOW_SIZE, MIN_WINDOW_SIZE } from "./constants";
import { calcNewSizeAndPosFromResize, getMiddleOfScreenPos } from "./utils";

interface WindowModalProps {
	open: boolean;
	close: () => void;
	cfg: WindowConfig;
	children: React.ReactNode;
}

export function WindowModal({ open, close, cfg, children }: WindowModalProps) {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const isResizingRef = useRef(false);
	const lastKnownSizeAndPos = useRef<{
		size: { width: number; height: number };
		pos: { x: number; y: number };
	} | null>(null);

	const { updateWindowSizeAndPos, setFocusedWindowId, focusedWindowId, setWindowMinimized } = useWindowContext();
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: `window-modal-${cfg.id}`,
		disabled: isResizing || isFullscreen,
	});

	const startSize = useRef({ width: 0, height: 0 });
	const startPos = useRef({ x: 0, y: 0 });

	const handleResizeStart = useCallback(
		(e: React.MouseEvent, direction: WindowResizeDir) => {
			e.preventDefault();
			e.stopPropagation();
			setIsResizing(true);
			isResizingRef.current = true;
			startSize.current = { width: cfg.size.width, height: cfg.size.height };
			startPos.current = { x: e.clientX, y: e.clientY };
			const startWindowPos = { x: cfg.pos.x, y: cfg.pos.y };

			const handleMouseMove = (moveEvent: MouseEvent) => {
				if (!isResizingRef.current) return;

				const { size, pos } = calcNewSizeAndPosFromResize(
					moveEvent,
					direction,
					startSize.current,
					startPos.current,
					startWindowPos,
					cfg,
				);

				updateWindowSizeAndPos(cfg.id, size, pos);
			};

			const handleMouseUp = () => {
				setIsResizing(false);
				isResizingRef.current = false;
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		},
		[cfg, updateWindowSizeAndPos],
	);

	function toggleFullscreen() {
		if (typeof window === "undefined") return;

		if (isFullscreen) {
			if (lastKnownSizeAndPos.current) {
				const saved = lastKnownSizeAndPos.current;
				const screenWidth = window.innerWidth;
				const screenHeight = window.innerHeight;

				const maxWidth = screenWidth - 60;
				const maxHeight = screenHeight - NAVBAR_HEIGHT - 60;
				const newWidth = Math.min(saved.size.width, maxWidth);
				const newHeight = Math.min(saved.size.height, maxHeight);

				const minX = 0;
				const minY = NAVBAR_HEIGHT + 20;
				const maxX = screenWidth - newWidth;
				const maxY = screenHeight - newHeight;

				const newX = Math.max(minX, Math.min(saved.pos.x, maxX));
				const newY = Math.max(minY, Math.min(saved.pos.y, maxY));

				updateWindowSizeAndPos(cfg.id, { width: newWidth, height: newHeight }, { x: newX, y: newY });
			}
			setIsFullscreen(false);
			return;
		}

		lastKnownSizeAndPos.current = { size: { ...cfg.size }, pos: { ...cfg.pos } };

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight - NAVBAR_HEIGHT + 1; // account for taskbar height

		updateWindowSizeAndPos(cfg.id, { width: screenWidth, height: screenHeight }, { x: 0, y: NAVBAR_HEIGHT - 1 });
		setIsFullscreen(true);
	}

	function fillHalfScreen(side: "left" | "right") {
		if (typeof window === "undefined") return;

		if (isFullscreen) {
			setIsFullscreen(false);
		}

		lastKnownSizeAndPos.current = { size: { ...cfg.size }, pos: { ...cfg.pos } };

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight - NAVBAR_HEIGHT + 1; // account for taskbar height

		updateWindowSizeAndPos(
			cfg.id,
			{ width: screenWidth / 2, height: screenHeight },
			{ x: side === "left" ? 0 : screenWidth / 2, y: NAVBAR_HEIGHT - 1 },
		);
	}

	function toggleMinimize() {
		setWindowMinimized(cfg.id, !cfg.minimized);
	}

	const style: React.CSSProperties = useMemo(() => {
		if (!isMounted) {
			return {
				position: "absolute",
				visibility: "hidden",
			};
		}

		const shouldAnimate = !isResizing && !transform;
		return {
			position: "absolute",
			left: `${cfg.pos.x + (transform?.x ?? 0)}px`,
			top: cfg.minimized ? `${window.screen.height}px` : `${cfg.pos.y + (transform?.y ?? 0)}px`,
			width: `${cfg.size.width}px`,
			height: `${cfg.size.height}px`,
			transition: shouldAnimate ? "left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease" : "none",
		};
	}, [cfg, transform, isResizing, isMounted]);

	useEffect(() => {
		if (!open) return;

		const handleClickOutsideDropdown = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (dropdownOpen && !target.closest(`#window-modal-${cfg.id}-dropdown`)) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener("mouseup", handleClickOutsideDropdown);
		return () => {
			document.removeEventListener("mouseup", handleClickOutsideDropdown);
		};
	}, [open, dropdownOpen, cfg.id]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true);
	}, []);

	const isNarrow = cfg.size.width <= 450;
	const isQuiteNarrow = cfg.size.width <= 275;

	return (
		<>
			<dialog
				className={cn(
					"modal modal-bottom sm:modal-middle pointer-events-none bg-transparent",
					focusedWindowId === cfg.id && "z-1000", // z-999 is default for modal class
				)}
				open={open}
				style={{ padding: 0 }}
			>
				<div
					suppressHydrationWarning
					data-window-id={cfg.id}
					ref={setNodeRef}
					{...attributes}
					className={cn(
						"modal-box overflow-visible bg-base-100/50 backdrop-blur-md w-auto h-auto max-w-none max-h-none border rounded-sm pointer-events-auto shadow-lg shadow-accent-content/15 border-neutral/35 absolute p-0 flex flex-col",
						isFullscreen && "rounded-none",
						open ? "window-enter" : "window-exit",
					)}
					data-state={open ? "open" : "closed"}
					style={style}
					onMouseDown={() => setFocusedWindowId(cfg.id)}
				>
					<div
						{...listeners}
						className={cn(
							"flex select-none cursor-move items-center justify-between bg-primary/25 pl-6 pr-1 py-1 border-b border-b-neutral/20 shrink-0 overflow-visible",
							isFullscreen && "cursor-default",
						)}
						onDoubleClick={() => {
							toggleFullscreen();
						}}
					>
						{!isNarrow && (
							<div className="flex items-center gap-2">
								<p className="font-medium font-mono leading-none p-1 text-xs bg-base-300 border border-neutral/50 rounded-sm">
									x:{cfg.pos.x.toFixed(0)} y:{cfg.pos.y.toFixed(0)}
								</p>
							</div>
						)}
						<div className="flex flex-1 items-center justify-center gap-1">
							<details
								className="relative w-full"
								open={dropdownOpen}
								id={`window-modal-${cfg.id}-dropdown`}
							>
								<summary
									onClick={e => {
										e.preventDefault();
										setDropdownOpen(!dropdownOpen);
									}}
									className="flex max-w-fit mx-auto items-center gap-1 list-none cursor-pointer select-none py-1 px-2 rounded hover:bg-base-200 active:bg-base-300"
								>
									<h2 className="font-medium truncate font-mono leading-none text-base">{cfg.id}</h2>
									<CaretDownIcon size={18} />
								</summary>
								<div className="absolute left-1/2 -translate-x-1/2 mt-1.75 z-1001">
									<div className="size-2 bg-base-100 border-l border-t border-neutral/35 rotate-45 absolute -top-1 left-1/2 -translate-x-1/2" />
									<ul className="menu w-52 bg-base-100 shadow-lg rounded-box">
										<li>
											<a
												onClick={() => {
													const mid = getMiddleOfScreenPos(cfg.size);
													setIsFullscreen(false);
													lastKnownSizeAndPos.current = null;
													updateWindowSizeAndPos(cfg.id, DEFAULT_WINDOW_SIZE, mid);
												}}
												className="active:bg-base-content/25 active:text-base-content"
											>
												Reset window position
											</a>
										</li>
										<li>
											<a
												onClick={() => {
													updateWindowSizeAndPos(
														cfg.id,
														{ width: cfg.size.width, height: cfg.size.height + 40 },
														{ x: cfg.pos.x, y: cfg.pos.y },
													);
												}}
												className="active:bg-base-content/25 active:text-base-content data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
												data-disabled={
													cfg.size.height >= MAX_WINDOW_SIZE.height || isFullscreen
												}
											>
												Increase height by 40px
											</a>
										</li>
										<li>
											<a
												onClick={() => {
													setIsFullscreen(false);
													updateWindowSizeAndPos(
														cfg.id,
														{
															width: cfg.size.width,
															height: Math.max(
																cfg.size.height - 40,
																MIN_WINDOW_SIZE.height,
															),
														},
														{ x: cfg.pos.x, y: cfg.pos.y },
													);
												}}
												className="active:bg-base-content/25 active:text-base-content data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
												data-disabled={cfg.size.height <= MIN_WINDOW_SIZE.height}
											>
												Decrease height by 40px
											</a>
										</li>
										<li>
											<a
												onClick={() => {
													setIsFullscreen(false);
													updateWindowSizeAndPos(
														cfg.id,
														{
															width: Math.min(cfg.size.width + 40, MAX_WINDOW_SIZE.width),
															height: cfg.size.height,
														},
														{ x: cfg.pos.x, y: cfg.pos.y },
													);
												}}
												className="active:bg-base-content/25 active:text-base-content data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
												data-disabled={cfg.size.width >= MAX_WINDOW_SIZE.width || isFullscreen}
											>
												Increase width by 40px
											</a>
										</li>
										<li>
											<a
												onClick={() => {
													setIsFullscreen(false);
													updateWindowSizeAndPos(
														cfg.id,
														{
															width: Math.max(cfg.size.width - 40, MIN_WINDOW_SIZE.width),
															height: cfg.size.height,
														},
														{ x: cfg.pos.x, y: cfg.pos.y },
													);
												}}
												className="active:bg-base-content/25 active:text-base-content data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
												data-disabled={cfg.size.width <= MIN_WINDOW_SIZE.width}
											>
												Decrease width by 40px
											</a>
										</li>
										<li>
											<a
												onClick={() => {
													setIsFullscreen(false);
													lastKnownSizeAndPos.current = null;
													close();
												}}
												className="active:bg-base-content/25 active:text-base-content"
											>
												Close window
											</a>
										</li>
									</ul>
								</div>
							</details>
						</div>
						<div className="flex items-center">
							<div
								className={cn(
									"tooltip tooltip-delay",
									isMounted && cfg.pos.y <= NAVBAR_HEIGHT + 30 && "tooltip-bottom",
								)}
								data-tip="Fill left half"
							>
								<button
									className="btn btn-sm p-1.5 bg-transparent border-transparent hover:bg-base-200 active:bg-base-300 hover:border-neutral/50"
									onClick={() => fillHalfScreen("left")}
								>
									<SquareHalfIcon size={20} />
								</button>
							</div>
							<div
								className={cn(
									"tooltip tooltip-delay",
									isMounted && cfg.pos.y <= NAVBAR_HEIGHT + 30 && "tooltip-bottom",
								)}
								data-tip="Fill right half"
							>
								<button
									className="btn btn-sm p-1.5 bg-transparent border-transparent hover:bg-base-200 active:bg-base-300 hover:border-neutral/50"
									onClick={() => fillHalfScreen("right")}
								>
									<SquareHalfIcon className="rotate-180" size={20} />
								</button>
							</div>
							<div
								className={cn(
									"tooltip tooltip-delay data-[disabled=true]:hidden",
									isMounted && cfg.pos.y <= NAVBAR_HEIGHT + 30 && "tooltip-bottom",
								)}
								data-tip={"Minimize"}
								data-disabled={isFullscreen}
							>
								<button
									className="btn btn-sm p-1.5 bg-transparent border-transparent hover:bg-base-200 active:bg-base-300 hover:border-neutral/50"
									onClick={toggleMinimize}
								>
									<MinusIcon size={18} />
								</button>
							</div>
							<div
								className={cn(
									"tooltip tooltip-delay",
									isMounted && cfg.pos.y <= NAVBAR_HEIGHT + 30 && "tooltip-bottom",
								)}
								data-tip={isFullscreen ? "Restore down" : "Maximize"}
							>
								<button
									className="btn btn-sm p-1.5 bg-transparent border-transparent hover:bg-base-200 active:bg-base-300 hover:border-neutral/50"
									onClick={toggleFullscreen}
								>
									{isFullscreen ?
										<CornersInIcon size={18} />
									:	<SquareIcon size={18} />}
								</button>
							</div>
							<button
								className="btn btn-sm p-1.5 bg-transparent border-transparent hover:bg-base-200 active:bg-base-300 hover:border-neutral/50"
								onClick={() => {
									setIsFullscreen(false);
									lastKnownSizeAndPos.current = null;
									close();
								}}
							>
								<XIcon size={18} />
							</button>
						</div>
					</div>
					<div className="flex-1 overflow-hidden bg-base-100 rounded-b-sm">
						<div className="h-full overflow-y-auto">
							<div className="p-6 h-full">{children}</div>
						</div>
					</div>

					{/* bottom-right resize handle */}
					<div
						onMouseDown={e => handleResizeStart(e, "se")}
						className="absolute z-1 bottom-0 right-0 w-4 h-4 cursor-se-resize group data-[disabled=true]:pointer-events-none"
						data-disabled={isFullscreen}
					>
						<svg
							className="w-full h-full text-transparent group-hover:text-neutral transition-colors"
							viewBox="0 0 16 16"
							fill="currentColor"
						>
							<path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14ZM14 6H12V4H14V6ZM10 10H8V8H10V10ZM6 14H4V12H6V14Z" />
						</svg>
					</div>

					{/* right resize handle */}
					<div
						onMouseDown={e => handleResizeStart(e, "e")}
						className="absolute top-0 right-0 w-2 flex items-center group/drag justify-end h-full cursor-e-resize data-[disabled=true]:pointer-events-none"
						data-disabled={isFullscreen}
					>
						<div className="w-0.75 h-full bg-transparent group-hover/drag:bg-blue-400/50 transition-colors rounded" />
					</div>
					{/* bottom resize handle */}
					<div
						onMouseDown={e => handleResizeStart(e, "s")}
						className="absolute bottom-0 flex items-end group/drag left-0 w-full h-2 cursor-s-resize data-[disabled=true]:pointer-events-none"
						data-disabled={isFullscreen}
					>
						<div className="h-0.75 w-full bg-transparent group-hover/drag:bg-blue-400/50 transition-colors rounded" />
					</div>
					{/* left resize handle */}
					<div
						onMouseDown={e => handleResizeStart(e, "w")}
						className="absolute top-0 group/drag flex items-start left-0 w-2 h-full cursor-w-resize data-[disabled=true]:pointer-events-none"
						data-disabled={isFullscreen}
					>
						<div className="w-0.75 h-full bg-transparent group-hover/drag:bg-blue-400/50 transition-colors rounded" />
					</div>
					{/* bottom-left resize handle */}
					<div
						onMouseDown={e => handleResizeStart(e, "sw")}
						className="absolute bottom-0 left-0 w-4 h-4 group cursor-sw-resize data-[disabled=true]:pointer-events-none"
						data-disabled={isFullscreen}
					>
						<svg
							className="w-full h-full text-transparent group-hover:text-neutral transition-colors"
							viewBox="0 0 16 16"
							fill="currentColor"
						>
							<path d="M2 14H4V12H2V14ZM2 10H4V8H2V10ZM6 14H8V12H6V14ZM2 6H4V4H2V6ZM6 10H8V8H6V10ZM10 14H12V12H10V14Z" />
						</svg>
					</div>
				</div>
			</dialog>
		</>
	);
}
