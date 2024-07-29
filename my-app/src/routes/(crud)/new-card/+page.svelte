<script lang="ts">
	import { supabase } from '../../../supabaseClient';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	interface BusinessCard {
		id: number;
		first_name: string;
		last_name: string;
	}

	let firstName = '';
	let lastName = '';
	let error = writable<string | null>(null);
	let success = writable<string | null>(null);
	let businessCards = writable<BusinessCard[]>([]);
	let editingCard: BusinessCard | null = null;

	const loadBusinessCards = async () => {
		const { data, error: supabaseError } = await supabase.from('business_cards').select('*');

		if (supabaseError) {
			error.set(supabaseError.message);
		} else {
			businessCards.set(data);
		}
	};

	const createOrUpdateBusinessCard = async () => {
		if (!firstName || !lastName) {
			error.set('First name and last name are required');
			return;
		}
		error.set(null);

		if (editingCard) {
			const { error: supabaseError } = await supabase
				.from('business_cards')
				.update({ first_name: firstName, last_name: lastName })
				.eq('id', editingCard.id);

			if (supabaseError) {
				error.set(supabaseError.message);
			} else {
				success.set('Business card updated successfully');
				editingCard = null;
			}
		} else {
			const { data, error: supabaseError } = await supabase
				.from('business_cards')
				.insert([{ first_name: firstName, last_name: lastName }]);

			if (supabaseError) {
				error.set(supabaseError.message);
			} else {
				success.set('Business card created successfully');
			}
		}

		firstName = '';
		lastName = '';
		loadBusinessCards();
	};

	const deleteBusinessCard = async (id: number) => {
		const { error: supabaseError } = await supabase.from('business_cards').delete().eq('id', id);

		if (supabaseError) {
			error.set(supabaseError.message);
		} else {
			loadBusinessCards();
		}
	};

	const startEdit = (card: BusinessCard) => {
		editingCard = { ...card };
		firstName = card.first_name;
		lastName = card.last_name;
	};

	onMount(() => {
		loadBusinessCards();
	});
</script>

<main>
	<h1>Business Cards</h1>

	<form on:submit|preventDefault={createOrUpdateBusinessCard}>
		<div>
			<label for="firstName">First Name</label>
			<input type="text" id="firstName" bind:value={firstName} placeholder="Enter first name" />
		</div>
		<div>
			<label for="lastName">Last Name</label>
			<input type="text" id="lastName" bind:value={lastName} placeholder="Enter last name" />
		</div>
		<button type="submit">{editingCard ? 'Update' : 'Create'} Business Card</button>
		{#if $error}
			<div class="error">{$error}</div>
		{/if}
		{#if $success}
			<div class="success">{$success}</div>
		{/if}
	</form>

	{#if $businessCards.length}
		<table>
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each $businessCards as card}
					<tr>
						<td>{card.first_name}</td>
						<td>{card.last_name}</td>
						<td>
							<button on:click={() => startEdit(card)}>Edit</button>
							<button on:click={() => deleteBusinessCard(card.id)}>Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</main>

<style>
	form {
		max-width: 400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
	}
	input,
	button {
		margin: 0.5rem 0;
	}
	.error,
	.success {
		color: white;
		padding: 0.5rem;
		border-radius: 5px;
	}
	.error {
		background-color: red;
	}
	.success {
		background-color: green;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
	}
	th,
	td {
		padding: 0.5rem;
		border: 1px solid #ccc;
	}
	th {
		background-color: #f4f4f4;
	}
	button {
		margin-right: 0.5rem;
	}
</style>
