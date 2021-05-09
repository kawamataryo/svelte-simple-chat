<script>
import { onMount, tick } from 'svelte';
import Message from './components/Message.svelte'
import MessageForm from './components/MessageForm.svelte'

const currentUserId = Math.random().toString(32).substring(2)
let message = '';
let messages = [];
let socket = null;
let board;

const scrollToBottom = async () => {
  await tick();
  board.scrollTop = board.scrollHeight;
}

const handleSubmit = () => {
  if (!message) {
    return
  }
  messages = [...messages, message]
  scrollToBottom()
  socket.send(JSON.stringify({userId: currentUserId, message}))
  message = ""
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
    <h1>Svelte Sample Chat</h1>
    <div class="board" bind:this={board} >
      {#each messages as {userId, message: mg}, i}
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

  .message-form-wrapper {
    display: flex;
  }

  .board {
    padding: 1em;
    margin: 0 auto 1em;
    background-color: #ebeeee;
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
</style>
