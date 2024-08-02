<script>
	import { goto } from '$app/navigation';
</script>

<header class="flex justify-between items-center">
	<h1 class="text-3xl dark:text-white">Your business cards</h1>

	<button
		on:click={() => goto('/new-card')}
		type="button"
		class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
	>
		Create new business card
	</button>
</header>
