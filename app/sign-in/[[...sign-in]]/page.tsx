import { SignIn } from "@clerk/nextjs";
import "@/styles/login.css";

export default function SignInPage() {
	return (
		<>
			{/* <div className="container login-background-base" /> */}
			<div className="grid-bg background-base heroSection" />
			{/* <div className="large-blur background-base" /> */}
			{/* <div className="background-overlay" /> */}
			<div className="container flex flex-col items-center justify-center  min-h-screen  bg-sidebar relative z-10">
				<SignIn />
			</div>
		</>
	);
}
