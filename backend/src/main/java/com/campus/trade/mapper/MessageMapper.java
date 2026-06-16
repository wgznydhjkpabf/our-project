package com.campus.trade.mapper;

import com.campus.trade.entity.UserMessage;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MessageMapper {

    List<UserMessage> findConversation(@Param("userId") Long userId, @Param("peerId") Long peerId);

    List<UserMessage> findInbox(@Param("userId") Long userId);

    int insert(UserMessage message);

    int markRead(@Param("messageId") Long messageId, @Param("userId") Long userId);
}
