<script lang="ts">
	export let data;

	import { goto, invalidateAll, afterNavigate } from '$app/navigation';
	import ThemeSwitch from '$lib/components/ThemeSwitch/ThemeSwitch.svelte';

	afterNavigate(() => {
		window.HSStaticMethods.autoInit();
	});

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	supabase.auth.onAuthStateChange(async (event, session) => {
		if (event === 'SIGNED_IN') {
			invalidateAll();
		}

		if (event === 'SIGNED_OUT') {
			await goto('/signin');
			invalidateAll();
		}
	});
</script>

<slot />
