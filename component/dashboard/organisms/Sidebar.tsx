import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
	activeTab: string;
	handleTabClick: (tab: string) => void;
	handleLogout: () => void;
	navItems: { name: string; icon: React.ReactNode }[];
	showMobileMenu: boolean;
	setShowMobileMenu: (show: boolean) => void;
	unreadMessageCount?: number;
}

export default function Sidebar({
	activeTab,
	handleTabClick,
	handleLogout,
	navItems,
	showMobileMenu,
	setShowMobileMenu,
	unreadMessageCount = 0,
}: SidebarProps) {
	return (
		<>
			<AnimatePresence>
				<motion.aside
					initial={{ x: -8, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: -8, opacity: 0 }}
					transition={{ duration: 0.12 }}
					className="h-screen w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 overflow-y-auto hidden md:block z-10 justify-between"
					role="navigation"
					aria-label="Main navigation"
				>
					<nav className="py-4">
						<div className="px-4 mb-6">
							<h2 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
								Main Menu
							</h2>
						</div>
						<ul className="space-y-1" role="list">
							{navItems.map((item) => {
								const isActive = activeTab === item.name.toLowerCase().replace(/ /g, "-");
								return (
									<li key={item.name}>
										<button
											type="button"
											onClick={() => handleTabClick(item.name.toLowerCase().replace(/ /g, "-"))}
											className={`w-full text-left flex items-center px-4 py-3 transition-colors duration-200 ${
												isActive
													? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium border-l-4 border-emerald-500 dark:border-emerald-400"
													: "text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
											} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400 focus-visible:ring-inset`}
											aria-current={isActive ? "page" : undefined}
										>
											<span className="mr-3 text-gray-500 dark:text-gray-400" aria-hidden="true">
												{item.icon}
											</span>
											<span className="flex-1">{item.name}</span>
											{item.name === "Messages" && unreadMessageCount > 0 && (
												<span
													className="ml-2 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0"
													aria-label={`${unreadMessageCount} unread messages`}
												>
													{unreadMessageCount > 99 ? "99+" : unreadMessageCount}
												</span>
											)}
										</button>
									</li>
								);
							})}
							<li>
								<button
									type="button"
									onClick={handleLogout}
									className="w-full text-left text-red-700 dark:text-red-400 flex items-center px-4 py-3 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-inset"
								>
									<span className="mr-3 text-red-500 dark:text-red-400" aria-hidden="true">
										<LogOut size={18} />
									</span>
									<span>Sign Out</span>
								</button>
							</li>
						</ul>
					</nav>
				</motion.aside>
			</AnimatePresence>

			<AnimatePresence>
				{showMobileMenu && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.12 }}
						className="md:hidden fixed inset-0 bg-black/50 dark:bg-black/70 top-14 z-40"
						onClick={() => setShowMobileMenu(false)}
						aria-label="Close menu"
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
								setShowMobileMenu(false);
							}
						}}
					>
						<motion.aside
							initial={{ x: -260 }}
							animate={{ x: 0 }}
							exit={{ x: -260 }}
							transition={{ type: "tween", duration: 0.18 }}
							className="w-64 bg-white dark:bg-neutral-900 h-full overflow-y-auto shadow-xl"
							onClick={(e) => e.stopPropagation()}
							role="navigation"
							aria-label="Mobile navigation"
						>
							<nav className="py-4">
								<div className="px-4 mb-6">
									<h2 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
										Main Menu
									</h2>
								</div>
								<ul className="space-y-1" role="list">
									{navItems.map((item) => {
										const isActive = activeTab === item.name.toLowerCase().replace(/ /g, "-");
										return (
											<li key={item.name}>
												<button
													type="button"
													onClick={() => {
														handleTabClick(item.name.toLowerCase().replace(/ /g, "-"));
														setShowMobileMenu(false);
													}}
													className={`w-full text-left flex items-center px-4 py-3 transition-colors duration-200 ${
														isActive
															? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium border-l-4 border-emerald-500 dark:border-emerald-400"
															: "text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
													} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400 focus-visible:ring-inset`}
													aria-current={isActive ? "page" : undefined}
												>
													<span
														className="mr-3 text-gray-500 dark:text-gray-400"
														aria-hidden="true"
													>
														{item.icon}
													</span>
													<span className="flex-1">{item.name}</span>
													{item.name === "Messages" && unreadMessageCount > 0 && (
														<span
															className="ml-2 bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center"
															aria-label={`${unreadMessageCount} unread messages`}
														>
															{unreadMessageCount > 99 ? "99+" : unreadMessageCount}
														</span>
													)}
												</button>
											</li>
										);
									})}
									<li>
										<button
											type="button"
											onClick={() => {
												handleLogout();
												setShowMobileMenu(false);
											}}
											className="w-full text-left text-red-700 dark:text-red-400 flex items-center px-4 py-3 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-inset"
										>
											<span className="mr-3 text-red-500 dark:text-red-400" aria-hidden="true">
												<LogOut size={18} />
											</span>
											<span>Sign Out</span>
										</button>
									</li>
								</ul>
							</nav>
						</motion.aside>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
