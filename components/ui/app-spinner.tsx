import { RefreshCw } from "lucide-react";
import { type SpinnerProps, spinnerVariants } from "@/lib/component-variants";
import { cn } from "@/lib/utils";

export interface AppSpinnerProps extends SpinnerProps {
	/** Optional label text to display below the spinner */
	label?: string;
	/** Color theme of the label text */
	labelColor?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
	/** Additional className for the base wrapper */
	className?: string;
}

export function AppSpinner({ label, size = "md", color = "primary", variant = "dots", labelColor = "default", className }: AppSpinnerProps) {
	const getLabelColorClass = (labelColor: string) => {
		switch (labelColor) {
			case "primary":
				return "text-primary text-left";
			case "secondary":
				return "text-secondary";
			case "success":
				return "text-green-500";
			case "warning":
				return "text-yellow-500";
			case "danger":
				return "text-destructive";
			default:
				return "text-muted-foreground";
		}
	};

	const renderSpinner = () => {
		const baseClasses = cn(spinnerVariants({ size, color, variant }));

		switch (variant) {
			case "gradient":
				return (
					<div className={cn("relative", baseClasses)}>
						<div
							className="w-full h-full border-2 border-transparent rounded-full animate-spin bg-gradient-conic from-transparent via-current to-transparent"
							style={{ background: "conic-gradient(from 0deg, transparent, currentColor, transparent)" }}
						/>
						<div className="absolute inset-0.5 bg-background rounded-full" />
					</div>
				);

			case "wave":
				return (
					<div className={cn("flex gap-1 items-center", baseClasses)}>
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className="w-1 h-1 bg-current rounded-full animate-pulse"
								style={{
									animationDelay: `${i * 0.16}s`,
									animationDuration: ".8s",
									animationIterationCount: "infinite",
								}}
							/>
						))}
					</div>
				);

			case "dots":
				return (
					<div className={cn("flex gap-1 items-center", baseClasses)}>
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="w-2 h-2 bg-current rounded-full animate-bounce"
								style={{
									animationDelay: `${i * 0.16}s`,
									animationDuration: "1.4s",
								}}
							/>
						))}
					</div>
				);

			case "spinner":
				return (
					<div className={cn("relative", baseClasses)}>
						{[...Array(12)].map((_, i) => (
							<div
								key={i}
								className="absolute w-0.5 h-1/4 bg-current rounded-sm left-1/2 top-1/2 origin-bottom animate-pulse"
								style={{
									transform: `rotate(${i * 30}deg) translate(-50%)`,
									animationDelay: `${i * 0.1}s`,
									animationDuration: "1.2s",
								}}
							/>
						))}
					</div>
				);

			default:
				return <RefreshCw className={baseClasses} />;
		}
	};

	return (
		<div className={cn("flex flex-col items-center justify-center gap-3", className)}>
			<div className="flex items-center justify-center">{renderSpinner()}</div>
			{label && <span className={cn("text-sm text-center mt-2", getLabelColorClass(labelColor))}>{label}</span>}
		</div>
	);
}
