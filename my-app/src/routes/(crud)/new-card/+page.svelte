<script lang="ts">
	import { supabase } from '../../../supabaseClient';
	import { writable } from 'svelte/store';

	let firstName = '';
	let lastName = '';
	let error = writable<string | null>(null);
	let success = writable<string | null>(null);

	const createBusinessCard = async () => {
		if (!firstName || !lastName) {
			error.set('First name and last name are required');
			return;
		}
		error.set(null);
		const { data, error: supabaseError } = await supabase
			.from('business_cards')
			.insert([{ first_name: firstName, last_name: lastName }]);

		if (supabaseError) {
			error.set(supabaseError.message);
		} else {
			success.set('Business card created successfully');
			firstName = '';
			lastName = '';
		}
	};
</script>

<a href="/">
	<button
		type="button"
		class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
	>
		go home
	</button>
</a>

<form on:submit|preventDefault={createBusinessCard}>
	<div>
		<label for="firstName">First Name</label>
		<input type="text" id="firstName" bind:value={firstName} placeholder="Enter first name" />
	</div>
	<div>
		<label for="lastName">Last Name</label>
		<input type="text" id="lastName" bind:value={lastName} placeholder="Enter last name" />
	</div>
	<button type="submit">Create Business Card</button>
	{#if $error}
		<div class="error">{$error}</div>
	{/if}
	{#if $success}
		<div class="success">{$success}</div>
	{/if}
</form>

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
</style>
