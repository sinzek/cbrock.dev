"use client";

import { CHASE_EMAIL } from "@/constants/general";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

type NavItem =
	| {
			type: "link";
			label: string;
			href: string;
	  }
	| {
			type: "action";
			label: string;
			onClick: (e: MouseEvent) => void;
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
	return (
		<nav className="navbar z-10 bg-base-200 px-4 border-b border-b-neutral/35 min-h-12">
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
		</nav>
	);
}

function NavItem({ item }: { item: NavItem }) {
	return (
		<>
			{item.type === "action" ?
				<button className="btn btn-sm">{item.label}</button>
			:	<a
					href={item.href}
					className="btn btn-sm btn-outline border-transparent hover:border-neutral/50 bg-transparent hover:bg-base-300"
					target={item.href.startsWith("http") ? "_blank" : "_self"}
					rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
				>
					{item.label}
					{item.href.startsWith("http") && <ArrowUpRightIcon weight="bold" />}
				</a>
			}
		</>
	);
}
