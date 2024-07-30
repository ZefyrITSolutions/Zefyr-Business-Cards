<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const dispatch = createEventDispatcher();

	let email = '';
	let password = '';
	let confirmPassword = '';
	let errorMessage = '';

	const handleSignUp = async () => {
		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		const { error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			errorMessage = error.message;
		} else {
			dispatch('signedUp', { email });
		}
	};

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		handleSignUp();
	};
</script>

<div
	class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700"
>
	<div class="p-4 sm:p-7">
		<div class="text-center">
			<h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
			<p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
				Already have an account?
				<a
					class="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
					href="../examples/html/signin.html"
				>
					Sign in here
				</a>
			</p>
		</div>

		<div class="mt-5">
			<form on:submit={handleSubmit}>
				<div class="grid gap-y-4">
					<div>
						<label for="email" class="block text-sm mb-2 dark:text-white">Email address</label>
						<div class="relative">
							<input
								type="email"
								id="email"
								name="email"
								class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
								bind:value={email}
								required
								aria-describedby="email-error"
							/>
						</div>
					</div>
					<div>
						<label for="password" class="block text-sm mb-2 dark:text-white">Password</label>
						<div class="relative">
							<input
								type="password"
								id="password"
								name="password"
								class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
								bind:value={password}
								required
								aria-describedby="password-error"
							/>
						</div>
					</div>
					<div>
						<label for="confirm-password" class="block text-sm mb-2 dark:text-white"
							>Confirm Password</label
						>
						<div class="relative">
							<input
								type="password"
								id="confirm-password"
								name="confirm-password"
								class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
								bind:value={confirmPassword}
								required
								aria-describedby="confirm-password-error"
							/>
						</div>
					</div>
					<div class="flex items-center">
						<div class="flex">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
							/>
						</div>
						<div class="ms-3">
							<label for="remember-me" class="text-sm dark:text-white"
								>I accept the <a
									class="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
									href="/">Terms and Conditions</a
								></label
							>
						</div>
					</div>
					{#if errorMessage}
						<p class="text-xs text-red-600 mt-2">{errorMessage}</p>
					{/if}
					<button
						type="submit"
						class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
						>Sign up</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
