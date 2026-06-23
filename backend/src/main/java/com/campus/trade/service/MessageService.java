package com.campus.trade.service;

import com.campus.trade.common.BusinessException;
import com.campus.trade.dto.MessageRequest;
import com.campus.trade.entity.MessageType;
import com.campus.trade.entity.UserMessage;
import com.campus.trade.mapper.MessageMapper;
import com.campus.trade.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageService {

    private final MessageMapper messageMapper;
    private final UserMapper userMapper;

    public MessageService(MessageMapper messageMapper, UserMapper userMapper) {
        this.messageMapper = messageMapper;
        this.userMapper = userMapper;
    }

    public List<UserMessage> inbox(Long userId) {
        return messageMapper.findInbox(userId);
    }

    public List<UserMessage> conversations(Long userId) {
        return messageMapper.findConversations(userId);
    }

    public List<UserMessage> conversation(Long userId, Long peerId) {
        if (userId.equals(peerId)) {
            throw new BusinessException("不能与自己对话");
        }
        messageMapper.markConversationRead(userId, peerId);
        return messageMapper.findConversation(userId, peerId);
    }

    public void sendMessage(Long senderId, MessageRequest request) {
        if (senderId.equals(request.getReceiverId())) {
            throw new BusinessException("不能给自己发消息");
        }
        UserMessage message = new UserMessage();
        message.setSenderId(senderId);
        message.setReceiverId(request.getReceiverId());
        message.setGoodsId(request.getGoodsId());
        message.setMessageType(MessageType.USER.getCode());
        message.setContent(request.getContent());
        message.setIsRead(0);
        messageMapper.insert(message);
    }

    public void sendSystemMessage(Long receiverId, Long goodsId, Long orderId,
                                  MessageType messageType, String content) {
        UserMessage message = new UserMessage();
        message.setSenderId(0L);
        message.setReceiverId(receiverId);
        message.setGoodsId(goodsId);
        message.setOrderId(orderId);
        message.setMessageType(messageType.getCode());
        message.setContent(content);
        message.setIsRead(0);
        messageMapper.insert(message);
    }

    public void markRead(Long userId, Long messageId) {
        UserMessage message = getMessage(messageId);
        if (!message.getReceiverId().equals(userId)) {
            throw new BusinessException(403, "无权操作该消息");
        }
        messageMapper.markRead(messageId, userId);
    }

    public void markAllRead(Long userId) {
        messageMapper.markAllRead(userId);
    }

    public int countUnread(Long userId) {
        return messageMapper.countUnread(userId);
    }

    public Map<String, Object> getMessageStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("unreadCount", messageMapper.countUnread(userId));
        stats.put("conversationCount", messageMapper.findConversations(userId).size());
        return stats;
    }

    public void deleteConversation(Long userId, Long peerId) {
        if (userId.equals(peerId)) {
            throw new BusinessException("不能删除与自己的对话");
        }
        messageMapper.deleteByConversation(userId, peerId);
    }

    private UserMessage getMessage(Long messageId) {
        UserMessage message = messageMapper.selectById(messageId);
        if (message == null) {
            throw new BusinessException("消息不存在");
        }
        return message;
    }
}