package com.campus.trade.mapper;

import com.campus.trade.entity.TradeOrder;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TradeOrderMapper {

    TradeOrder findById(@Param("orderId") Long orderId);

    List<TradeOrder> findByUser(@Param("userId") Long userId, @Param("role") String role);

    int insert(TradeOrder order);

    int updateStatus(@Param("orderId") Long orderId, @Param("status") Integer status);

    int completeOrder(@Param("orderId") Long orderId);

    int countAll();
}
