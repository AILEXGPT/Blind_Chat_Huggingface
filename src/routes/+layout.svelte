<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { goto, invalidate } from "$app/navigation";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import "../styles/main.css";
	import { base } from "$app/paths";
	import { PUBLIC_ORIGIN, PUBLIC_APP_DISCLAIMER } from "$env/static/public";

	import { shareConversation } from "$lib/shareConversation";
	import { UrlDependency } from "$lib/types/UrlDependency";
	import { error } from "$lib/stores/errors";

	import MobileNav from "$lib/components/MobileNav.svelte";
	import NavMenu from "$lib/components/NavMenu.svelte";
	import Toast from "$lib/components/Toast.svelte";
	import ConfirmModal from "$lib/components/ConfirmModal.svelte";
	import SettingsModal from "$lib/components/SettingsModal.svelte";
	import LoadingModal from "$lib/components/LoadingModal.svelte";
	import LoginModal from "$lib/components/LoginModal.svelte";
	import { PUBLIC_APP_ASSETS, PUBLIC_APP_NAME } from "$env/static/public";
	import {
		isloading_writable,
		refresh_chats_writable,
		refresh_chats_writable_empty,
	} from "./LayoutWritable";
	import {
		deleteAllChats,
		deleteChat,
		getChats,
		getMessages,
		modifyTitle,
	} from "../routes/LocalDB";
	import { env } from "$env/dynamic/public";

	export let data;
	let isloading = false;
	let showWarning = true;

	let go_to_main = false;

	let conversations_list = [];

	isloading_writable.subscribe((value) => {
		isloading = value;
	});

	let isNavOpen = false;
	let isSettingsOpen = false;
	let errorToastTimeout: ReturnType<typeof setTimeout>;
	let currentError: string | null;

	refresh_chats_writable.subscribe(async (value) => {
		if (value.length > 0) {
			conversations_list = value;
			refresh_chats_writable.set([]);
		}
	});

	refresh_chats_writable_empty.subscribe(async (value) => {
		conversations_list = [];
		refresh_chats_writable.set(conversations_list);
	});

	export function getProgress(progress: number) {}

	async function onError() {
		// If a new different error comes, wait for the current error to hide first
		if ($error && currentError && $error !== currentError) {
			clearTimeout(errorToastTimeout);
			currentError = null;
			await new Promise((resolve) => setTimeout(resolve, 300));
		}

		currentError = $error;

		errorToastTimeout = setTimeout(() => {
			$error = null;
			currentError = null;
		}, 3000);
	}

	async function deleteConversation(id: string) {
		await deleteChat(id);

		if ($page.params.id !== id) {
			await invalidate(UrlDependency.ConversationList);
		} else {
			await goto(`${base}/`, { invalidateAll: true });
		}
	}

	async function deleteAllConversations(id: string) {
		await deleteAllChats();

		if ($page.params.id !== id) {
			await invalidate(UrlDependency.ConversationList);
		} else {
			await goto(`${base}/`, { invalidateAll: true });
		}
	}

	async function editConversationTitle(id: string, title: string) {
		await modifyTitle(id, title);
	}

	onMount(async () => {
		await refreshChats();
	});

	onDestroy(() => {
		clearTimeout(errorToastTimeout);
	});

	$: if ($error) onError();

	const requiresLogin =
		!$page.error &&
		!$page.route.id?.startsWith("/r/") &&
		(data.requiresLogin
			? !data.user
			: !data.settings.ethicsModalAcceptedAt && !!PUBLIC_APP_DISCLAIMER);

	let loginModalVisible = false;

	async function refreshChats() {
		let ret = await getChats();
		data.conversations = ret;
		conversations_list = ret;
	}
	$: title = env.PUBLIC_APP_NAME;
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME}</title>
	<meta name="description" content="Private Conversational AI" />
	<meta property="og:title" content={PUBLIC_APP_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{PUBLIC_ORIGIN || $page.url.origin}{base}" />
	<meta
		property="og:image"
		content="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/thumbnail.jpg"
	/>
	<link
		rel="icon"
		href="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/favicon.png"
		type="image/png"
	/>
	<!-- Icon Support for iOS Bookmark Home Screen -->
	<link
		rel="apple-touch-icon"
		href="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/touch-icon-ipad-retina.png"
		sizes="167x167"
		type="image/png"
	/>
	<link
		rel="apple-touch-icon"
		href="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/touch-icon-ipad.png"
		sizes="152x152"
		type="image/png"
	/>
	<link
		rel="apple-touch-icon"
		href="{PUBLIC_ORIGIN ||
			$page.url.origin}{base}/{PUBLIC_APP_ASSETS}/touch-icon-iphone-retina.png"
		sizes="180x180"
		type="image/png"
	/>
</svelte:head>

<div
	class="grid h-full w-screen grid-cols-1 grid-rows-[auto,1fr] overflow-hidden text-smd dark:text-gray-300 md:grid-cols-[280px,1fr] md:grid-rows-[1fr]"
>
	<MobileNav
		isOpen={isNavOpen}
		on:toggle={(ev) => (isNavOpen = ev.detail)}
		title={conversations_list.find((conv) => conv.id === $page.params.id)?.title}
	>
		<NavMenu
			conversations={conversations_list}
			user={data.user}
			canLogin={data.user === undefined && data.requiresLogin}
			bind:loginModalVisible
			on:shareConversation={(ev) => shareConversation(ev.detail.id, ev.detail.title)}
			on:deleteConversation={(ev) => deleteConversation(ev.detail)}
			on:clickSettings={() => (isSettingsOpen = true)}
			on:editConversationTitle={(ev) => editConversationTitle(ev.detail.id, ev.detail.title)}
		/>
	</MobileNav>
	<nav class="grid max-h-screen grid-cols-1 grid-rows-[auto,1fr,auto] max-md:hidden">
		<NavMenu
			conversations={conversations_list}
			user={data.user}
			canLogin={data.user === undefined && data.requiresLogin}
			bind:loginModalVisible
			on:shareConversation={(ev) => shareConversation(ev.detail.id, ev.detail.title)}
			on:deleteConversation={(ev) => deleteConversation(ev.detail)}
			on:clickSettings={() => (isSettingsOpen = true)}
			on:editConversationTitle={(ev) => editConversationTitle(ev.detail.id, ev.detail.title)}
		/>
	</nav>
	{#if currentError}
		<Toast message={currentError} />
	{/if}
	{#if showWarning}
		<ConfirmModal on:close={() => (showWarning = false)} />
	{/if}
	{#if isloading}
		<LoadingModal />
	{/if}
	{#if isSettingsOpen}
		<SettingsModal
			on:close={() => (isSettingsOpen = false)}
			on:deleteAllConversations={() => ((isSettingsOpen = false), deleteAllChats())}
			settings={data.settings}
			models={data.models}
		/>
	{/if}
	{#if (requiresLogin && data.messagesBeforeLogin === 0) || loginModalVisible}
		<LoginModal settings={data.settings} />
	{/if}
	<slot />
</div>
