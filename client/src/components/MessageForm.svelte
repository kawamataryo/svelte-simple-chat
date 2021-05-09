<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let message;

  const dispatch = createEventDispatcher();

  const handleSubmit = () => {
    dispatch('submit')
  }

</script>

<input bind:value={message} class="input" type="text" placeholder="Your message">
<button class="button is-link" on:click={handleSubmit}>submit</button>
