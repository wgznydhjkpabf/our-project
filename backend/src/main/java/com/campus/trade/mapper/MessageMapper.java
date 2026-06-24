package com.campus.trade.mapper;

import com.campus.trade.entity.UserMessage;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MessageMapper {

    List<UserMessage> findConversation(@Param("userId") Long userId, @Param("peerId") Long peerId);

    List<UserMessage> findInbox(@Param("userId") Long userId);

    int insert(UserMessage message);

    int markRead(@Param("messageId") Long messageId, @Param("userId") Long userId);

    int markAllRead(@Param("userId") Long userId);

    int markConversationRead(@Param("userId") Long userId, @Param("peerId") Long peerId);

    int countUnread(@Param("userId") Long userId);

    int countUnreadByPeer(@Param("userId") Long userId, @Param("peerId") Long peerId);

    List<UserMessage> findConversations(@Param("userId") Long userId);

    int deleteByConversation(@Param("userId") Long userId, @Param("peerId") Long peerId);

    UserMessage selectById(@Param("messageId") Long messageId);
}
