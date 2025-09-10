import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<div
			style={{
				display: "flex",
				minHeight: "100vh",
				alignItems: "center",
				justifyContent: "center",
				background: "oklch(var(--background))",
			}}>
			<SignIn />
		</div>
	);
}
