import { Loader2 } from "lucide-react";

function ComponentSpinner({ label, isLabel = false }: { label?: string; isLabel?: boolean }): React.ReactElement {
	return (
		<div className="flex items-center justify-center py-8">
			<Loader2 className="w-4 h-4 animate-spin" aria-label={label} />
			{isLabel && <span className="ml-2">{label ? `Loading ${label}...` : isLabel ? "Loading..." : null}</span>}
		</div>
	);
}

export default ComponentSpinner;
