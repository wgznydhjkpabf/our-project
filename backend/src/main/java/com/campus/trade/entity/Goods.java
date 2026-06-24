package com.campus.trade.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Goods {
    private Long goodsId;
    private Long userId;
    private Integer categoryId;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer conditionLevel;
    private String images;
    private String tradeLocation;
    private Integer viewCount;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String sellerNickname;
    private String categoryName;
    private BigDecimal sellerCreditScore;

    public Long getGoodsId() { return goodsId; }
    public void setGoodsId(Long goodsId) { this.goodsId = goodsId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    public Integer getConditionLevel() { return conditionLevel; }
    public void setConditionLevel(Integer conditionLevel) { this.conditionLevel = conditionLevel; }
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
    public String getTradeLocation() { return tradeLocation; }
    public void setTradeLocation(String tradeLocation) { this.tradeLocation = tradeLocation; }
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
    public String getSellerNickname() { return sellerNickname; }
    public void setSellerNickname(String sellerNickname) { this.sellerNickname = sellerNickname; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public BigDecimal getSellerCreditScore() { return sellerCreditScore; }
    public void setSellerCreditScore(BigDecimal sellerCreditScore) { this.sellerCreditScore = sellerCreditScore; }
}
