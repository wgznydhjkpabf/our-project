package com.campus.trade.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReviewRequest {

    @NotNull(message = "订单ID不能为空")
    private Long orderId;

    @NotNull(message = "评分不能为空")
    @Min(value = 1, message = "评分1-5")
    @Max(value = 5, message = "评分1-5")
    private Integer rating;

    private String content;

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
