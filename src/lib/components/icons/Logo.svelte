<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_APP_ASSETS, PUBLIC_APP_NAME, PUBLIC_ORIGIN } from "$env/static/public";
	import { base } from "$app/paths";

	export let classNames = "";
</script>

{#if PUBLIC_APP_ASSETS === "chatui"}
	<object
		class={classNames}
		data="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/chat.png"
		title="{PUBLIC_APP_NAME} logo"
	/>
{:else}
	<object
		class={classNames}
		data="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/favicon.png"
		title="{PUBLIC_APP_NAME} logo"
	/>
{/if}
