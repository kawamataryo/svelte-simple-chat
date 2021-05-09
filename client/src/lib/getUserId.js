export const getUserId = () => {
  const id = localStorage.getItem('sample-chat-userId')
  if(id) {
    return id
  }
  localStorage.setItem('sample-chat-userId', Math.random().toString(32).substring(2))
}
