<script lang="ts">
	import { goto } from '$app/navigation';
	import type { BusinessCard } from '$lib/types/businessCard.js';
	export let data;

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

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
	{#each businessCards as businessCard}
		<div
			class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
		>
			<div class="p-4 md:p-5">
				<h3 class="text-lg font-bold text-gray-800 dark:text-white">{businessCard.full_name}</h3>
				<a
					class="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
					href={`${businessCard.uuid}`}
				>
					Edit card
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
