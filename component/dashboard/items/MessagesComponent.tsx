"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Search } from "lucide-react";
import { Conversation, Message } from "@/types/types";

export default function MessagesComponent() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		// Mock conversation data
		setConversations([
			{
				id: "1",
				name: "Emily Johnson",
				subject: "Re: Water Bottle",
				lastMessage:
					"Hi, I found your water bottle at the gym yesterday.",
				time: "14:30",
				unreadCount: 2,
			},
			{
				id: "2",
				name: "Michael Chen",
				subject: "Re: Textbook - Organic Chemistry",
				lastMessage: "Is this textbook still available?",
				time: "09:15",
				unreadCount: 0,
			},
			{
				id: "3",
				name: "Sarah Williams",
				subject: "Re: Student ID Card",
				lastMessage: "Thank you for finding my student ID!",
				time: "16:45",
				unreadCount: 0,
			},
		]);
	}, []);

	const handleConversationClick = (conversation: Conversation) => {
		setSelectedConversation(conversation);

		// Mock messages for the selected conversation
		if (conversation.id === "1") {
			setMessages([
				{
					id: "1",
					senderId: "1",
					senderName: "Emily Johnson",
					content:
						"Hi, I found your water bottle at the gym yesterday.",
					timestamp: "14:25",
					isOwn: false,
				},
				{
					id: "2",
					senderId: "me",
					senderName: "You",
					content:
						"That's great! Can you describe what it looks like?",
					timestamp: "14:28",
					isOwn: true,
				},
				{
					id: "3",
					senderId: "1",
					senderName: "Emily Johnson",
					content:
						"It's a blue Hydro Flask with a sticker on it. Does that sound right?",
					timestamp: "14:30",
					isOwn: false,
				},
			]);
		}

		// Mark as read
		setConversations((prev) =>
			prev.map((conv) =>
				conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
			)
		);
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !selectedConversation) return;

		const message: Message = {
			id: Date.now().toString(),
			senderId: "me",
			senderName: "You",
			content: newMessage,
			timestamp: new Date().toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
			isOwn: true,
		};

		setMessages([...messages, message]);
		setNewMessage("");
	};

	const filteredConversations = conversations.filter(
		(conv) =>
			conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="h-[calc(100vh-8rem)] flex flex-col">
			{/* Header */}
			<section aria-labelledby="messages-heading" className="mb-4">
				<h1
					id="messages-heading"
					className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-1"
				>
					Messages
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Communicate about lost and found items
				</p>
			</section>

			{/* Messages Container */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
				{/* Conversations List */}
				<aside
					className="lg:col-span-1 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 flex flex-col"
					aria-label="Conversations list"
				>
					{/* Search */}
					<div className="p-4 border-b border-gray-200 dark:border-neutral-800">
						<h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
							Conversations
						</h2>
						<div className="relative">
							<Search
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
								aria-hidden="true"
							/>
							<input
								type="search"
								placeholder="Search conversations..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700  rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
								aria-label="Search conversations"
							/>
						</div>
					</div>

					{/* Conversations */}
					<nav className="flex-1 overflow-y-auto">
						<ul role="list">
							{filteredConversations.map((conversation) => (
								<li key={conversation.id}>
									<button
										type="button"
										onClick={() =>
											handleConversationClick(
												conversation
											)
										}
										className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 ${
											selectedConversation?.id ===
											conversation.id
												? "bg-emerald-50 dark:bg-emerald-900/20"
												: ""
										}`}
										aria-current={
											selectedConversation?.id ===
											conversation.id
												? "true"
												: undefined
										}
									>
										<div className="flex items-start gap-3">
											{/* Avatar */}
											<div
												className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium"
												aria-hidden="true"
											>
												{conversation.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-2 mb-1">
													<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
														{conversation.name}
													</p>
													<span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
														{conversation.time}
													</span>
												</div>
												<p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1 truncate">
													{conversation.subject}
												</p>
												<p className="text-xs text-gray-600 dark:text-gray-400 truncate">
													{conversation.lastMessage}
												</p>
											</div>

											{/* Unread Badge */}
											{conversation.unreadCount > 0 && (
												<span
													className="flex-shrink-0 bg-emerald-500 text-white text-xs font-medium px-2 py-0.5 rounded-full"
													aria-label={`${conversation.unreadCount} new messages`}
												>
													{conversation.unreadCount}
												</span>
											)}
										</div>
									</button>
								</li>
							))}
						</ul>
					</nav>
				</aside>

				{/* Messages Panel */}
				<main
					className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 flex flex-col"
					aria-label="Message thread"
				>
					{selectedConversation ? (
						<>
							{/* Conversation Header */}
							<header className="p-4 border-b border-gray-200 dark:border-neutral-800">
								<div className="flex items-center gap-3">
									<div
										className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium"
										aria-hidden="true"
									>
										{selectedConversation.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
									<div>
										<h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
											{selectedConversation.name}
										</h2>
										<p className="text-xs text-emerald-600 dark:text-emerald-400">
											{selectedConversation.subject}
										</p>
									</div>
								</div>
							</header>

							{/* Messages */}
							<div
								className="flex-1 overflow-y-auto p-4 space-y-4"
								role="log"
								aria-live="polite"
								aria-label="Messages"
							>
								{messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.isOwn
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`max-w-[70%] ${
												message.isOwn
													? "order-2"
													: "order-1"
											}`}
										>
											<div
												className={`rounded-lg px-4 py-2 ${
													message.isOwn
														? "bg-emerald-600 dark:bg-emerald-500 text-white"
														: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
												}`}
											>
												<p className="text-sm">
													{message.content}
												</p>
											</div>
											<p
												className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
													message.isOwn
														? "text-right"
														: "text-left"
												}`}
											>
												{message.timestamp}
											</p>
										</div>
									</div>
								))}
							</div>

							{/* Message Input */}
							<form
								onSubmit={handleSendMessage}
								className="p-4 border-t border-gray-200 dark:border-neutral-800"
							>
								<div className="flex gap-2">
									<input
										type="text"
										value={newMessage}
										onChange={(e) =>
											setNewMessage(e.target.value)
										}
										placeholder="Type your message..."
										className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700  rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
										aria-label="Message input"
									/>
									<button
										type="submit"
										disabled={!newMessage.trim()}
										className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
										aria-label="Send message"
									>
										<Send size={20} aria-hidden="true" />
									</button>
								</div>
							</form>
						</>
					) : (
						<div className="flex-1 flex flex-col items-center justify-center text-center p-8">
							<div
								className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
								aria-hidden="true"
							>
								<MessageSquare
									size={32}
									className="text-gray-400 dark:text-gray-500"
								/>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
								Select a Conversation
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Choose a conversation from the list to start
								messaging
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
