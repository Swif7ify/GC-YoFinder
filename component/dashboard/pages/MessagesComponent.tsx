"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MessageSquare, Send, Search, MoreVertical, Eye, Lock } from "lucide-react";
import { Conversation, Message } from "@/types/types";
import { api } from "@/lib/api.config";
import { useApiLoading } from "@/hooks/useApiLoading";
import { toastError, toastSuccess } from "@/utils/toast";
import Pusher from "pusher-js";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

type ConversationFilter = "all" | "active" | "claimed";

interface MessagesComponentProps {
	userID: string | null;
}

export default function MessagesComponent({ userID }: MessagesComponentProps) {
	const searchParams = useSearchParams();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterTab, setFilterTab] = useState<ConversationFilter>("all");
	const [isLoading, setIsLoading] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [showHeaderMenu, setShowHeaderMenu] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const { withLoading } = useApiLoading();
	const pusherRef = useRef<Pusher | null>(null);
	const channelRef = useRef<any>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Count conversations by status
	const counts = useMemo(
		() => ({
			all: conversations.length,
			active: conversations.filter((c) => c.itemStatus !== "claimed").length,
			claimed: conversations.filter((c) => c.itemStatus === "claimed").length,
		}),
		[conversations]
	);

	// Check if selected conversation is for a claimed item
	const isConversationClaimed = selectedConversation?.itemStatus === "claimed";

	// Initialize Pusher
	useEffect(() => {
		if (!userID) return;

		const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
		const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2";

		if (!pusherKey) {
			console.error("Pusher key not configured");
			return;
		}

		const pusher = new Pusher(pusherKey, {
			cluster: pusherCluster,
			authEndpoint: "/api/pusher/auth",
			// Don't set Content-Type header - let Pusher use its default form-encoded format
		});

		pusherRef.current = pusher;

		// Subscribe to user-specific channel for conversation updates
		const userChannel = pusher.subscribe(`private-user-${userID}`);

		const handleConversationUpdate = () => {
			// Refresh conversations when updated
			if (userID) {
				api("/api/messages/conversations")
					.then((response) => {
						if (response.status === 200) {
							return response.json();
						}
					})
					.then((data) => {
						if (data?.conversations) {
							// Ensure unreadCount is a number
							const formattedConversations = data.conversations.map((conv: any) => ({
								...conv,
								unreadCount:
									typeof conv.unreadCount === "number" ? conv.unreadCount : conv.unreadCount || 0,
							}));
							setConversations(formattedConversations);
							// Trigger custom event to update unread count in parent
							window.dispatchEvent(new CustomEvent("unreadCountUpdate"));
						}
					})
					.catch((error) => {
						console.error("Error refreshing conversations:", error);
					});
			}
		};

		userChannel.bind("conversation-updated", handleConversationUpdate);
		userChannel.bind("new-message", handleConversationUpdate);

		// Listen for item updates (when item is claimed, update conversation status)
		const handleItemUpdated = (data: { itemId?: string; status?: string }) => {
			if (data?.status === "claimed") {
				// Refresh conversations to get updated item status
				handleConversationUpdate();
				// Also update the selected conversation if it's for this item
				setSelectedConversation((prev) => {
					if (prev && (prev as any).itemId === data.itemId) {
						return { ...prev, itemStatus: "claimed" };
					}
					return prev;
				});
			}
		};
		userChannel.bind("item-updated", handleItemUpdated);

		// Listen for unread count updates
		const handleUnreadCountUpdate = () => {
			// Trigger custom event to update unread count in parent
			window.dispatchEvent(new CustomEvent("unreadCountUpdate"));
		};
		userChannel.bind("unread-count-updated", handleUnreadCountUpdate);

		// Listen for new notifications
		const handleNewNotification = (data: { notification: any }) => {
			// Trigger custom event to update notifications in parent with the notification data
			window.dispatchEvent(new CustomEvent("notificationUpdate", { detail: data.notification }));
			// Also trigger unread count update since a new notification means potentially new unread messages
			window.dispatchEvent(new CustomEvent("unreadCountUpdate"));
		};
		userChannel.bind("new-notification", handleNewNotification);

		// Subscribe to global items channel for item status changes
		const globalChannel = pusher.subscribe("global-items");
		const handleGlobalItemClaimed = (data: { itemId?: string }) => {
			// Refresh conversations to get updated item status
			handleConversationUpdate();
			// Update selected conversation if it matches
			setSelectedConversation((prev) => {
				if (prev && (prev as any).itemId === data?.itemId) {
					return { ...prev, itemStatus: "claimed" };
				}
				return prev;
			});
		};
		globalChannel.bind("item-claimed", handleGlobalItemClaimed);

		return () => {
			userChannel.unbind("conversation-updated", handleConversationUpdate);
			userChannel.unbind("new-message", handleConversationUpdate);
			userChannel.unbind("item-updated", handleItemUpdated);
			userChannel.unbind("unread-count-updated", handleUnreadCountUpdate);
			userChannel.unbind("new-notification", handleNewNotification);
			globalChannel.unbind("item-claimed", handleGlobalItemClaimed);
			pusher.disconnect();
		};
	}, [userID]);

	// Fetch conversations
	const fetchConversations = async () => {
		if (!userID) return;

		try {
			setIsLoading(true);
			const response = await withLoading(() => api("/api/messages/conversations"));

			if (response.status !== 200) {
				toastError("Error", "Failed to load conversations");
				return;
			}

			const data = await response.json();
			const conversationsData = data.conversations || [];
			// Ensure unreadCount is a number
			const formattedConversations = conversationsData.map((conv: any) => ({
				...conv,
				unreadCount: typeof conv.unreadCount === "number" ? conv.unreadCount : conv.unreadCount || 0,
			}));
			setConversations(formattedConversations);
		} catch (error) {
			console.error("Error fetching conversations:", error);
			toastError("Error", "Failed to load conversations");
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch conversations on mount
	useEffect(() => {
		if (userID) {
			fetchConversations();
		}
	}, [userID]);

	// Auto-select conversation from URL parameter
	useEffect(() => {
		const conversationId = searchParams.get("conversationId");
		if (conversationId && conversations.length > 0) {
			const conversation = conversations.find((c) => c.id === conversationId);
			if (conversation && (!selectedConversation || selectedConversation.id !== conversationId)) {
				handleConversationClick(conversation);
				// Clean up URL parameter
				const url = new URL(window.location.href);
				url.searchParams.delete("conversationId");
				window.history.replaceState({}, "", url.toString());
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [conversations, searchParams]);

	// Fetch messages for a conversation
	const fetchMessages = async (conversationID: string) => {
		if (!userID) return;

		try {
			const response = await api(`/api/messages/conversations/${conversationID}`);

			if (response.status !== 200) {
				toastError("Error", "Failed to load messages");
				return;
			}

			const data = await response.json();
			setMessages(data.messages || []);

			// Mark messages as read
			await api(`/api/messages/conversations/${conversationID}`, {
				method: "PUT",
			});

			// Update unread count in conversations list
			setConversations((prev) =>
				prev.map((conv) => (conv.id === conversationID ? { ...conv, unreadCount: 0 } : conv))
			);

			// Trigger custom event to update unread count in parent
			// This ensures the sidebar badge updates when messages are marked as read
			window.dispatchEvent(new CustomEvent("unreadCountUpdate"));
		} catch (error) {
			console.error("Error fetching messages:", error);
			toastError("Error", "Failed to load messages");
		}
	};

	const handleConversationClick = async (conversation: Conversation) => {
		setSelectedConversation(conversation);
		setMessages([]);

		// Unsubscribe from previous channel
		if (channelRef.current) {
			channelRef.current.unbind_all();
			channelRef.current.unsubscribe();
		}

		// Subscribe to conversation channel for real-time messages
		if (pusherRef.current) {
			const channel = pusherRef.current.subscribe(`conversation-${conversation.id}`);

			channel.bind("new-message", (data: { message: Message }) => {
				// Check if this message is from the current user
				// If so, don't add it (it was already added when they sent it)
				if (data.message.senderId === userID) {
					return; // Don't add duplicate message
				}

				// Set isOwn based on whether the sender is the current user
				const messageToAdd: Message = {
					...data.message,
					isOwn: data.message.senderId === userID,
				};

				setMessages((prev) => {
					// Check if message already exists to avoid duplicates
					if (prev.some((m) => m.id === messageToAdd.id)) {
						return prev;
					}
					return [...prev, messageToAdd];
				});

				// Update conversation list with new message
				setConversations((prev) =>
					prev.map((conv) => {
						if (conv.id === conversation.id) {
							return {
								...conv,
								lastMessage: messageToAdd.content,
								time: messageToAdd.timestamp,
								unreadCount:
									selectedConversation?.id === conversation.id ? 0 : (conv.unreadCount || 0) + 1,
							};
						}
						return conv;
					})
				);

				// Trigger custom event to update unread count in parent
				// This ensures the sidebar badge updates when conversations change
				window.dispatchEvent(new CustomEvent("unreadCountUpdate"));

				// Scroll to bottom
				setTimeout(() => {
					messagesEndRef.current?.scrollIntoView({
						behavior: "smooth",
					});
				}, 100);
			});

			channelRef.current = channel;
		}

		// Fetch messages
		await fetchMessages(conversation.id);
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !selectedConversation || isSending) return;

		try {
			setIsSending(true);
			const response = await api("/api/messages/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					conversationID: selectedConversation.id,
					content: newMessage,
				}),
			});

			if (response.status !== 201) {
				const data = await response.json();
				toastError("Error", data.error || "Failed to send message");
				return;
			}

			const data = await response.json();
			// Add the message to the list (it's from the current user)
			const sentMessage: Message = {
				...data.message,
				isOwn: true,
			};
			setMessages((prev) => {
				// Check if message already exists to avoid duplicates
				if (prev.some((m) => m.id === sentMessage.id)) {
					return prev;
				}
				return [...prev, sentMessage];
			});
			setNewMessage("");

			// Update conversation list and reset unread count for this conversation
			setConversations((prev) =>
				prev.map((conv) => {
					if (conv.id === selectedConversation.id) {
						return {
							...conv,
							lastMessage: data.message.content,
							time: data.message.timestamp,
							unreadCount: 0, // Reset unread count since user is actively viewing
						};
					}
					return conv;
				})
			);

			// Trigger custom event to update unread count in parent
			window.dispatchEvent(new CustomEvent("unreadCountUpdate"));

			// Scroll to bottom
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({
					behavior: "smooth",
				});
			}, 100);
		} catch (error) {
			console.error("Error sending message:", error);
			toastError("Error", "Failed to send message");
		} finally {
			setIsSending(false);
		}
	};

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const filteredConversations = useMemo(() => {
		return conversations
			.filter((conv) => {
				// Filter by tab
				if (filterTab === "active") return conv.itemStatus !== "claimed";
				if (filterTab === "claimed") return conv.itemStatus === "claimed";
				return true; // "all"
			})
			.filter(
				(conv) =>
					conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
			);
	}, [conversations, filterTab, searchQuery]);

	return (
		<div className="h-[calc(100vh-180px)] flex flex-col overflow-hidden">
			{/* Header */}
			<section aria-labelledby="messages-heading" className="mb-4 flex-shrink-0">
				<h1
					id="messages-heading"
					className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-1"
				>
					Messages
				</h1>
				<p className="text-gray-600 dark:text-gray-400">Communicate about lost and found items</p>
			</section>

			{/* Messages Container */}
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 overflow-hidden">
				{/* Conversations List */}
				<aside
					className="lg:col-span-1 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 flex flex-col overflow-hidden"
					aria-label="Conversations list"
				>
					{/* Filter Tabs */}
					<div className="p-3 border-b border-gray-200 dark:border-neutral-800 flex-shrink-0">
						<div className="flex gap-1 bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
							<button
								type="button"
								onClick={() => setFilterTab("all")}
								className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
									filterTab === "all"
										? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 shadow-sm"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
								}`}
							>
								All ({counts.all})
							</button>
							<button
								type="button"
								onClick={() => setFilterTab("active")}
								className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
									filterTab === "active"
										? "bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
								}`}
							>
								Active ({counts.active})
							</button>
							<button
								type="button"
								onClick={() => setFilterTab("claimed")}
								className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
									filterTab === "claimed"
										? "bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-sm"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
								}`}
							>
								Claimed ({counts.claimed})
							</button>
						</div>
					</div>

					{/* Search */}
					<div className="p-3 border-b border-gray-200 dark:border-neutral-800 flex-shrink-0">
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
								className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
								aria-label="Search conversations"
							/>
						</div>
					</div>

					{/* Conversations */}
					<nav className="flex-1 overflow-y-auto">
						<ul role="list">
							{isLoading && conversations.length === 0 && (
								<li className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
									Loading conversations...
								</li>
							)}
							{!isLoading && filteredConversations.length === 0 && (
								<li className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
									No conversations yet
								</li>
							)}
							{filteredConversations.map((conversation) => (
								<li key={conversation.id}>
									<button
										type="button"
										onClick={() => handleConversationClick(conversation)}
										className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 ${
											selectedConversation?.id === conversation.id
												? "bg-emerald-50 dark:bg-emerald-900/20"
												: ""
										}`}
										aria-current={selectedConversation?.id === conversation.id ? "true" : undefined}
									>
										<div className="flex items-start gap-3">
											{/* Avatar */}
											<div
												className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium overflow-hidden"
												aria-hidden="true"
											>
												{(() => {
													const photo = (conversation as any).otherParticipant?.photo;
													const photoUrl = typeof photo === "string" ? photo : photo?.url;

													if (photoUrl && photoUrl.trim() !== "") {
														return (
															<Image
																src={photoUrl}
																alt={conversation.name}
																width={40}
																height={40}
																className="w-full h-full object-cover"
															/>
														);
													}

													return conversation.name
														.split(" ")
														.map((n) => n[0])
														.slice(0, 2)
														.join("")
														.toUpperCase();
												})()}
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-2 mb-1">
													<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
														{conversation.name}
													</p>
													<div className="flex items-center gap-2 flex-shrink-0">
														{conversation.unreadCount > 0 && (
															<span
																className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center"
																aria-label={`${conversation.unreadCount} new messages`}
															>
																{conversation.unreadCount > 99
																	? "99+"
																	: conversation.unreadCount}
															</span>
														)}
														<span className="text-xs text-gray-500 dark:text-gray-400">
															{conversation.time}
														</span>
													</div>
												</div>
												<div className="flex items-center gap-2 mb-1">
													<p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">
														{conversation.subject}
													</p>
													{conversation.itemStatus === "claimed" && (
														<span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
															Claimed
														</span>
													)}
												</div>
												<p className="text-xs text-gray-600 dark:text-gray-400 truncate">
													{conversation.lastMessage}
												</p>
											</div>
										</div>
									</button>
								</li>
							))}
						</ul>
					</nav>
				</aside>

				{/* Messages Panel */}
				<main
					className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 flex flex-col overflow-hidden"
					aria-label="Message thread"
				>
					{selectedConversation ? (
						<>
							{/* Conversation Header */}
							<header className="p-4 border-b border-gray-200 dark:border-neutral-800">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div
											className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-medium overflow-hidden"
											aria-hidden="true"
										>
											{(() => {
												const photo = (selectedConversation as any).otherParticipant?.photo;
												const photoUrl = typeof photo === "string" ? photo : photo?.url;

												if (photoUrl && photoUrl.trim() !== "") {
													return (
														<Image
															src={photoUrl}
															alt={selectedConversation.name}
															width={40}
															height={40}
															className="w-full h-full object-cover"
														/>
													);
												}

												return selectedConversation.name
													.split(" ")
													.map((n) => n[0])
													.slice(0, 2)
													.join("")
													.toUpperCase();
											})()}
										</div>
										<div>
											<h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
												{selectedConversation.name}
											</h2>
											<div className="flex items-center gap-2">
												<p className="text-xs text-emerald-600 dark:text-emerald-400">
													{selectedConversation.subject}
												</p>
												{isConversationClaimed && (
													<span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
														Claimed
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Three-dot Menu */}
									<div className="relative">
										<button
											type="button"
											onClick={() => setShowHeaderMenu(!showHeaderMenu)}
											className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
											aria-label="More options"
										>
											<MoreVertical size={20} className="text-gray-600 dark:text-gray-200" />
										</button>

										{showHeaderMenu && (
											<>
												{/* Backdrop to close menu */}
												<div
													className="fixed inset-0 z-10"
													onClick={() => setShowHeaderMenu(false)}
												/>
												{/* Dropdown Menu */}
												<div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 z-20 py-1">
													<button
														type="button"
														onClick={() => {
															setShowProfileModal(true);
															setShowHeaderMenu(false);
														}}
														className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
													>
														<Eye size={16} />
														View Profile
													</button>
												</div>
											</>
										)}
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
								{messages.length === 0 && (
									<div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
										<p>No messages yet. Start the conversation!</p>
									</div>
								)}
								{messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
									>
										<div className={`max-w-[70%] ${message.isOwn ? "order-2" : "order-1"}`}>
											<div
												className={`rounded-lg px-4 py-2 ${
													message.isOwn
														? "bg-emerald-600 dark:bg-emerald-500 text-white"
														: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
												}`}
											>
												<p className="text-sm">{message.content}</p>
											</div>
											<p
												className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
													message.isOwn ? "text-right" : "text-left"
												}`}
											>
												{message.timestamp}
											</p>
										</div>
									</div>
								))}
								<div ref={messagesEndRef} />
							</div>

							{/* Message Input */}
							{isConversationClaimed ? (
								<div className="p-4 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50">
									<div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
										<Lock size={16} />
										<span className="text-sm">
											This item has been claimed. Messaging is disabled.
										</span>
									</div>
								</div>
							) : (
								<form
									onSubmit={handleSendMessage}
									className="p-4 border-t border-gray-200 dark:border-neutral-800 flex-shrink-0"
								>
									<div className="flex gap-2">
										<input
											type="text"
											value={newMessage}
											onChange={(e) => setNewMessage(e.target.value)}
											placeholder="Type your message..."
											className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
											aria-label="Message input"
										/>
										<button
											type="submit"
											disabled={!newMessage.trim() || isSending}
											className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
											aria-label="Send message"
										>
											<Send size={20} aria-hidden="true" />
										</button>
									</div>
								</form>
							)}
						</>
					) : (
						<div className="flex-1 flex flex-col items-center justify-center text-center p-8">
							<div
								className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
								aria-hidden="true"
							>
								<MessageSquare size={32} className="text-gray-400 dark:text-gray-500" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
								Select a Conversation
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Choose a conversation from the list to start messaging
							</p>
						</div>
					)}

					{/* Profile View Modal */}
					{showProfileModal && selectedConversation && (
						<div
							className="fixed inset-0 z-50 flex items-center justify-center"
							onClick={() => setShowProfileModal(false)}
						>
							{/* Backdrop */}
							<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

							{/* Modal */}
							<div
								className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 w-full max-w-sm mx-4 overflow-hidden"
								onClick={(e) => e.stopPropagation()}
							>
								{/* Header Banner */}
								<div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-600" />

								{/* Profile Content */}
								<div className="px-6 pb-6">
									{/* Avatar */}
									<div className="-mt-12 mb-4 flex justify-center">
										<div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border-4 border-white dark:border-neutral-900 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-2xl overflow-hidden shadow-lg">
											{(() => {
												const photo = (selectedConversation as any).otherParticipant?.photo;
												const photoUrl = typeof photo === "string" ? photo : photo?.url;

												if (photoUrl && photoUrl.trim() !== "") {
													return (
														<Image
															src={photoUrl}
															alt={selectedConversation.name}
															width={96}
															height={96}
															className="w-full h-full object-cover"
														/>
													);
												}

												return selectedConversation.name
													.split(" ")
													.map((n) => n[0])
													.slice(0, 2)
													.join("")
													.toUpperCase();
											})()}
										</div>
									</div>

									{/* User Info */}
									<div className="text-center">
										<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
											{selectedConversation.name}
										</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
											@{(selectedConversation as any).otherParticipant?.username || "user"}
										</p>
										<p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
											{selectedConversation.subject}
										</p>
									</div>

									{/* Divider */}
									<div className="my-4 border-t border-gray-200 dark:border-neutral-700" />

									{/* Contact Details */}
									<div className="space-y-3">
										{(selectedConversation as any).otherParticipant?.email && (
											<div className="flex items-center gap-3 text-sm">
												<svg
													className="w-4 h-4 text-gray-400 shrink-0"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
												<span className="text-gray-600 dark:text-gray-300 truncate">
													{(selectedConversation as any).otherParticipant.email}
												</span>
											</div>
										)}
										{(selectedConversation as any).otherParticipant?.phone && (
											<div className="flex items-center gap-3 text-sm">
												<svg
													className="w-4 h-4 text-gray-400 shrink-0"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
													/>
												</svg>
												<span className="text-gray-600 dark:text-gray-300">
													{(selectedConversation as any).otherParticipant.phone}
												</span>
											</div>
										)}
										<div className="flex items-center gap-3 text-sm">
											<MessageSquare size={16} className="text-gray-400 shrink-0" />
											<span className="text-gray-600 dark:text-gray-400">
												Conversation started
											</span>
										</div>
									</div>

									{/* Close Button */}
									<button
										type="button"
										onClick={() => setShowProfileModal(false)}
										className="mt-6 w-full py-2.5 px-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
									>
										Close
									</button>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
