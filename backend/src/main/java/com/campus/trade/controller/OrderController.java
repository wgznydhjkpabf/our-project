package com.campus.trade.controller;

import com.campus.trade.common.Result;
import com.campus.trade.dto.OrderCreateRequest;
import com.campus.trade.dto.ReviewRequest;
import com.campus.trade.entity.TradeOrder;
import com.campus.trade.service.OrderService;
import com.campus.trade.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Result<Long> create(@Valid @RequestBody OrderCreateRequest request) {
        return Result.ok(orderService.createOrder(SecurityUtils.currentUserId(), request));
    }

    @GetMapping
    public Result<List<TradeOrder>> list() {
        return Result.ok(orderService.myOrders(SecurityUtils.currentUserId()));
    }

    @GetMapping("/{id}")
    public Result<TradeOrder> detail(@PathVariable Long id) {
        return Result.ok(orderService.getOrder(SecurityUtils.currentUserId(), id));
    }

    @PutMapping("/{id}/confirm")
    public Result<Void> confirm(@PathVariable Long id) {
        orderService.confirmOrder(SecurityUtils.currentUserId(), id);
        return Result.ok("已确认", null);
    }

    @PutMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        orderService.cancelOrder(SecurityUtils.currentUserId(), id);
        return Result.ok("已取消", null);
    }

    @PutMapping("/{id}/complete")
    public Result<Void> complete(@PathVariable Long id) {
        orderService.completeOrder(SecurityUtils.currentUserId(), id);
        return Result.ok("订单已完成", null);
    }

    @PostMapping("/review")
    public Result<Void> review(@Valid @RequestBody ReviewRequest request) {
        orderService.reviewOrder(SecurityUtils.currentUserId(), request);
        return Result.ok("评价成功", null);
    }
}
