function Stepper({ step }: { step: string }) {
	return <span className="bg-secondary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">{step ?? 1}</span>
}

export default Stepper
