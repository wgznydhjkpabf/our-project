package com.campus.trade.dto;

import jakarta.validation.constraints.NotNull;

public class OrderCreateRequest {

    @NotNull(message = "商品ID不能为空")
    private Long goodsId;

    @NotNull(message = "交易方式不能为空")
    private Integer deliveryType;

    private String address;

    public Long getGoodsId() { return goodsId; }
    public void setGoodsId(Long goodsId) { this.goodsId = goodsId; }
    public Integer getDeliveryType() { return deliveryType; }
    public void setDeliveryType(Integer deliveryType) { this.deliveryType = deliveryType; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
