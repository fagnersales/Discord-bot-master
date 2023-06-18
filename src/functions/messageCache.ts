type MessageCache = {
    userMessageId: string
    replyMessageId: string
  }
  
  export const messagesCache = new Set<MessageCache>()