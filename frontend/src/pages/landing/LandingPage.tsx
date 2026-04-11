import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-react";
import { Music } from "lucide-react";

const LandingPage = () => {
	const { openSignIn, openSignUp } = useClerk();

	return (
		<div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-4'>
			{/* Header Background Effects */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl'></div>
				<div className='absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl'></div>
			</div>

			{/* Content */}
			<div className='relative z-10 text-center max-w-2xl'>
				{/* Logo */}
				<div className='flex items-center justify-center gap-3 mb-8'>
					<div className='bg-emerald-500 p-3 rounded-lg'>
						<Music className='size-8 text-white' />
					</div>
					<h1 className='text-5xl font-bold'>SpotiClone</h1>
				</div>

				{/* Main Heading */}
				<h2 className='text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent'>
					Your Music, Your Way
				</h2>

				{/* Description */}
				<p className='text-xl text-gray-300 mb-12 leading-relaxed'>
					Stream millions of songs, create playlists, and chat with friends in real-time. 
					Experience music like never before.
				</p>

				{/* Features */}
				<div className='grid md:grid-cols-3 gap-6 mb-12'>
					<div className='bg-white/5 backdrop-blur p-6 rounded-lg border border-white/10'>
						<div className='text-emerald-400 text-3xl mb-3'>🎵</div>
						<h3 className='font-semibold mb-2'>Millions of Songs</h3>
						<p className='text-gray-400 text-sm'>Access our vast library of songs</p>
					</div>
					<div className='bg-white/5 backdrop-blur p-6 rounded-lg border border-white/10'>
						<div className='text-emerald-400 text-3xl mb-3'>💬</div>
						<h3 className='font-semibold mb-2'>Real-time Chat</h3>
						<p className='text-gray-400 text-sm'>Connect with friends instantly</p>
					</div>
					<div className='bg-white/5 backdrop-blur p-6 rounded-lg border border-white/10'>
						<div className='text-emerald-400 text-3xl mb-3'>👥</div>
						<h3 className='font-semibold mb-2'>See What Friends Play</h3>
						<p className='text-gray-400 text-sm'>Discover what others are listening to</p>
					</div>
				</div>

				{/* CTA Buttons */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center'>
					<Button
						onClick={() => openSignUp()}
						size='lg'
						className='bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-lg'
					>
						Sign Up Free
					</Button>
					<Button
						onClick={() => openSignIn()}
						variant='outline'
						size='lg'
						className='border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-lg'
					>
						Sign In
					</Button>
				</div>

				{/* Footer Text */}
				<p className='text-gray-400 text-sm mt-10'>
					Already have an account?{" "}
					<button
						onClick={() => openSignIn()}
						className='text-emerald-400 hover:text-emerald-300 font-semibold'
					>
						Sign in here
					</button>
				</p>
			</div>
		</div>
	);
};

export default LandingPage;
