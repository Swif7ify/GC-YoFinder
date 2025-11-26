import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationItem } from "../molecules";

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
								const isActive =
									activeTab ===
									item.name.toLowerCase().replace(/ /g, "-");
								return (
									<NavigationItem
										key={item.name}
										name={item.name}
										icon={item.icon}
										isActive={isActive}
										badge={item.name === "Messages" ? unreadMessageCount : undefined}
										onClick={() =>
											handleTabClick(
												item.name
													.toLowerCase()
													.replace(/ /g, "-")
											)
										}
									/>
								);
							})}
							<li>
								<button
									type="button"
									onClick={handleLogout}
									className="w-full text-left text-red-700 dark:text-red-400 flex items-center px-4 py-3 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-inset"
								>
									<span
										className="mr-3 text-red-500 dark:text-red-400"
										aria-hidden="true"
									>
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
							if (
								e.key === "Escape" ||
								e.key === "Enter" ||
								e.key === " "
							) {
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
										const isActive =
											activeTab ===
											item.name
												.toLowerCase()
												.replace(/ /g, "-");
										return (
											<NavigationItem
												key={item.name}
												name={item.name}
												icon={item.icon}
												isActive={isActive}
												badge={item.name === "Messages" ? unreadMessageCount : undefined}
												onClick={() => {
													handleTabClick(
														item.name
															.toLowerCase()
															.replace(/ /g, "-")
													);
													setShowMobileMenu(false);
												}}
											/>
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
											<span
												className="mr-3 text-red-500 dark:text-red-400"
												aria-hidden="true"
											>
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

