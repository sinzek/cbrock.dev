import type { Window, WindowConfig } from "@/components/desktop/windows/types";
import { NAVBAR_HEIGHT } from "@/constants/general";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DEFAULT_WINDOW_SIZE, MAX_WINDOW_SIZE, MIN_WINDOW_SIZE, SIDEBAR_MANAGER_WIDTH } from "./constants";
import { getMiddleOfScreenPos } from "./utils";

function strManip(str: string, mode: "shift" | "unshift"): string {
	let result = "";
	for (let i = 0; i < str.length; i++) {
		result += String.fromCharCode(str.charCodeAt(i) + (mode === "shift" ? 1 : -1));
	}
	return result;
}

function serializeWindowParams(windowCfg: WindowConfig[]) {
	return windowCfg
		.map(
			cfg =>
				`${strManip(cfg.id, "shift")}:${cfg.pos.x}:${cfg.pos.y}:${cfg.size.width}:${cfg.size.height}:${cfg.open ? 1 : 0}:${cfg.minimized ? 1 : 0}`,
		)
		.join("|");
}

function deserializeWindowParams(param: string): WindowConfig[] {
	if (!param) return [];
	return param.split("|").map(part => {
		const [id, xStr, yStr, widthStr, heightStr, openStr, minimizedStr] = part.split(":");
		return {
			id: strManip(id, "unshift") as Window,
			pos: { x: parseInt(xStr, 10), y: parseInt(yStr, 10) },
			size: {
				width: parseInt(widthStr, 10) || DEFAULT_WINDOW_SIZE.width,
				height: parseInt(heightStr, 10) || DEFAULT_WINDOW_SIZE.height,
			},
			open: openStr === "1",
			minimized: minimizedStr === "1",
		};
	});
}

