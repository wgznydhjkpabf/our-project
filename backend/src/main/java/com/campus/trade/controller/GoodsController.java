package com.campus.trade.controller;

import com.campus.trade.common.Result;
import com.campus.trade.dto.GoodsRequest;
import com.campus.trade.entity.Goods;
import com.campus.trade.service.GoodsService;
import com.campus.trade.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/goods")
public class GoodsController {

    private final GoodsService goodsService;

    public GoodsController(GoodsService goodsService) {
        this.goodsService = goodsService;
    }

    @GetMapping
    public Result<Map<String, Object>> list(@RequestParam(required = false) String keyword,
                                             @RequestParam(required = false) Integer categoryId,
                                             @RequestParam(required = false) Integer status,
                                             @RequestParam(required = false) Long userId,
                                             @RequestParam(required = false) String sortBy,
                                             @RequestParam(defaultValue = "1") int page,
                                             @RequestParam(defaultValue = "10") int size) {
        if (status == null) {
            status = 1;
        }
        return Result.ok(goodsService.list(keyword, categoryId, status, userId, sortBy, page, size));
    }

    @GetMapping("/{id}")
    public Result<Goods> detail(@PathVariable("id") Long id) {
        return Result.ok(goodsService.detail(id));
    }

    @PostMapping
    public Result<Long> publish(@Valid @RequestBody GoodsRequest request) {
        return Result.ok(goodsService.publish(SecurityUtils.currentUserId(), request));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody GoodsRequest request) {
        goodsService.update(SecurityUtils.currentUserId(), id, request);
        return Result.ok("更新成功", null);
    }

    @PutMapping("/{id}/off-shelf")
    public Result<Void> offShelf(@PathVariable Long id) {
        goodsService.offShelf(SecurityUtils.currentUserId(), id);
        return Result.ok("已下架", null);
    }
}
