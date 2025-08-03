interface DateIndicatorProps {
	indicator: Date
	label: string
}

function DateIndicator({ indicator, label }: DateIndicatorProps): React.ReactElement {
	return (
		<div className="mt-2 text-xs text-muted-foreground">
			{label}: {indicator.toLocaleDateString()}
		</div>
	)
}

export default DateIndicator
