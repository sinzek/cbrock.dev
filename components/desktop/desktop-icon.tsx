import { cn } from "@/lib/general";
import { useDraggable } from "@dnd-kit/core";
import type { Icon } from "@phosphor-icons/react";

interface DesktopIconProps {
	id: string;
	label: string;
	onClick: () => void;
	icon: Icon;
	iconClassName?: string;
	position: {
		x: number;
		y: number;
	};
}

export function DesktopIcon({ id, label, onClick, icon, iconClassName, position }: DesktopIconProps) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id,
	});

	if (!position) return null;

	const x = position.x + (transform?.x ?? 0);
	const y = position.y + (transform?.y ?? 0);

	const style: React.CSSProperties = {
		position: "absolute",
		left: 0,
		top: 0,
		transform: `translate3d(${x}px, ${y}px, 0)`,
		transformOrigin: "center",
		transition: "drop-shadow 0.3s ease, filter 0.3s ease",
	};

	const IconComponent = icon;

	return (
		<div
			suppressHydrationWarning
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={cn(
				"flex flex-col group items-center justify-center size-20 select-none cursor-pointer",
				isDragging && "cursor-grabbing drop-shadow-sm",
			)}
			onClick={onClick}
		>
			<div
				className={cn(
					"transition-transform duration-300 flex flex-col items-center justify-center",
					isDragging && "scale-105 rotate-[4deg]",
				)}
			>
				<IconComponent className={cn("w-12 h-12 mx-auto mb-1", iconClassName)} weight="fill" />
				<span
					className={cn(
						"text-center font-sans rounded-sm whitespace-nowrap px-1 py-px text-sm bg-base-300 group-hover:bg-base-100 font-medium text-base-content group-hover:text-primary-content",
						isDragging && "bg-base-100",
					)}
				>
					{label}
				</span>
			</div>
		</div>
	);
}
