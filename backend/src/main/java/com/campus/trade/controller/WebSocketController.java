package com.campus.trade.controller;

import com.campus.trade.util.SecurityUtils;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendMessageToUser(Long userId, Object message) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/messages",
                message
        );
    }

    public void sendConversationUpdate(Long userId) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/conversations",
                System.currentTimeMillis()
        );
    }
}