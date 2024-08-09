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

	let businessCardUuid: string | undefined;
	let full_name: string = '';
	let email: string = '';

	onMount(async () => {
		const user = await validateSession();
		if (!user) return;

		businessCardUuid = $page.params.businessCardId;
		const isOwner = await validateOwnership(businessCardUuid);

		if (!isOwner) {
			goto('/signin'); // Or any other appropriate page
		}

		// Fetch existing data for the business card
		const { data: existingCard, error } = await supabase
			.from('business_cards')
			.select('*')
			.eq('uuid', businessCardUuid)
			.single();

		if (error) {
			console.error('Error fetching business card:', error);
			return;
		}

		full_name = existingCard?.full_name || '';
		email = existingCard?.email || '';
	});

	async function updateBusinessCard() {
		const { data, error } = await supabase
			.from('business_cards')
			.update({ full_name, email })
			.eq('uuid', businessCardUuid);

		if (error) {
			console.error('Error updating business card:', error);
			return;
		}
		// Optionally redirect after successful update
	}
</script>

<form on:submit={updateBusinessCard}>
	<div class="max-w-sm">
		<label for="input-label" class="block text-sm font-medium mb-2 dark:text-white">Full name</label
		>
		<input
			type="text"
			id="full_name"
			bind:value={full_name}
			class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="you@site.com"
		/>
	</div>
	<div class="max-w-sm">
		<label for="input-label" class="block text-sm font-medium mb-2 dark:text-white">Email</label>
		<input
			type="email"
			id="email"
			bind:value={email}
			class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
			placeholder="you@site.com"
		/>
	</div>
	<button
		type="submit"
		class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
		>Update</button
	>
</form>
