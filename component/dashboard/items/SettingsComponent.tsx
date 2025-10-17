"use client";

import React, { useState, useRef } from "react";
import {
	User,
	Mail,
	Lock,
	Bell,
	Eye,
	Globe,
	Shield,
	Trash2,
	Save,
	Camera,
	Info,
} from "lucide-react";
import Image from "next/image";
import CustomSelect from "@/ui/CustomSelect";

export default function SettingsComponent() {
	// Account Settings
	const [firstName, setFirstName] = useState("John");
	const [lastName, setLastName] = useState("Doe");
	const [email, setEmail] = useState("john.doe@gordoncollege.edu.ph");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Notification Settings
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [matchAlerts, setMatchAlerts] = useState(true);
	const [messageAlerts, setMessageAlerts] = useState(true);
	const [statusUpdates, setStatusUpdates] = useState(false);

	// Privacy Settings
	const [profileVisibility, setProfileVisibility] = useState<
		"public" | "college" | "private"
	>("college");
	const [showEmail, setShowEmail] = useState(false);
	const [showContactInfo, setShowContactInfo] = useState(true);

	// Language & Display
	const [language, setLanguage] = useState("en");

	// Tab navigation: profile | notifications | preferences
	const [activeTab, setActiveTab] = useState<
		"profile" | "notifications" | "preferences"
	>("profile");
	const tabs = [
		{ id: "profile", label: "Profile", icon: <User size={16} /> },
		{
			id: "notifications",
			label: "Notifications",
			icon: <Bell size={16} />,
		},
		{ id: "preferences", label: "Preferences", icon: <Shield size={16} /> },
	];

	const tabListRef = useRef<HTMLDivElement | null>(null);

	const handleSaveProfile = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement save profile logic
		// console.log("Profile saved:", { fullName, email, studentId });
	};

	// keyboard navigation for tabs (Left/Right)
	const onTabKeyDown = (e: React.KeyboardEvent) => {
		const order = tabs.map((t) => t.id) as Array<
			"profile" | "notifications" | "preferences"
		>;
		const idx = order.indexOf(activeTab);
		if (e.key === "ArrowRight") {
			setActiveTab(order[(idx + 1) % order.length]);
		} else if (e.key === "ArrowLeft") {
			setActiveTab(order[(idx - 1 + order.length) % order.length]);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<section aria-labelledby="settings-heading">
				<h1
					id="settings-heading"
					className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
				>
					Settings
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Manage your account settings and preferences
				</p>
			</section>

			<div className="rounded-lg p-4">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Left nav */}
					<nav
						aria-label="Settings sections"
						className="w-full md:w-64 dark:border-neutral-800 pb-4"
					>
						<div className="md:sticky md:top-6 md:self-start md:max-h-[calc(100vh-1.5rem)] md:overflow-auto bg-white  dark:bg-neutral-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800">
							<div
								ref={tabListRef}
								role="tablist"
								aria-orientation="vertical"
								className="flex md:flex-col gap-2"
								onKeyDown={onTabKeyDown}
							>
								{tabs.map((t) => {
									const selected = activeTab === t.id;
									return (
										<button
											key={t.id}
											role="tab"
											aria-selected={selected}
											aria-controls={`${t.id}-panel`}
											id={`${t.id}-tab`}
											onClick={() =>
												setActiveTab(t.id as any)
											}
											className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
												selected
													? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"
													: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
											}`}
											tabIndex={selected ? 0 : -1}
										>
											<span
												className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${
													selected
														? "bg-emerald-100 dark:bg-emerald-800 text-emerald-700"
														: "bg-gray-100 dark:bg-neutral-800 text-gray-500"
												}`}
												aria-hidden="true"
											>
												{t.icon}
											</span>
											<span className="font-medium">
												{t.label}
											</span>
										</button>
									);
								})}
							</div>
						</div>
					</nav>

					{/* Right content */}
					<div className="flex-1 bg-white dark:bg-neutral-900 ">
						{/* Profile Panel */}
						{activeTab === "profile" && (
							<section
								id="profile-panel"
								role="tabpanel"
								aria-labelledby="profile-tab"
								className="space-y-6"
							>
								{/* Profile Settings card */}
								<section
									aria-labelledby="profile-settings-heading"
									className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
								>
									<div className="flex items-center gap-3 mb-6">
										<User
											size={20}
											className="text-emerald-600 dark:text-emerald-400"
											aria-hidden="true"
										/>
										<h2
											id="profile-settings-heading"
											className="text-lg font-semibold text-gray-900 dark:text-gray-100"
										>
											Profile Settings
										</h2>
									</div>

									<form
										onSubmit={handleSaveProfile}
										className="space-y-6"
									>
										{/* Profile Picture */}
										<div className="flex items-center gap-6">
											<div className="relative">
												<div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
													<Image
														src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
														alt="Profile picture"
														width={96}
														height={96}
														className="object-cover"
													/>
												</div>
												<button
													type="button"
													className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
													aria-label="Change profile picture"
												>
													<Camera
														size={14}
														aria-hidden="true"
													/>
												</button>
											</div>
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
													Profile Photo
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
													JPG or PNG. Max size 5MB.
												</p>
												<button
													type="button"
													className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
												>
													Upload new photo
												</button>
											</div>
										</div>

										{/* Full Name */}
										<div className="flex items-center gap-4 justify-between">
											<div className="flex-1">
												<label
													htmlFor="full-name"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
												>
													First Name
												</label>
												<input
													type="text"
													id="first-name"
													value={firstName}
													onChange={(e) =>
														setFirstName(
															e.target.value
														)
													}
													className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100"
													required
												/>
											</div>

											<div className="flex-1">
												<label
													htmlFor="full-name"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
												>
													Last Name
												</label>
												<input
													type="text"
													id="last-name"
													value={lastName}
													onChange={(e) =>
														setLastName(
															e.target.value
														)
													}
													className="w-full px-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100"
													required
												/>
											</div>
										</div>

										{/* Email */}
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												Email Address
											</label>
											<div className="relative">
												<Mail
													size={18}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
													aria-hidden="true"
												/>
												<input
													type="email"
													id="email"
													value={email}
													className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-neutral-800/30 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
													disabled
												/>
											</div>
											<p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
												Must be a valid Gordon College
												email address
											</p>
										</div>

										{/* Save Button */}
										<div className="flex justify-end">
											<button
												type="submit"
												className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center gap-2"
											>
												<Save
													size={18}
													aria-hidden="true"
												/>
												Save Changes
											</button>
										</div>
									</form>
								</section>
							</section>
						)}

						{/* Notifications Panel */}
						{activeTab === "notifications" && (
							<section
								id="notifications-panel"
								role="tabpanel"
								aria-labelledby="notifications-tab"
								className="space-y-6"
							>
								<section
									aria-labelledby="notification-settings-heading"
									className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
								>
									<div className="flex items-center gap-3 mb-6">
										<Bell
											size={20}
											className="text-emerald-600 dark:text-emerald-400"
											aria-hidden="true"
										/>
										<h2
											id="notification-settings-heading"
											className="text-lg font-semibold text-gray-900 dark:text-gray-100"
										>
											Notification Preferences
										</h2>
									</div>

									<div className="space-y-4">
										{/* Email Notifications */}
										<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-800">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
													Email Notifications
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Receive email updates about
													your items
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={emailNotifications}
													onChange={(e) =>
														setEmailNotifications(
															e.target.checked
														)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
												<span className="sr-only">
													Toggle email notifications
												</span>
											</label>
										</div>

										{/* Match Alerts */}
										<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-800">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
													Match Alerts
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Get notified when potential
													matches are found
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={matchAlerts}
													onChange={(e) =>
														setMatchAlerts(
															e.target.checked
														)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
												<span className="sr-only">
													Toggle match alerts
												</span>
											</label>
										</div>

										{/* Message Alerts */}
										<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-800">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
													Message Alerts
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Be notified about new
													messages
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={messageAlerts}
													onChange={(e) =>
														setMessageAlerts(
															e.target.checked
														)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
												<span className="sr-only">
													Toggle message alerts
												</span>
											</label>
										</div>

										{/* Status Updates */}
										<div className="flex items-center justify-between py-3">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
													Status Updates
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Notifications when item
													status changes
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={statusUpdates}
													onChange={(e) =>
														setStatusUpdates(
															e.target.checked
														)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
												<span className="sr-only">
													Toggle status updates
												</span>
											</label>
										</div>
									</div>
								</section>
							</section>
						)}

						{/* Preferences Panel */}
						{activeTab === "preferences" && (
							<section
								id="preferences-panel"
								role="tabpanel"
								aria-labelledby="preferences-tab"
								className="space-y-6"
							>
								{/* Privacy Settings */}
								<section
									aria-labelledby="privacy-settings-heading"
									className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
								>
									<div className="flex items-center gap-3 mb-6">
										<Shield
											size={20}
											className="text-emerald-600 dark:text-emerald-400"
											aria-hidden="true"
										/>
										<h2
											id="privacy-settings-heading"
											className="text-lg font-semibold text-gray-900 dark:text-gray-100"
										>
											Privacy Settings
										</h2>
									</div>

									<div className="space-y-6">
										{/* Profile Visibility */}
										<div>
											<label
												htmlFor="profile-visibility"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												Profile Visibility
											</label>
											<CustomSelect
												value={profileVisibility}
												onValueChange={(value) =>
													setProfileVisibility(
														value as
															| "public"
															| "college"
															| "private"
													)
												}
												options={[
													{
														value: "public",
														label: "Public - Anyone can view",
													},
													{
														value: "college",
														label: "College Only - Only Gordon College users",
													},
													{
														value: "private",
														label: "Private - Only you can view",
													},
												]}
											/>

											<p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-start gap-1.5">
												<Info
													size={12}
													className="flex-shrink-0 mt-0.5"
													aria-hidden="true"
												/>
												Controls who can see your
												profile and posted items
											</p>
										</div>

										{/* Show Email */}
										<div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-neutral-800">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
													Show Email Address
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Display your email on your
													public profile
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={showEmail}
													onChange={(e) =>
														setShowEmail(
															e.target.checked
														)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
												<span className="sr-only">
													Toggle show email
												</span>
											</label>
										</div>

										{/* Show Contact Info */}
										<div className="flex items-center justify-between py-3">
											<div>
												<h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
													Show Contact Information
												</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">
													Allow others to contact you
													about items
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={showContactInfo}
													onChange={(e) =>
														setShowContactInfo(
															e.target.checked
														)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
												<span className="sr-only">
													Toggle show contact info
												</span>
											</label>
										</div>
									</div>
								</section>

								{/* Language & Display */}
								<section
									aria-labelledby="display-settings-heading"
									className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6"
								>
									<div className="flex items-center gap-3 mb-6">
										<Globe
											size={20}
											className="text-emerald-600 dark:text-emerald-400"
											aria-hidden="true"
										/>
										<h2
											id="display-settings-heading"
											className="text-lg font-semibold text-gray-900 dark:text-gray-100"
										>
											Language & Display
										</h2>
									</div>

									<div className="space-y-4">
										{/* Language */}
										<div>
											<label
												htmlFor="language"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
											>
												Language
											</label>

											<CustomSelect
												value={language}
												onValueChange={(value) =>
													setLanguage(value)
												}
												options={[
													{
														value: "en",
														label: "English",
													},
													{
														value: "fil",
														label: "Filipino",
													},
												]}
											/>
										</div>
									</div>
								</section>
							</section>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
