import { useEffect, useRef, useState } from 'react'
import { Input, Button, message, AutoComplete } from 'antd'
import { SendOutlined, WechatOutlined } from '@ant-design/icons'
import { getConversations, getConversation, sendMessage, getAuth, searchUsers } from '../api'
import { connectWebSocket, disconnectWebSocket, onMessageReceived, onConversationUpdate, removeMessageCallback, removeConversationCallback } from '../utils/websocket'

export default function Messages() {
  const { userId } = getAuth()
  const [inbox, setInbox] = useState([])
  const [peerId, setPeerId] = useState(null)
  const [peerName, setPeerName] = useState('')
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const chatBoxRef = useRef(null)

  const loadInbox = async () => setInbox(await getConversations())
  const loadChat = async id => {
    if (!id) return
    const chat = await getConversation(id)
    setMessages(chat)
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
      }
    }, 50)
  }

  useEffect(() => { loadInbox() }, [])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (searchKeyword.trim()) {
      searchUsers(searchKeyword.trim()).then(res => {
        const data = res || []
        setSearchResults(data.filter(item => item && item.userId && item.nickname))
      }).catch(() => {
        setSearchResults([])
      })
    } else {
      setSearchResults([])
    }
  }, [searchKeyword])

  useEffect(() => {
    const initWebSocket = async () => {
      if (!userId) return
      try {
        const result = await connectWebSocket(userId)
        setIsConnected(result.success)
      } catch (e) {
        console.error('WebSocket连接失败:', e)
        setIsConnected(false)
      }
    }

    initWebSocket()

    return () => {
      disconnectWebSocket()
      setIsConnected(false)
    }
  }, [userId])

  useEffect(() => {
    if (!isConnected) return

    const handleMessage = async (data) => {
      if (data.type === 'NEW_MESSAGE') {
        if (peerId === data.senderId) {
          await loadChat(peerId)
        } else {
          message.info('收到新消息')
        }
        await loadInbox()
      }
    }

    const handleConversationUpdate = async () => {
      await loadInbox()
      if (peerId) {
        await loadChat(peerId)
      }
    }

    onMessageReceived(handleMessage)
    onConversationUpdate(handleConversationUpdate)

    return () => {
      removeMessageCallback(handleMessage)
      removeConversationCallback(handleConversationUpdate)
    }
  }, [isConnected, peerId])

  const send = async () => {
    if (!peerId || !content.trim()) return
    try {
      await sendMessage({ receiverId: Number(peerId), content: content.trim() })
      setContent('')
      message.success('已发送')
      loadChat(peerId)
      loadInbox()
    } catch (e) {
      message.error('发送失败')
    }
  }

  const selectPeer = async (id, name) => {
    setPeerId(id)
    setPeerName(name)
    setSearchKeyword('')
    setSearchResults([])
    await loadChat(id)
    await loadInbox()
  }

  const handleSearchSelect = (value) => {
    const user = searchResults.find(u => u.nickname === value)
    if (user && user.userId) {
      selectPeer(user.userId, user.nickname)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', width: '100%', borderRadius: '0', overflow: 'hidden', border: 'none', boxShadow: 'none', backgroundColor: '#fff', position: 'fixed', top: '64px', left: '0', zIndex: '1' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', fontSize: '18px', fontWeight: 700, backgroundColor: '#fff' }}>
        <WechatOutlined style={{ color: '#2563eb', marginRight: 8 }} /> 消息中心
        {isConnected && <span style={{ marginLeft: '12px', fontSize: '12px', color: '#22c55e' }}>🟢 在线</span>}
        {!isConnected && <span style={{ marginLeft: '12px', fontSize: '12px', color: '#ef4444' }}>🔴 离线</span>}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <AutoComplete
              style={{ width: '100%' }}
              value={searchKeyword}
              onChange={setSearchKeyword}
              onSelect={handleSearchSelect}
              placeholder="搜索用户名发起聊天"
              optionFilterProp="value"
            >
              {searchResults.map(user => (
                <AutoComplete.Option
                  key={user.userId}
                  value={user.nickname}
                  userId={user.userId}
                  nickname={user.nickname}
                >
                  <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                    <span style={{ marginRight: '8px', fontSize: '18px' }}>👤</span>
                    <span>{user.nickname}</span>
                    {user.college && <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '12px' }}>{user.college}</span>}
                  </div>
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </div>
          <div style={{ padding: '12px 20px', color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
            最近会话 · {inbox.length}
          </div>

          {inbox.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
              <div>暂无消息</div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {inbox.map(msg => {
                const peer = msg.senderId === Number(userId) ? msg.receiverId : msg.senderId
                const name = msg.senderId === Number(userId) ? msg.receiverNickname : msg.senderNickname
                const unread = msg.unreadCount || 0
                return (
                  <div
                    key={peer}
                    onClick={() => selectPeer(peer, name)}
                    style={{
                      padding: '16px 24px',
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      backgroundColor: peerId === peer ? '#eff6ff' : '#fff',
                      borderLeft: peerId === peer ? '3px solid #2563eb' : '3px solid transparent',
                      paddingLeft: peerId === peer ? '21px' : '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', marginBottom: '4px' }}>👤 {name}</div>
                      <div style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.content}</div>
                    </div>
                    {unread > 0 && (
                      <div style={{
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        minWidth: '20px',
                        textAlign: 'center',
                        marginLeft: '12px',
                        flexShrink: '0'
                      }}>
                        {unread > 99 ? '99+' : unread}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
          {!peerId ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '15px', padding: '40px' }}>
              <div style={{ fontSize: '72px', opacity: '0.4', marginBottom: '16px' }}>💌</div>
              <div>选择一个会话开始聊天</div>
              <div style={{ marginTop: '8px' }}>或在左侧搜索用户名发起新会话</div>
            </div>
          ) : (
            <>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '16px', backgroundColor: '#fff' }}>👤 与 {peerName} 的对话</div>
              <div ref={chatBoxRef} style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8fafc', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📨</div>
                    还没有消息，给对方打个招呼吧~
                  </div>
                ) : (
                  messages.map(m => {
                    const isMine = m.senderId === Number(userId)
                    return (
                      <div key={m.messageId} style={{
                        maxWidth: '65%',
                        padding: '12px 18px',
                        borderRadius: '14px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        wordBreak: 'break-word',
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        backgroundColor: isMine ? '#2563eb' : '#fff',
                        color: isMine ? '#fff' : '#1e293b',
                        borderBottomRightRadius: isMine ? '4px' : '14px',
                        borderBottomLeftRadius: isMine ? '14px' : '4px',
                        border: !isMine ? '1px solid #e2e8f0' : 'none',
                        boxShadow: isMine ? '0 4px 12px rgba(37,99,235,0.2)' : '0 1px 3px rgba(0,0,0,0.05)'
                      }}>
                        <span style={{ fontSize: '11px', color: isMine ? 'rgba(255,255,255,0.8)' : '#94a3b8', marginBottom: '6px', display: 'block', opacity: '0.7' }}>
                          {isMine ? '我' : (m.senderNickname || '对方')} · {new Date(m.createdAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div>{m.content}</div>
                      </div>
                    )
                  })
                )}
              </div>
              <div style={{ padding: '20px 28px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0' }}>
                <Input.TextArea
                  rows={3}
                  placeholder="输入消息内容..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); send() } }}
                  style={{ marginBottom: '8px' }}
                />
                <div style={{ textAlign: 'right' }}>
                  <Button type="primary" icon={<SendOutlined />} onClick={send} disabled={!content.trim()}>
                    发送消息
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}