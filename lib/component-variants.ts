import { cva, type VariantProps } from "class-variance-authority"

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
			"body-sm": "font-body text-body-sm text-muted-foreground",
			muted: "text-sm text-muted-foreground",
		},
	},
	defaultVariants: {
		variant: "body",
	},
})

// Card variants - ONE unified card system to replace all your different card implementations
export const cardVariants = cva(
  "rounded-2xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        glass: "border-white/10 bg-card/25 backdrop-blur-[40px] shadow-glass",
        episode: "border-border bg-gradient-to-br from-card/80 via-accent/20 to-muted shadow-episode cursor-pointer hover:shadow-lg hover:scale-[1.02]",
        bundle: "border-border bg-card/90 text-card-foreground hover:bg-card/95",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

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

// Input variants - for consistent form styling
export const inputVariants = cva(
	"flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-background",
				glass: "bg-background/50 backdrop-blur-sm border-white/20",
			},
			size: {
				default: "h-10 px-3 py-2",
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

export type TypographyProps = VariantProps<typeof typographyVariants>
export type CardProps = VariantProps<typeof cardVariants>
export type HeaderProps = VariantProps<typeof headerVariants>
export type ButtonProps = VariantProps<typeof buttonVariants>
export type InputProps = VariantProps<typeof inputVariants>
