<script>
import { onMount } from 'svelte';
import Message from './components/Message.svelte'
import MessageForm from './components/MessageForm.svelte'

const currentUserId = Math.random().toString(32).substring(2)
let message = '';
let messages = [];
let socket = null;
let board;

const scrollBottom = () => {
  setTimeout(() =>  {board.scrollTop = board.scrollHeight}, 0);
}

const handleSubmit = () => {
  if (!message) {
    return
  }
  messages = [...messages, message]
  scrollBottom()
  socket.send(JSON.stringify({currentUserId, message}))
  message = ""
}

onMount(() => {
  socket = new WebSocket('ws://localhost:8082');

  socket.onopen = () => {
    console.log("socket connected")
  }

  socket.onmessage = (event) => {
    messages = JSON.parse(event.data)
    scrollBottom()
  };
})
</script>

<main>
  <h1>Svelte Sample Chat</h1>
  <div class="board" bind:this={board} >
    {#each messages as {userId, message: mg}, i}
      <Message currentUser={currentUserId} userId={userId} message={mg} />
    {/each}
  </div>
  <div class="message-form-wrapper">
    <MessageForm bind:message={message} on:submit={handleSubmit}/>
  </div>
</main>

<style>
  .message-form-wrapper {
    position: fixed;
    display: flex;
    width: 390px;
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    bottom: -20px;
  }

  .board {
    padding: 1em;
    max-width: 400px;
    margin: 0 auto;
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
