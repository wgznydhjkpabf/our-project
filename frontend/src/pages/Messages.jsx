import { useEffect, useState } from 'react'
import { Card, Row, Col, Input, Button, List, message } from 'antd'
import { getMessages, getConversation, sendMessage, getAuth } from '../api'

export default function Messages() {
  const { userId } = getAuth()
  const [inbox, setInbox] = useState([])
  const [peerId, setPeerId] = useState('')
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')

  const loadInbox = async () => setInbox(await getMessages())
  const loadChat = async id => {
    if (!id) return
    setMessages(await getConversation(id))
  }

  useEffect(() => { loadInbox() }, [])

  const send = async () => {
    if (!peerId || !content) return
    await sendMessage({ receiverId: Number(peerId), content })
    setContent('')
    message.success('已发送')
    loadChat(peerId)
    loadInbox()
  }

  const selectPeer = id => {
    setPeerId(String(id))
    loadChat(id)
  }

  return (
    <Card className="page-card" title="消息中心">
      <Row gutter={16}>
        <Col span={8}>
          <Input placeholder="输入对方用户ID开始聊天" value={peerId} onChange={e => setPeerId(e.target.value)} style={{ marginBottom: 12 }} />
          <Button type="primary" block onClick={() => loadChat(peerId)}>加载会话</Button>
          <List
            style={{ marginTop: 16 }}
            dataSource={inbox}
            renderItem={msg => {
              const peer = msg.senderId === Number(userId) ? msg.receiverId : msg.senderId
              const name = msg.senderId === Number(userId) ? msg.receiverNickname : msg.senderNickname
              return (
                <List.Item style={{ cursor: 'pointer' }} onClick={() => selectPeer(peer)}>
                  <List.Item.Meta title={name} description={msg.content} />
                </List.Item>
              )
            }}
          />
        </Col>
        <Col span={16}>
          <div className="chat-box">
            {messages.map(m => (
              <div key={m.messageId} className={`chat-msg ${m.senderId === Number(userId) ? 'mine' : 'other'}`}>
                {m.senderNickname}：{m.content}
              </div>
            ))}
          </div>
          <Input.TextArea rows={3} placeholder="输入消息..." value={content} onChange={e => setContent(e.target.value)} />
          <Button type="primary" style={{ marginTop: 8 }} onClick={send}>发送</Button>
        </Col>
      </Row>
    </Card>
  )
}
