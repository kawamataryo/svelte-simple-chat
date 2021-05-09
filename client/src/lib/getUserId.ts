export const getUserId = (): string => {
  let id = localStorage.getItem('sample-chat-userId')
  if(id) {
    return id
  }
  id = Math.random().toString(32).substring(2)
  localStorage.setItem('sample-chat-userId', id)
  return id
}
