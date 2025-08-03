import { cva, type VariantProps } from "class-variance-authority"

// Background variants - using clean utility classes
export const backgroundVariants = cva("", {
	variants: {
		variant: {
			linear: "bg-linear-gradient",
			linearSecondary: "bg-linear-gradient-secondary",
			radial: "bg-radial-gradient",
			radialSecondary: "bg-radial-gradient-secondary",
			glass: "bg-[var(--color-background-glass)]",
			secondary: "bg-[var(--color-secondary-background)]",
			primary: "bg-[var(--color-background)]",
			transparent: "bg-transparent",
		},
	},
})

// Typography variants - unified text styling system
export const typographyVariants = cva("", {
	variants: {
		variant: {
			h1: "font-heading text-h1 font-bold text-foreground",
			h2: "font-heading text-h2 font-bold text-foreground",
			h3: "font-heading text-h3 font-semibold text-foreground",
			h4: "font-heading text-h4 font-semibold text-foreground",
			h5: "font-heading text-h5 font-semibold text-foreground",
			body: "font-body text-body text-foreground",
			"body-sm": "font-body text-[var(--text-body-sm)] text-muted-foreground",
			muted: "text-[var(--text-body-sm)] text-muted-foreground",
			link: "text-[var(--text-body-sm)] text-link",
			button: "text-[var(--text-body-sm)] text-button",
			label: "text-[var(--text-body-sm)] text-label",
			caption: "text-[var(--text-body-sm)] text-caption",
			small: "text-[var(--text-body-sm)] text-small",
		},
		size: {
			default: "text-body",
			xs: "text-[var(--text-body-xs)]",
			xxs: "text-[var(--text-body-xs)]",
			sm: "text-[var(--text-body-sm)]",
			md: "text-[var(--text-body)]",
			lg: "text-[var(--text-h3)]",
			xl: "text-[var(--text-h2)]",
			xxl: "text-[var(--text-h1)]",
		},
	},
	defaultVariants: {
		variant: "body",
		size: "default",
	},
})

// Card variants - ONE unified card system to replace all your different card implementations
export const cardVariants = cva("rounded-2xl border transition-all duration-200", {
	variants: {
		variant: {
			default: "border bg-card text-card-foreground",
			glass: "bg-glass border-white/10 bg-card/95 backdrop-blur-md shadow-glass",
			episode: "border bg-linear-to-br from-card/80 via-accent/20 to-muted shadow-episode cursor-pointer hover:shadow-lg hover:scale-[1.02]",
			bundle: "border bg-dialog-bg text-card-foreground hover:bg-card/25 cursor-pointer hover:shadow-lg backdrop-blur-md hover:-translate-y-0.5",
		},
		selected: {
			true: "border-2 border-accent-selection-border bg-gradient-to-br from-accent-selection-bg to-card shadow-lg shadow-accent-selection-bg/20",
			false: "",
		},
		hoverable: {
			true: "hover:shadow-xl hover:-translate-y-1",
			false: "",
		},
	},
	compoundVariants: [
		{
			selected: true,
			hoverable: true,
			className: "hover:shadow-xl hover:shadow-accent-selection-bg/30 hover:-translate-y-1",
		},
	],
	defaultVariants: {
		variant: "default",
		selected: false,
		hoverable: false,
	},
})

// Header variants - ONE unified header system to replace all your repeated header styles
export const headerVariants = cva("text-left", {
	variants: {
		spacing: {
			tight: "mb-4",
			default: "mb-8",
			loose: "mb-12",
		},
	},
	defaultVariants: {
		spacing: "default",
	},
})

// Button variants - enhanced version of your existing button system
export const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

