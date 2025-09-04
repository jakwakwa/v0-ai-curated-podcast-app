import { ImageResponse } from 'next/og';

export const size = {
	width: 32,
	height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '6px',
				}}
			>
				{/* Headphones icon using SVG-like styling */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'white',
						fontSize: '16px',
						fontWeight: 'bold',
					}}
				>
					{/* Headphones representation */}
					<div
						style={{
							width: '20px',
							height: '12px',
							border: '2px solid white',
							borderBottom: 'none',
							borderRadius: '10px 10px 0 0',
							position: 'relative',
						}}
					/>
					{/* Ear cups */}
					<div
						style={{
							display: 'flex',
							gap: '2px',
							marginTop: '-2px',
						}}
					>
						<div
							style={{
								width: '6px',
								height: '6px',
								backgroundColor: 'white',
								borderRadius: '50%',
							}}
						/>
						<div
							style={{
								width: '6px',
								height: '6px',
								backgroundColor: 'white',
								borderRadius: '50%',
							}}
						/>
					</div>
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