export function useWindowManager() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const windowsParam = searchParams.get("windows");
	const [windows, setWindows] = useState<WindowConfig[]>([]);
	const [focusedWindowId, setFocusedWindowId] = useState<Window | null>(null);
	const isUpdatingFromDrag = useRef(false);
	const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [windowManagerSidebarOpen, _setWindowManagerSidebarOpen] = useState(false);

	function isWindowOpen(windowId: Window) {
		return windows.some(w => w.id === windowId && w.open);
	}

	function openWindow(windowId: Window) {
		if (isWindowOpen(windowId)) {
			setFocusedWindowId(windowId);
			setWindowMinimized(windowId, false);
			return;
		}

		const existingWindow = windows.find(w => w.id === windowId);
		let newWindowState: WindowConfig[];
		let startingPos = getMiddleOfScreenPos(DEFAULT_WINDOW_SIZE);

		if (typeof window !== "undefined") {
			const maxX = window.innerWidth - DEFAULT_WINDOW_SIZE.width;
			const maxY = window.innerHeight - DEFAULT_WINDOW_SIZE.height;
			startingPos = {
				x: Math.max(0, Math.min(startingPos.x, maxX)),
				y: Math.max(NAVBAR_HEIGHT - 1, Math.min(startingPos.y, maxY)),
			};
		}

		const offset = 30;
		let attempts = 0;
		const maxAttempts = 20; // prevent infinite loop

		while (
			attempts < maxAttempts &&
			windows.some(
				w =>
					w.open &&
					w.id !== windowId && // don't check against the window we're opening
					Math.abs(w.pos.x - startingPos.x) < offset &&
					Math.abs(w.pos.y - startingPos.y) < offset,
			)
		) {
			startingPos = { x: startingPos.x + offset, y: startingPos.y + offset };
			attempts++;
		}

		if (existingWindow) {
			newWindowState = windows.map(w =>
				w.id === windowId ?
					{
						id: windowId,
						pos: startingPos,
						size: DEFAULT_WINDOW_SIZE,
						open: true,
						minimized: false,
					}
				:	w,
			);
		} else {
			newWindowState = [
				...windows,
				{ id: windowId, pos: startingPos, size: DEFAULT_WINDOW_SIZE, open: true, minimized: false },
			];
		}

		setWindows(newWindowState);

		const newParams = new URLSearchParams(searchParams.toString());

		newParams.set("windows", serializeWindowParams(newWindowState));
		const newUrl = `${window.location.pathname}?${newParams.toString()}`;
		router.replace(newUrl);

		setFocusedWindowId(windowId);
	}

	function closeWindow(windowId: Window) {
		if (!isWindowOpen(windowId)) return;
		const newWindowState = windows.map(w => (w.id === windowId ? { ...w, open: false } : w));
		setWindows(newWindowState);

		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set("windows", serializeWindowParams(newWindowState));
		const newUrl = `${window.location.pathname}?${newParams.toString()}`;
		router.replace(newUrl);

		setFocusedWindowId(null);

		// reset position and size after animation
		setTimeout(() => {
			const pos = getMiddleOfScreenPos(DEFAULT_WINDOW_SIZE);
			const size = DEFAULT_WINDOW_SIZE;
			const windowStateAfterClose = windows.map(w => (w.id === windowId ? { ...w, open: false, pos, size } : w));
			setWindows(windowStateAfterClose);
		}, 300);
	}

	const updateUrlParams = useCallback(
		(updatedWindows: WindowConfig[]) => {
			const newParams = new URLSearchParams(searchParams.toString());
			newParams.set("windows", serializeWindowParams(updatedWindows));
			const newUrl = `${window.location.pathname}?${newParams.toString()}`;
			router.replace(newUrl, { scroll: false });
		},
		[router, searchParams],
	);

	function updateWindowPos(windowId: Window, newPos: { x: number; y: number }) {
		isUpdatingFromDrag.current = true;
		const updatedWindows = windows.map(w => (w.id === windowId ? { ...w, pos: newPos } : w));
		setWindows(updatedWindows);
		updateUrlParams(updatedWindows);

		setTimeout(() => {
			isUpdatingFromDrag.current = false;
		}, 100);
	}

	function updateWindowSize(windowId: Window, newSize: { width: number; height: number }) {
		isUpdatingFromDrag.current = true;
		const clampedSize = {
			width: Math.max(MIN_WINDOW_SIZE.width, Math.min(newSize.width, MAX_WINDOW_SIZE.width)),
			height: Math.max(MIN_WINDOW_SIZE.height, Math.min(newSize.height, MAX_WINDOW_SIZE.height)),
		};
		const updatedWindows = windows.map(w => (w.id === windowId ? { ...w, size: clampedSize } : w));
		setWindows(updatedWindows);

		if (resizeTimeoutRef.current) {
			clearTimeout(resizeTimeoutRef.current);
		}
		resizeTimeoutRef.current = setTimeout(() => {
			updateUrlParams(updatedWindows);
			isUpdatingFromDrag.current = false;
		}, 150);
	}

	function updateWindowSizeAndPos(
		windowId: Window,
		newSize: { width: number; height: number },
		newPos: { x: number; y: number },
	) {
		isUpdatingFromDrag.current = true;
		const clampedSize = {
			width: Math.max(MIN_WINDOW_SIZE.width, Math.min(newSize.width, MAX_WINDOW_SIZE.width)),
			height: Math.max(MIN_WINDOW_SIZE.height, Math.min(newSize.height, MAX_WINDOW_SIZE.height)),
		};
		const updatedWindows = windows.map(w => (w.id === windowId ? { ...w, size: clampedSize, pos: newPos } : w));
		setWindows(updatedWindows);

		if (resizeTimeoutRef.current) {
			clearTimeout(resizeTimeoutRef.current);
		}
		resizeTimeoutRef.current = setTimeout(() => {
			updateUrlParams(updatedWindows);
			isUpdatingFromDrag.current = false;
		}, 150);
	}

	function getWindow(windowId: Window): WindowConfig {
		const found = windows.find(w => w.id === windowId);
		if (found) return found;
		return {
			id: windowId,
			pos: getMiddleOfScreenPos(DEFAULT_WINDOW_SIZE),
			size: DEFAULT_WINDOW_SIZE,
			open: false,
			minimized: false,
		};
	}

	function useWindow(windowId: Window): WindowConfig {
		return (
			windows.find(w => w.id === windowId) || {
				id: windowId,
				pos: getMiddleOfScreenPos(DEFAULT_WINDOW_SIZE),
				size: DEFAULT_WINDOW_SIZE,
				open: false,
				minimized: false,
			}
		);
	}

	function setWindowMinimized(windowId: Window, minimized: boolean) {
		const updatedWindows = windows.map(w => (w.id === windowId ? { ...w, minimized } : w));
		setWindows(updatedWindows);
		updateUrlParams(updatedWindows);
	}

	const setWindowManagerSidebarOpen = useCallback(
		(open: boolean) => {
			_setWindowManagerSidebarOpen(open);
			// if there's a window clipping the sidebar, push it over
			if (open) {
				const pushoverWidth = SIDEBAR_MANAGER_WIDTH + 20; // extra 20px buffer

				const updatedWindows = windows.map(w => {
					if (
						w.pos.x + w.size.width > window.innerWidth - pushoverWidth &&
						w.open &&
						!w.minimized &&
						w.pos.x !== 0
					) {
						return {
							...w,
							pos: {
								x: Math.max(0, window.innerWidth - pushoverWidth - w.size.width),
								y: w.pos.y,
							},
						};
					}
					return w;
				});
				setWindows(updatedWindows);
				updateUrlParams(updatedWindows);
			}
		},
		[windows, updateUrlParams],
	);

	useLayoutEffect(() => {
		if (isUpdatingFromDrag.current || typeof window === "undefined") return;

		if (!windowsParam) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setWindows([]);
			return;
		}

		const params = deserializeWindowParams(windowsParam);

		// bound positions to window size
		const boundedParams = params.map(cfg => {
			const maxX = window.innerWidth - cfg.size.width;
			const maxY = window.innerHeight - cfg.size.height;

			return {
				...cfg,
				pos: {
					x: Math.max(0, Math.min(cfg.pos.x, maxX)),
					y: Math.max(NAVBAR_HEIGHT - 1, Math.min(cfg.pos.y, maxY)),
				},
			};
		});

		setWindows(boundedParams);
	}, [windowsParam, setWindows]);

	useEffect(() => {
		console.log("Windows state changed:", windows);
	}, [windows]);

	return {
		windows,
		isWindowOpen,
		openWindow,
		closeWindow,
		useWindow,
		getWindow,
		updateWindowPos,
		updateWindowSize,
		updateWindowSizeAndPos,
		focusedWindowId,
		setFocusedWindowId,
		setWindowMinimized,
		windowManagerSidebarOpen,
		setWindowManagerSidebarOpen,
	};
}