// Input variants - unified form field styling
export const inputVariants = cva(
	"flex w-full rounded-md border transition-all duration-200 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium selection:bg-primary selection:text-primary-foreground",
	{
		variants: {
			variant: {
				default:
					"bg-[var(--color-form-input-bg)] border-[var(--color-form-border)] text-[var(--color-form-input-text)] placeholder:text-[var(--color-form-placeholder)] focus:border-[var(--color-form-border-focus)] focus:ring-[3px] focus:ring-[var(--color-form-focus-ring)] active:border-[var(--color-form-border-active)] disabled:bg-[var(--color-form-bg-disabled)] disabled:border-[var(--color-form-border-disabled)] disabled:text-[var(--color-form-text-disabled)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--color-form-error-border)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-form-error-ring)]",
				glass:
					"bg-[var(--color-form-input-bg)]/50 backdrop-blur-sm border-white/20 text-[var(--color-form-input-text)] placeholder:text-[var(--color-form-placeholder)] focus:border-[var(--color-form-border-focus)] focus:ring-[3px] focus:ring-[var(--color-form-focus-ring)]",
			},
			size: {
				default: "h-9 px-3 py-2 text-sm",
				sm: "h-8 px-2 py-1 text-xs",
				lg: "h-12 px-4 py-3 text-base",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

// Textarea variants - consistent with input styling
export const textareaVariants = cva("flex min-h-[60px] w-full rounded-md border resize-vertical transition-all duration-200 outline-none selection:bg-primary selection:text-primary-foreground", {
	variants: {
		variant: {
			default:
				"bg-[var(--color-form-input-bg)] border-[var(--color-form-border)] text-[var(--color-form-input-text)] placeholder:text-[var(--color-form-placeholder)] focus:border-[var(--color-form-border-focus)] focus:ring-[3px] focus:ring-[var(--color-form-focus-ring)] active:border-[var(--color-form-border-active)] disabled:bg-[var(--color-form-bg-disabled)] disabled:border-[var(--color-form-border-disabled)] disabled:text-[var(--color-form-text-disabled)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--color-form-error-border)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-form-error-ring)]",
		},
		size: {
			default: "px-3 py-2 text-sm",
			sm: "px-2 py-1 text-xs",
			lg: "px-4 py-3 text-base",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
})

// Select variants - dropdown form styling
export const selectVariants = cva("", {
	variants: {
		trigger: {
			default:
				"flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-[var(--color-form-input-bg)] border-[var(--color-form-border)] px-3 py-2 text-sm text-[var(--color-form-input-text)] shadow-xs outline-none transition-all duration-200 data-[placeholder]:text-[var(--color-form-placeholder)] focus:border-[var(--color-form-border-focus)] focus:ring-[3px] focus:ring-[var(--color-form-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-50",
		},
		content: {
			default: "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
		},
	},
	defaultVariants: {
		trigger: "default",
		content: "default",
	},
})

// Label variants - form label styling
export const labelVariants = cva("text-sm font-medium text-[var(--color-form-input-text)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", {
	variants: {
		size: {
			default: "text-sm",
			sm: "text-xs",
			lg: "text-base",
		},
	},
	defaultVariants: {
		size: "default",
	},
})

// Switch variants - toggle component styling
export const switchVariants = cva(
	"peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
)

// Checkbox variants - checkbox component styling
export const checkboxVariants = cva(
	"peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
	{
		variants: {
			size: {
				default: "h-4 w-4",
				sm: "h-3 w-3",
				lg: "h-5 w-5",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
)

// Badge variants - status and label styling
export const badgeVariants = cva(
	"inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
				secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
				outline: "text-foreground",
				card: "border-transparent bg-card text-card-foreground shadow hover:bg-card/80",
			},
			size: {
				sm: "px-2 py-0.5 text-xs",
				md: "px-2.5 py-0.5 text-xs",
				lg: "px-3 py-1 text-sm",
				xl: "px-4 py-1.5 text-sm",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	}
)

// Avatar variants - profile picture styling
export const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
	variants: {
		size: {
			default: "h-10 w-10",
			sm: "h-8 w-8",
			lg: "h-12 w-12",
			xl: "h-16 w-16",
		},
	},
	defaultVariants: {
		size: "default",
	},
})

export type TypographyProps = VariantProps<typeof typographyVariants>
export type CardProps = VariantProps<typeof cardVariants>
export type HeaderProps = VariantProps<typeof headerVariants>
export type ButtonProps = VariantProps<typeof buttonVariants>
export type InputProps = VariantProps<typeof inputVariants>
export type TextareaProps = VariantProps<typeof textareaVariants>
export type SelectProps = VariantProps<typeof selectVariants>
export type LabelProps = VariantProps<typeof labelVariants>
export type SwitchProps = VariantProps<typeof switchVariants>
export type CheckboxProps = VariantProps<typeof checkboxVariants>
export type BadgeProps = VariantProps<typeof badgeVariants>
// Spinner variants - loading indicators with animations
export const spinnerVariants = cva("", {
	variants: {
		size: {
			sm: "w-4 h-4",
			md: "w-8 h-8",
			lg: "w-12 h-12",
		},
		color: {
			default: "text-muted-foreground",
			primary: "text-primary",
			secondary: "text-secondary",
			success: "text-green-500",
			warning: "text-yellow-500",
			danger: "text-destructive",
		},
		variant: {
			default: "animate-spin",
			simple: "animate-spin",
			gradient: "animate-spin",
			wave: "",
			dots: "",
			spinner: "",
		},
	},
	defaultVariants: {
		size: "md",
		color: "primary",
		variant: "default",
	},
})

export type AvatarProps = VariantProps<typeof avatarVariants>
export type SpinnerProps = VariantProps<typeof spinnerVariants>
