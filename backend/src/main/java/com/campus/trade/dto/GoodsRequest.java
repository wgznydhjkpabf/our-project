package com.campus.trade.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class GoodsRequest {

    @NotNull(message = "分类不能为空")
    private Integer categoryId;

    @NotBlank(message = "标题不能为空")
    private String title;

    private String description;

    @NotNull(message = "价格不能为空")
    @DecimalMin(value = "0.01", message = "价格必须大于0")
    private BigDecimal price;

    private BigDecimal originalPrice;
    private Integer conditionLevel;
    private String images;
    private String tradeLocation;

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
}
