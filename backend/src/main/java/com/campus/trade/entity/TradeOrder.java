package com.campus.trade.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TradeOrder {
    private Long orderId;
    private String orderNo;
    private Long goodsId;
    private Long buyerId;
    private Long sellerId;
    private BigDecimal amount;
    private Integer deliveryType;
    private String address;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime finishTime;
    private String goodsTitle;
    private String goodsImages;
    private String buyerNickname;
    private String sellerNickname;

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public Long getGoodsId() { return goodsId; }
    public void setGoodsId(Long goodsId) { this.goodsId = goodsId; }
    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Integer getDeliveryType() { return deliveryType; }
    public void setDeliveryType(Integer deliveryType) { this.deliveryType = deliveryType; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getFinishTime() { return finishTime; }
    public void setFinishTime(LocalDateTime finishTime) { this.finishTime = finishTime; }
    public String getGoodsTitle() { return goodsTitle; }
    public void setGoodsTitle(String goodsTitle) { this.goodsTitle = goodsTitle; }
    public String getGoodsImages() { return goodsImages; }
    public void setGoodsImages(String goodsImages) { this.goodsImages = goodsImages; }
    public String getBuyerNickname() { return buyerNickname; }
    public void setBuyerNickname(String buyerNickname) { this.buyerNickname = buyerNickname; }
    public String getSellerNickname() { return sellerNickname; }
    public void setSellerNickname(String sellerNickname) { this.sellerNickname = sellerNickname; }
}
