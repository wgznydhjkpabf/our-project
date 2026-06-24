package com.campus.trade.entity;

import java.time.LocalDateTime;

public class UserFavorite {
    private Long id;
    private Long userId;
    private Long goodsId;
    private LocalDateTime createTime;
    private String goodsTitle;
    private String goodsImages;
    private java.math.BigDecimal goodsPrice;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getGoodsId() { return goodsId; }
    public void setGoodsId(Long goodsId) { this.goodsId = goodsId; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public String getGoodsTitle() { return goodsTitle; }
    public void setGoodsTitle(String goodsTitle) { this.goodsTitle = goodsTitle; }
    public String getGoodsImages() { return goodsImages; }
    public void setGoodsImages(String goodsImages) { this.goodsImages = goodsImages; }
    public java.math.BigDecimal getGoodsPrice() { return goodsPrice; }
    public void setGoodsPrice(java.math.BigDecimal goodsPrice) { this.goodsPrice = goodsPrice; }
}
