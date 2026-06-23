import { Client } from '@stomp/stompjs'

let stompClient = null
let connectionCallbacks = []
let messageCallbacks = []

const getWebSocketUrl = () => {
  return import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'
}

export const connectWebSocket = (userId) => {
  return new Promise((resolve) => {
    if (stompClient && stompClient.connected) {
      resolve({ success: true, client: stompClient })
      return
    }

    const timeout = setTimeout(() => {
      console.error('WebSocket connection timeout')
      resolve({ success: false })
    }, 10000)

    try {
      stompClient = new Client({
        brokerURL: getWebSocketUrl(),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: () => {}
      })

      stompClient.onConnect = () => {
        clearTimeout(timeout)
        try {
          stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
            try {
              const data = JSON.parse(message.body)
              messageCallbacks.forEach(callback => callback(data))
            } catch (e) {
              console.error('解析消息失败:', e)
            }
          })

          stompClient.subscribe(`/user/${userId}/queue/conversations`, () => {
            connectionCallbacks.forEach(callback => callback())
          })
        } catch (e) {
          console.error('订阅失败:', e)
        }
        resolve({ success: true, client: stompClient })
      }

      stompClient.onStompError = (frame) => {
        clearTimeout(timeout)
        console.error('STOMP error:', frame)
        resolve({ success: false })
      }

      stompClient.onWebSocketError = (error) => {
        clearTimeout(timeout)
        console.error('WebSocket error:', error)
        resolve({ success: false })
      }

      stompClient.onDisconnect = () => {
        console.log('WebSocket disconnected')
      }

      stompClient.activate()
    } catch (e) {
      clearTimeout(timeout)
      console.error('WebSocket初始化失败:', e)
      resolve({ success: false })
    }
  })
}

export const disconnectWebSocket = () => {
  if (stompClient) {
    try {
      stompClient.deactivate()
    } catch (e) {
      console.error('断开WebSocket失败:', e)
    }
    stompClient = null
  }
}

export const onMessageReceived = (callback) => {
  messageCallbacks.push(callback)
}

export const onConversationUpdate = (callback) => {
  connectionCallbacks.push(callback)
}

export const removeMessageCallback = (callback) => {
  messageCallbacks = messageCallbacks.filter(cb => cb !== callback)
}

export const removeConversationCallback = (callback) => {
  connectionCallbacks = connectionCallbacks.filter(cb => cb !== callback)
}

export const isConnected = () => {
  return stompClient && stompClient.connected
}