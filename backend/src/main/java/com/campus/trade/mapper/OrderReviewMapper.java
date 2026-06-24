package com.campus.trade.mapper;

import com.campus.trade.entity.OrderReview;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;

public interface OrderReviewMapper {

    OrderReview findByOrderId(@Param("orderId") Long orderId);

    int insert(OrderReview review);

    BigDecimal avgRatingBySeller(@Param("sellerId") Long sellerId);
}
