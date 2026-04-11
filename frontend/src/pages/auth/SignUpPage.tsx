import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4'>
			{/* Background Effects */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl'></div>
				<div className='absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl'></div>
			</div>

			{/* SignUp Component */}
			<div className='relative z-10'>
				<SignUp />
			</div>
		</div>
	);
};

export default SignUpPage;
