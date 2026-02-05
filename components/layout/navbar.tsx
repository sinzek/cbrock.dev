"use client";

import { CHASE_EMAIL, NAVBAR_HEIGHT } from "@/constants/general";
import { ArrowUpRightIcon, BrowsersIcon, type Icon } from "@phosphor-icons/react";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import { useWindowContext } from "../desktop/windows/window-context";

type NavItem =
	| {
			type: "link";
			label?: string;
			icon?: Icon;
			href: string;
	  }
	| {
			type: "action";
			label?: string;
			icon?: Icon;
			onClick: MouseEventHandler<HTMLButtonElement>;
	  };

const navItems: NavItem[] = [
	{
		type: "link",
		label: "Home",
		href: "/",
	},
	{
		type: "link",
		label: "Resume",
		href: "/resume-chasebrock.pdf",
	},
	{
		type: "link",
		label: "GitHub",
		href: "https://github.com/sinzek",
	},
	{
		type: "link",
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/chasepbrock",
	},
	{
		type: "link",
		label: "Email Me",
		href: `mailto:${CHASE_EMAIL}`,
	},
];

export function Navbar() {
	const { windows, windowManagerSidebarOpen, setWindowManagerSidebarOpen } = useWindowContext();
	const openWindows = Object.values(windows).filter(w => w.open);

	return (
		<nav
			className="navbar justify-between z-10 bg-base-200 px-4 border-b border-b-neutral/35"
			style={{
				height: `${NAVBAR_HEIGHT}px`,
				minHeight: `${NAVBAR_HEIGHT}px`,
				maxHeight: `${NAVBAR_HEIGHT}px`,
			}}
		>
			<div className="flex items-center">
				<div className="mr-6">
					<Link href="/" className="text-base-content text-xl uppercase font-mono font-medium">
						Chase Brock
					</Link>
				</div>
				<div className="flex-none gap-2">
					{navItems.map((item, index) => (
						<NavItem key={index} item={item} />
					))}
				</div>
			</div>
			<div className="flex items-center">
				<NavItem
					item={{
						type: "action",
						label:
							openWindows.length > 0 ?
								`${openWindows.length} Window${openWindows.length > 1 ? "s" : ""}`
							:	"Window Manager",
						icon: BrowsersIcon,
						onClick: () => setWindowManagerSidebarOpen(!windowManagerSidebarOpen),
					}}
				/>
			</div>
		</nav>
	);
}

function NavItem({ item }: { item: NavItem }) {
	const className =
		"btn btn-sm btn-outline border-transparent hover:border-neutral/50 bg-transparent hover:bg-base-300";

	return (
		<>
			{item.type === "action" ?
				<button className={className} onClick={item.onClick}>
					{item.icon && <item.icon className="size-4.5" />}
					{item.label}
				</button>
			:	<a
					href={item.href}
					className={className}
					target={item.href.startsWith("http") ? "_blank" : "_self"}
					rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
				>
					{item.icon && <item.icon className="size-4.5" />}
					{item.label}
					{item.href.startsWith("http") && <ArrowUpRightIcon weight="bold" />}
				</a>
			}
		</>
	);
}
