import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers, unreadUsers } = useChatStore();

	return (
		<div className='border-r border-zinc-800'>
			<div className='flex flex-col h-full'>
				<ScrollArea className='h-[calc(100vh-280px)]'>
					<div className='space-y-2 p-4'>
						{isLoading ? (
							<UsersListSkeleton />
						) : (
							users.map((user) => (
								<div
									key={user._id}
									onClick={() => setSelectedUser(user)}
									className={`flex items-center justify-center lg:justify-start gap-3 p-3 
										rounded-lg cursor-pointer transition-colors
                    ${selectedUser?.clerkId === user.clerkId ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
								>
									<div className='relative'>
										<Avatar className='size-8 md:size-12'>
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>{user.fullName[0]}</AvatarFallback>
										</Avatar>
										{/* online indicator */}
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                        ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}`}
										/>
										{/* unread indicator on avatar (visible on mobile/collapsed sidebar) */}
										{unreadUsers.has(user.clerkId) && (
											<div className='absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-zinc-900 animate-pulse' />
										)}
									</div>

									<div className='flex-1 min-w-0 lg:flex lg:items-center lg:justify-between hidden'>
										<span className={`truncate ${unreadUsers.has(user.clerkId) ? "text-white font-bold" : "text-zinc-300 font-medium"}`}>
											{user.fullName}
										</span>
										{unreadUsers.has(user.clerkId) && (
											<span className='size-2.5 bg-red-500 rounded-full flex-shrink-0 animate-pulse ml-2' />
										)}
									</div>
								</div>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;
