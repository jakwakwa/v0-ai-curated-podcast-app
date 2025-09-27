import { SignUp } from "@clerk/nextjs";
import "@/styles/login.css";

export default function SignInPage() {
	return (
		<>
			{/* <div className="container login-background-base" /> */}
			<div className="grid-bg background-base heroSectio  max-h-scree mt-12" />
			{/* <div className="large-blur background-base" /> */}
			{/* <div className="background-overlay" /> */}
			<div className=" flex max-h-screen flex-col  heroSectio items-center justify-center  min-h-[104vh]">
				<SignUp />
			</div>
		</>
	);
}
