<script lang="ts">
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const dispatch = createEventDispatcher();

	let email = '';
	let password = '';
	let confirmPassword = '';
	let displayName = '';
	let errorMessage = '';
	let successMessage = '';
	let isTermsAccepted = false;
	let sessionLoaded = false;

	const handleSignUp = async () => {
		// Check for password match
		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		// Check if terms and conditions are accepted
		if (!isTermsAccepted) {
			errorMessage = 'You must accept the terms and conditions';
			return;
		}

		errorMessage = ''; // Clear the error message if terms are accepted

		try {
			// Attempt to sign up the user with Supabase
			const { error, data: authData } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						display_name: displayName
					}
				}
			});

			// Handle errors during sign up
			if (error) {
				errorMessage = error.message;
			} else {
				// If sign up is successful, insert additional user data into the database
				if (authData.user !== null) {
					const { error: insertError } = await supabase.from('business_cards').insert([
						{
							// Use the generated UUID from Supabase auth
							uuid: authData.user.id, // Assuming authData.user.id is the UUID

							full_name: displayName,
							email: authData.user.email,
							creator_id: authData.user.id
						}
					]);

					if (insertError) {
						errorMessage = insertError.message;
					} else {
						dispatch('signedUp', { email });
						successMessage = 'Your account was created successfully';

						// Wait for session to load before navigating to the dashboard
						sessionLoaded = false;
						const {
							data: { session }
						} = await supabase.auth.getSession();
						sessionLoaded = true;

						if (session) {
							// Navigate to the user's dashboard after successful sign up
							goto(`/${session.user.user_metadata.display_name}/dashboard`);
						} else {
							console.log('Session not loaded');
						}
					}
				}
			}
		} catch (error) {
			console.error('Error during sign-up:', error);
			errorMessage = 'An error occurred during sign-up';
		}
	};

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		handleSignUp();
	};
</script>

<div
	class="w-11/12 max-w-md mx-auto mt-20 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700"
>
	<div class="p-4 sm:p-7">
		<div class="text-center">
			<h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
			<p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
				Already have an account?
				<a
					class="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
					href="/signin"
				>
					Sign in here
				</a>
			</p>
		</div>

		<div class="mt-5">
			<button
				type="button"
				class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
			>
				<svg class="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
					<path
						d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
						fill="#4285F4"
					/>
					<path
						d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
						fill="#34A853"
					/>
					<path
						d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
						fill="#FBBC05"
					/>
					<path
						d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
						fill="#EB4335"
					/>
				</svg>
				Sign in with Google
			</button>

			<div
				class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600"
			>
				Or
			</div>
			<form on:submit={handleSubmit}>
				<div class="grid gap-y-4">
					<div>
						<label for="display-name" class="block text-sm font-medium mb-2 dark:text-white"
							>Full name</label
						>
						<div class="relative">
							<input
								type="text"
								id="display-name"
								name="display-name"
								class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
								bind:value={displayName}
								required
								aria-describedby="display-name-error"
							/>
						</div>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium mb-2 dark:text-white"
							>Email address</label
						>
						<div class="relative">
							<input
								type="email"
								id="email"
								name="email"
								class="py-3 px-4 block w-full border border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
								class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
								class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
								class="shrink-0 mt-0.5 border border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
								bind:checked={isTermsAccepted}
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
					{#if !isTermsAccepted && errorMessage}
						<p class="text-xs text-red-600 mt-2">{errorMessage}</p>
					{/if}

					<button
						type="submit"
						class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
						>Sign up</button
					>
					{#if successMessage}
						<p class="text-xs text-center text-green-600 mt-2">{successMessage}</p>
					{/if}
				</div>
			</form>
		</div>
	</div>
</div>
