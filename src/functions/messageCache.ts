type MessageCache = {
    userMessageId: string
    replyMessageId: string
  }
  
  export const messageCache = new Set<MessageCache>()