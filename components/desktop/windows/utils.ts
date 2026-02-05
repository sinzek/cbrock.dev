import { NAVBAR_HEIGHT } from "@/constants/general";
import { MAX_WINDOW_SIZE, MIN_WINDOW_SIZE } from "./constants";
import type { WindowConfig, WindowResizeDir } from "./types";

export function calcNewSizeAndPosFromResize(
	moveEvent: MouseEvent,
	direction: WindowResizeDir,
	startSize: { width: number; height: number },
	startPos: { x: number; y: number },
	startWindowPos: { x: number; y: number },
	cfg: WindowConfig,
): { size: { width: number; height: number }; pos: { x: number; y: number } } {
	const deltaX = moveEvent.clientX - startPos.x;
	const deltaY = moveEvent.clientY - startPos.y;

	// for westward resizing, width increases when moving left (negative deltaX)
	const isWestResize = direction === "w" || direction === "sw";
	const widthDelta = isWestResize ? -deltaX : deltaX;

	const newWidth = Math.max(MIN_WINDOW_SIZE.width, Math.min(startSize.width + widthDelta, MAX_WINDOW_SIZE.width));
	const newHeight = Math.max(MIN_WINDOW_SIZE.height, Math.min(startSize.height + deltaY, MAX_WINDOW_SIZE.height));

	const actualWidthChange = newWidth - startSize.width;

	return {
		size: {
			width:
				direction === "e" || direction === "se" || direction === "w" || direction === "sw" ?
					newWidth
				:	cfg.size.width,
			height: direction === "s" || direction === "se" || direction === "sw" ? newHeight : cfg.size.height,
		},
		pos: {
			x: isWestResize ? startWindowPos.x - actualWidthChange : startWindowPos.x,
			y: startWindowPos.y,
		},
	};
}

export function getMiddleOfScreenPos(windowSize: { width: number; height: number }) {
	if (typeof window === "undefined") {
		return { x: 50, y: 50 };
	}

	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight;

	return {
		x: Math.max(0, (screenWidth - windowSize.width) / 2),
		y: Math.max(NAVBAR_HEIGHT + 20, (screenHeight - windowSize.height) / 2),
	};
}
