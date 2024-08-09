<script lang="ts">
	import '$lib/app.css';

	export let data;

	import { goto } from '$app/navigation';
	import type { BusinessCard } from '$lib/types/businessCard.js';

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let businessCards: BusinessCard[] = [];

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

	async function fetchBusinessCards() {
		const { data, error } = await supabase
			.from('business_cards')
			.select('*')
			.eq('creator_id', session?.user?.id);

		if (error) {
			console.error('Error fetching business cards:', error);
			return;
		}

		businessCards = data;
		console.log(businessCards);
	}

	async function loadData() {
		const user = await validateSession();
		if (user) {
			await fetchBusinessCards();
		}
	}

	$: loadData();

	async function createBusinessCard() {
		const { data, error } = await supabase.from('business_cards').insert({
			full_name: 'Placeholder Name',
			email: 'placeholder@example.com',
			creator_id: session?.user.id
		});

		if (error) {
			console.error('Error creating business card:', error);
			return;
		}

		const latestCardId = await getLatestCardId(session?.user.id);
		goto(latestCardId);
	}

	async function getLatestCardId(creatorId: string | undefined) {
		if (!creatorId) return null;

		const { data, error } = await supabase
			.from('business_cards')
			.select('uuid, created_at')
			.eq('creator_id', creatorId)
			.order('created_at', { ascending: false })
			.limit(1);

		if (error) {
			console.error('Error fetching latest card:', error);
			return null;
		}

		return data?.length ? data[0].uuid : null;
	}

	async function deleteBusinessCard(businessCard: BusinessCard) {
		const { error } = await supabase.from('business_cards').delete().eq('uuid', businessCard.uuid);

		if (error) {
			console.error('Error deleting business card:', error);
			return;
		}

		// Update businessCards array after successful deletion
		businessCards = businessCards.filter((card) => card.uuid !== businessCard.uuid);
	}
</script>

<header class="flex justify-between items-center mb-5">
	<h1 class="text-3xl dark:text-white">Your business cards</h1>

	<button
		on:click={createBusinessCard}
		type="button"
		class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
	>
		Create new business card
	</button>
</header>

{#if businessCards.length < 1}
	<div class="w-full flex justify-between align-center border rounded p-5 dark:border-neutral-700">
		<h2 class=" text-gray-800 dark:text-white">You have no business cards</h2>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-corner-right-up size-5"
			><polyline points="10 9 15 4 20 9" /><path d="M4 20h7a4 4 0 0 0 4-4V4" /></svg
		>
	</div>
{:else}
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
		{#each businessCards as businessCard}
			<div
				class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
			>
				<div
					class="flex justify-between items-center border-b rounded-t-xl py-3 px-4 md:px-5 dark:border-neutral-700"
				>
					<h3 class="text-lg font-bold text-gray-800 dark:text-white">{businessCard.full_name}</h3>

					<div class="flex items-center gap-x-1">
						<button
							type="button"
							class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-none focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-300 dark:hover:text-red-400 dark:focus:text-red-400"
							on:click={() => deleteBusinessCard(businessCard)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-trash-2 size-4"
								><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
									d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
								/><line x1="10" x2="10" y1="11" y2="17" /><line
									x1="14"
									x2="14"
									y1="11"
									y2="17"
								/></svg
							>
							Delete
						</button>
					</div>
				</div>
				<div class="p-4 md:p-5">
					<a
						class="inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
						href={`${businessCard.uuid}`}
					>
						Edit
						<svg
							class="shrink-0 size-4"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="m9 18 6-6-6-6"></path>
						</svg>
					</a>
				</div>
			</div>
		{/each}
	</div>
{/if}
