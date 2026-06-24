package com.campus.trade.controller;

import com.campus.trade.common.Result;
import com.campus.trade.entity.UserFavorite;
import com.campus.trade.service.FavoriteService;
import com.campus.trade.util.SecurityUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/{goodsId}")
    public Result<Void> toggle(@PathVariable Long goodsId) {
        favoriteService.toggle(SecurityUtils.currentUserId(), goodsId);
        return Result.ok("操作成功", null);
    }

    @GetMapping("/{goodsId}/status")
    public Result<Boolean> status(@PathVariable Long goodsId) {
        return Result.ok(favoriteService.isFavorite(SecurityUtils.currentUserId(), goodsId));
    }

    @GetMapping
    public Result<List<UserFavorite>> list() {
        return Result.ok(favoriteService.list(SecurityUtils.currentUserId()));
    }

    @GetMapping("/count")
    public Result<Map<String, Object>> count() {
        return Result.ok(favoriteService.count(SecurityUtils.currentUserId()));
    }
}
