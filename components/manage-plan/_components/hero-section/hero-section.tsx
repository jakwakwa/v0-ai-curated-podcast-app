export function HeroSection() {
	return (
		<section
			className={
				"mx-auto max-w-7xl px-[32px] relative flex items-center justify-between mt-16 mb-12"
			}
		>
			<div className={"text-center w-full "}>
				<h1
					className={
						"text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-medium"
					}
				>
					Cut the chatter,
					<br />
					Keep the insights
				</h1>
				<p
					className={
						"mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px]"
					}
				>
					Get immediate access to key takeaways without hunting through rambling
					conversations. <br /> Transform 3-hour podcasts into 5-minute
					insights.
					<br /> Be among the first to experience the future of podcast
					consumption.
				</p>
			</div>
		</section>
	);
}
