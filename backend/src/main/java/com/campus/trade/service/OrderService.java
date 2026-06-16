package com.campus.trade.service;

import com.campus.trade.common.BusinessException;
import com.campus.trade.dto.OrderCreateRequest;
import com.campus.trade.dto.ReviewRequest;
import com.campus.trade.entity.Goods;
import com.campus.trade.entity.OrderReview;
import com.campus.trade.entity.TradeOrder;
import com.campus.trade.mapper.GoodsMapper;
import com.campus.trade.mapper.OrderReviewMapper;
import com.campus.trade.mapper.TradeOrderMapper;
import com.campus.trade.mapper.UserMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final TradeOrderMapper orderMapper;
    private final GoodsMapper goodsMapper;
    private final OrderReviewMapper reviewMapper;
    private final UserMapper userMapper;
    private final JdbcTemplate jdbcTemplate;

    public OrderService(TradeOrderMapper orderMapper, GoodsMapper goodsMapper,
                        OrderReviewMapper reviewMapper, UserMapper userMapper,
                        JdbcTemplate jdbcTemplate) {
        this.orderMapper = orderMapper;
        this.goodsMapper = goodsMapper;
        this.reviewMapper = reviewMapper;
        this.userMapper = userMapper;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public Long createOrder(Long buyerId, OrderCreateRequest request) {
        Goods goods = goodsMapper.findById(request.getGoodsId());
        if (goods == null || goods.getStatus() != 1) {
            throw new BusinessException("商品不可购买");
        }
        if (goods.getUserId().equals(buyerId)) {
            throw new BusinessException("不能购买自己的商品");
        }
        if (request.getDeliveryType() == 1 && (request.getAddress() == null || request.getAddress().isBlank())) {
            throw new BusinessException("邮寄方式需要填写地址");
        }

        TradeOrder order = new TradeOrder();
        order.setOrderNo(generateOrderNo());
        order.setGoodsId(goods.getGoodsId());
        order.setBuyerId(buyerId);
        order.setSellerId(goods.getUserId());
        order.setAmount(goods.getPrice());
        order.setDeliveryType(request.getDeliveryType());
        order.setAddress(request.getAddress());
        order.setStatus(0);
        orderMapper.insert(order);
        return order.getOrderId();
    }

    public List<TradeOrder> myOrders(Long userId) {
        return orderMapper.findByUser(userId, "all");
    }

    public TradeOrder getOrder(Long userId, Long orderId) {
        TradeOrder order = requireParticipant(userId, orderId);
        return order;
    }

    public void confirmOrder(Long userId, Long orderId) {
        TradeOrder order = requireParticipant(userId, orderId);
        if (!order.getSellerId().equals(userId)) {
            throw new BusinessException(403, "仅卖家可确认订单");
        }
        if (order.getStatus() != 0) {
            throw new BusinessException("订单状态不允许确认");
        }
        orderMapper.updateStatus(orderId, 1);
    }

    public void cancelOrder(Long userId, Long orderId) {
        TradeOrder order = requireParticipant(userId, orderId);
        if (order.getStatus() >= 2) {
            throw new BusinessException("订单已完成，无法取消");
        }
        if (!order.getBuyerId().equals(userId) && !order.getSellerId().equals(userId)) {
            throw new BusinessException(403, "无权取消");
        }
        orderMapper.updateStatus(orderId, 3);
    }

    @Transactional
    public void completeOrder(Long userId, Long orderId) {
        TradeOrder order = requireParticipant(userId, orderId);
        if (!order.getSellerId().equals(userId) && !order.getBuyerId().equals(userId)) {
            throw new BusinessException(403, "无权完成订单");
        }
        if (order.getStatus() != 1) {
            throw new BusinessException("订单状态不允许完成");
        }
        jdbcTemplate.update("CALL sp_complete_order(?)", orderId);
    }

    @Transactional
    public void reviewOrder(Long userId, ReviewRequest request) {
        TradeOrder order = requireParticipant(userId, request.getOrderId());
        if (!order.getBuyerId().equals(userId)) {
            throw new BusinessException(403, "仅买家可评价");
        }
        if (order.getStatus() != 2) {
            throw new BusinessException("订单未完成，无法评价");
        }
        if (reviewMapper.findByOrderId(order.getOrderId()) != null) {
            throw new BusinessException("该订单已评价");
        }
        OrderReview review = new OrderReview();
        review.setOrderId(order.getOrderId());
        review.setReviewerId(userId);
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        reviewMapper.insert(review);

        BigDecimal avg = reviewMapper.avgRatingBySeller(order.getSellerId());
        userMapper.updateCreditScore(order.getSellerId(), avg);
    }

    private TradeOrder requireParticipant(Long userId, Long orderId) {
        TradeOrder order = orderMapper.findById(orderId);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getBuyerId().equals(userId) && !order.getSellerId().equals(userId)) {
            throw new BusinessException(403, "无权访问该订单");
        }
        return order;
    }

    private String generateOrderNo() {
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return time + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
