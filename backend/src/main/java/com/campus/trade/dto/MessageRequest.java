package com.campus.trade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MessageRequest {

    @NotNull(message = "接收者不能为空")
    private Long receiverId;

    private Long goodsId;

    @NotBlank(message = "消息内容不能为空")
    private String content;

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public Long getGoodsId() { return goodsId; }
    public void setGoodsId(Long goodsId) { this.goodsId = goodsId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
