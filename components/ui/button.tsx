import { cn } from "@/lib/general";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={cn(
				"btn btn-sm p-1.5 bg-transparent border-transparent hover:bg-base-200 active:bg-base-300 hover:border-neutral/50",
				className,
			)}
			{...props}
		>
			{props.children}
		</button>
	);
}
