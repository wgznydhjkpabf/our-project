package com.campus.trade.controller;

import com.campus.trade.common.Result;
import com.campus.trade.dto.MessageRequest;
import com.campus.trade.entity.UserMessage;
import com.campus.trade.service.MessageService;
import com.campus.trade.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final WebSocketController webSocketController;

    public MessageController(MessageService messageService, WebSocketController webSocketController) {
        this.messageService = messageService;
        this.webSocketController = webSocketController;
    }

    @GetMapping
    public Result<List<UserMessage>> inbox() {
        return Result.ok(messageService.inbox(SecurityUtils.currentUserId()));
    }

    @GetMapping("/conversations")
    public Result<List<UserMessage>> conversations() {
        return Result.ok(messageService.conversations(SecurityUtils.currentUserId()));
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        return Result.ok(messageService.getMessageStats(SecurityUtils.currentUserId()));
    }

    @GetMapping("/unread-count")
    public Result<Integer> unreadCount() {
        return Result.ok(messageService.countUnread(SecurityUtils.currentUserId()));
    }

    @GetMapping("/{peerId}")
    public Result<List<UserMessage>> conversation(@PathVariable Long peerId) {
        Long userId = SecurityUtils.currentUserId();
        List<UserMessage> messages = messageService.conversation(userId, peerId);
        webSocketController.sendConversationUpdate(peerId);
        return Result.ok(messages);
    }

    @PostMapping
    public Result<Void> send(@Valid @RequestBody MessageRequest request) {
        Long senderId = SecurityUtils.currentUserId();
        messageService.sendMessage(senderId, request);

        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "NEW_MESSAGE");
        notification.put("senderId", senderId);
        notification.put("receiverId", request.getReceiverId());
        notification.put("content", request.getContent());

        webSocketController.sendMessageToUser(request.getReceiverId(), notification);
        webSocketController.sendConversationUpdate(request.getReceiverId());

        return Result.ok("发送成功", null);
    }

    @PutMapping("/{messageId}/read")
    public Result<Void> markRead(@PathVariable Long messageId) {
        messageService.markRead(SecurityUtils.currentUserId(), messageId);
        return Result.ok("已标记为已读", null);
    }

    @PutMapping("/read-all")
    public Result<Void> markAllRead() {
        messageService.markAllRead(SecurityUtils.currentUserId());
        return Result.ok("全部已标记为已读", null);
    }

    @DeleteMapping("/{peerId}")
    public Result<Void> deleteConversation(@PathVariable Long peerId) {
        messageService.deleteConversation(SecurityUtils.currentUserId(), peerId);
        return Result.ok("对话已删除", null);
    }
}