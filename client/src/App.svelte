<script lang="ts">
import { onMount, tick } from 'svelte';
import Message from './components/Message.svelte'
import MessageForm from './components/MessageForm.svelte'
import { getUserId } from './lib/getUserId'

let message = '';
let messages: {userId: string, message: string}[] = [];
let socket: null | WebSocket = null;
let board: null | Element;

const currentUserId = getUserId();

const scrollToBottom = async () => {
  await tick();
  board.scrollTop = board.scrollHeight;
}

const handleSubmit = () => {
  if (!message) {
    return
  }
  messages = [...messages, { userId: currentUserId, message}]
  socket.send(JSON.stringify({userId: currentUserId, message}))
  message = ""
  scrollToBottom()
}

onMount(() => {
  socket = new WebSocket('ws://localhost:8082');

  socket.onopen = () => {
    console.log("socket connected")
  }

  socket.onmessage = (event) => {
    messages = JSON.parse(event.data)
    scrollToBottom()
  };
})
</script>

<main>
  <div class="wrapper">
    <h1>Svelte simple chat</h1>
    <div class="board" bind:this={board} >
      {#each messages as {userId, message: mg}}
        <Message currentUserId={currentUserId} userId={userId} message={mg} />
      {/each}
    </div>
    <div class="message-form-wrapper">
      <MessageForm bind:message={message} on:submit={handleSubmit}/>
    </div>
  </div>
</main>

<style>
  .wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: auto;
  }

  .board {
    width: 100%;
    padding: 1em;
    margin: 0 auto 1em;
    background-color: #ebeeee;
    border-radius: 3px;
    height: 85vh;
    overflow: scroll;
    scroll-behavior: smooth;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    text-align: center;
    font-size: 2em;
    font-weight: 400;
  }

  .message-form-wrapper {
    display: flex;
  }
</style>
