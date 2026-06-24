package com.campus.trade.controller;

import com.campus.trade.common.BusinessException;
import com.campus.trade.common.Result;
import com.campus.trade.entity.Category;
import com.campus.trade.entity.Goods;
import com.campus.trade.entity.User;
import com.campus.trade.service.CommonService;
import com.campus.trade.service.GoodsService;
import com.campus.trade.util.SecurityUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CommonService commonService;
    private final GoodsService goodsService;

    public AdminController(CommonService commonService, GoodsService goodsService) {
        this.commonService = commonService;
        this.goodsService = goodsService;
    }

    private void requireAdmin() {
        if (SecurityUtils.currentRole() == null || SecurityUtils.currentRole() != 1) {
            throw new BusinessException(403, "需要管理员权限");
        }
    }

    @GetMapping("/dashboard")
    public Result<Map<String, Object>> dashboard() {
        requireAdmin();
        return Result.ok(commonService.dashboard());
    }

    @GetMapping("/users")
    public Result<List<User>> users() {
        requireAdmin();
        return Result.ok(commonService.allUsers());
    }

    @PutMapping("/users/{id}/status")
    public Result<Void> updateUserStatus(@PathVariable Long id, @RequestParam Integer status) {
        requireAdmin();
        commonService.updateUserStatus(id, status);
        return Result.ok("更新成功", null);
    }

    @GetMapping("/goods/pending")
    public Result<Map<String, Object>> pendingGoods(@RequestParam(defaultValue = "1") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        requireAdmin();
        return Result.ok(goodsService.list(null, null, 0, null, null, page, size));
    }

    @PutMapping("/goods/{id}/audit")
    public Result<Void> audit(@PathVariable Long id, @RequestParam boolean pass) {
        requireAdmin();
        goodsService.audit(id, pass);
        return Result.ok(pass ? "审核通过" : "已驳回", null);
    }

    @PostMapping("/categories")
    public Result<Void> addCategory(@RequestBody Category category) {
        requireAdmin();
        commonService.addCategory(category);
        return Result.ok("添加成功", null);
    }

    @PutMapping("/categories/{id}")
    public Result<Void> updateCategory(@PathVariable("id") Integer id, @RequestBody Category category) {
        requireAdmin();
        category.setCategoryId(id);
        commonService.updateCategory(category);
        return Result.ok("更新成功", null);
    }

    @DeleteMapping("/categories/{id}")
    public Result<Void> deleteCategory(@PathVariable("id") Integer id) {
        requireAdmin();
        commonService.deleteCategory(id);
        return Result.ok("删除成功", null);
    }
}
