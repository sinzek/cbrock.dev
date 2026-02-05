import type { Window, WindowConfig } from "@/components/desktop/windows/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DEFAULT_WINDOW_SIZE, MAX_WINDOW_SIZE, MIN_WINDOW_SIZE } from "./constants";

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
				`${strManip(cfg.id, "shift")}:${cfg.pos.x}:${cfg.pos.y}:${cfg.size.width}:${cfg.size.height}:${cfg.open ? 1 : 0}`,
		)
		.join("|");
}

function deserializeWindowParams(param: string): WindowConfig[] {
	if (!param) return [];
	return param.split("|").map(part => {
		const [id, xStr, yStr, widthStr, heightStr, openStr] = part.split(":");
		return {
			id: strManip(id, "unshift") as Window,
			pos: { x: parseInt(xStr, 10), y: parseInt(yStr, 10) },
			size: {
				width: parseInt(widthStr, 10) || DEFAULT_WINDOW_SIZE.width,
				height: parseInt(heightStr, 10) || DEFAULT_WINDOW_SIZE.height,
			},
			open: openStr === "1",
		};
	});
}

function getMiddleOfScreenPos(windowSize: { width: number; height: number }) {
	if (typeof window === "undefined") {
		return { x: 0, y: 0 };
	}

	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight - 60; // Account for taskbar height

	return {
		x: Math.max(0, (screenWidth - windowSize.width) / 2),
		y: Math.max(0, (screenHeight - windowSize.height) / 2),
	};
}

export function useWindowManager() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const windowsParam = searchParams.get("windows");
	const [windows, setWindows] = useState<WindowConfig[]>([]);
	const [focusedWindowId, setFocusedWindowId] = useState<Window | null>(null);
	const isUpdatingFromDrag = useRef(false);
	const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	function isWindowOpen(windowId: Window) {
		return windows.some(w => w.id === windowId && w.open);
	}

	function openWindow(windowId: Window) {
		if (isWindowOpen(windowId)) return;

		const existingWindow = windows.find(w => w.id === windowId);
		let newWindowState: WindowConfig[];
		let startingPos = getMiddleOfScreenPos(DEFAULT_WINDOW_SIZE);

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
					}
				:	w,
			);
		} else {
			newWindowState = [...windows, { id: windowId, pos: startingPos, size: DEFAULT_WINDOW_SIZE, open: true }];
		}

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
			const newWindowState = windows.map(w => (w.id === windowId ? { ...w, open: false, pos, size } : w));
			setWindows(newWindowState);
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
		return { id: windowId, pos: getMiddleOfScreenPos(DEFAULT_WINDOW_SIZE), size: DEFAULT_WINDOW_SIZE, open: false };
	}

	function useWindow(windowId: Window) {
		return (
			windows.find(w => w.id === windowId) || {
				id: windowId,
				pos: getMiddleOfScreenPos(DEFAULT_WINDOW_SIZE),
				size: DEFAULT_WINDOW_SIZE,
				open: false,
			}
		);
	}

	useLayoutEffect(() => {
		if (isUpdatingFromDrag.current) return;

		if (!windowsParam) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setWindows([]);
			return;
		}

		setWindows(deserializeWindowParams(windowsParam));
	}, [windowsParam, setWindows]);

	useEffect(() => {
		console.log(`windows: ${JSON.stringify(windows)}`);
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
	};
}
