<script lang="ts">
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	import { onMount } from 'svelte';
	import '$lib/app.css';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	async function validateSession() {
		const { data: user, error } = await supabase.auth.getUser();

		if (error) {
			console.error('Error validating session:', error);
			goto('/signin'); // Redirect to root URL
			return null;
		}

		console.log('User information:', user);
		return user;
	}

	async function validateOwnership(businessCardUuid: string) {
		const { data: businessCard, error } = await supabase
			.from('business_cards')
			.select('*')
			.eq('uuid', businessCardUuid)
			.single();

		if (error) {
			console.error('Error fetching business card:', error);
			return false;
		}

		return businessCard?.creator_id === session?.user.id;
	}

	onMount(async () => {
		const user = await validateSession();
		if (!user) return;

		const businessCardUuid = $page.params.businessCardId;
		const isOwner = await validateOwnership(businessCardUuid);

		if (!isOwner) {
			goto('/signin'); // Or any other appropriate page
		}
	});

	async function signOut() {
		let { error } = await supabase.auth.signOut();
	}
</script>

<h1>edit page</h1>
