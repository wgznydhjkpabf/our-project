import { useEffect, useState } from 'react'
import { Input, Button, message, Empty } from 'antd'
import { SendOutlined, WechatOutlined } from '@ant-design/icons'
import { getConversations, getConversation, sendMessage, getAuth } from '../api'

export default function Messages() {
  const { userId } = getAuth()
  const [inbox, setInbox] = useState([])
  const [peerId, setPeerId] = useState(null)
  const [peerName, setPeerName] = useState('')
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [newPeerId, setNewPeerId] = useState('')

  const loadInbox = async () => setInbox(await getConversations())
  const loadChat = async id => {
    if (!id) return
    const chat = await getConversation(id)
    setMessages(chat)
  }

  useEffect(() => { loadInbox() }, [])

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

  const selectPeer = (id, name) => {
    setPeerId(id)
    setPeerName(name)
    loadChat(id)
    loadInbox()
  }

  const startNewChat = () => {
    if (!newPeerId) return
    const id = Number(newPeerId)
    if (isNaN(id)) {
      message.warn('请输入有效的用户ID')
      return
    }
    setPeerId(id)
    setPeerName('用户 ' + id)
    setMessages([])
    setNewPeerId('')
  }

  return (
    <div className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', fontSize: 18, fontWeight: 700 }}>
        <WechatOutlined style={{ color: '#2563eb', marginRight: 8 }} /> 消息中心
      </div>

      <div className="message-layout" style={{ border: 'none' }}>
        <div className="message-sidebar">
          <div style={{ padding: 16, borderBottom: '1px solid #e2e8f0' }}>
            <Input.Group compact>
              <Input placeholder="输入用户ID发起聊天" value={newPeerId} onChange={e => setNewPeerId(e.target.value)} style={{ width: '70%' }} />
              <Button type="primary" onClick={startNewChat}>发起</Button>
            </Input.Group>
          </div>
          <div style={{ padding: '12px 20px', color: '#64748b', fontSize: 12, fontWeight: 600 }}>
            最近会话 · {inbox.length}
          </div>

          {inbox.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <div>暂无消息</div>
            </div>
          ) : (
            <div className="message-list">
              {inbox.map(msg => {
                const peer = msg.senderId === Number(userId) ? msg.receiverId : msg.senderId
                const name = msg.senderId === Number(userId) ? msg.receiverNickname : msg.senderNickname
                const unread = msg.unreadCount || 0
                return (
                  <div
                    key={peer}
                    className={`message-item ${peerId === peer ? 'active' : ''}`}
                    onClick={() => selectPeer(peer, name)}
                  >
                    <div className="peer-name">
                      👤 {name}
                      {unread > 0 && (
                        <span style={{
                          marginLeft: 8,
                          padding: '2px 6px',
                          background: '#ef4444',
                          color: '#fff',
                          fontSize: 11,
                          borderRadius: 10,
                          fontWeight: 500
                        }}>
                          {unread > 99 ? '99+' : unread}
                        </span>
                      )}
                    </div>
                    <div className="preview">{msg.content}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="message-chat" style={{ background: '#f8fafc' }}>
          {!peerId ? (
            <div className="chat-empty" style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 64, opacity: 0.3, marginBottom: 16 }}>💌</div>
              <div style={{ fontSize: 16, color: '#64748b', fontWeight: 500 }}>选择一个会话开始聊天</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>或在左侧输入用户ID发起新会话</div>
            </div>
          ) : (
            <>
              <div style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: 15 }}>
                👤 与 {peerName} 的对话
              </div>
              <div className="chat-box">
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📨</div>
                    还没有消息，给对方打个招呼吧~
                  </div>
                ) : (
                  messages.map(m => {
                    const isMine = m.senderId === Number(userId)
                    return (
                      <div key={m.messageId} className={`chat-msg ${isMine ? 'mine' : 'other'}`}>
                        <span className="sender" style={{ fontSize: 11, opacity: 0.7 }}>
                          {isMine ? '我' : (m.senderNickname || '对方')} · {new Date(m.createTime).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div>{m.content}</div>
                      </div>
                    )
                  })
                )}
              </div>
              <div style={{ padding: '16px 24px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
                <Input.TextArea
                  rows={3}
                  placeholder="输入消息内容..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); send() } }}
                  style={{ marginBottom: 8 }}
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
