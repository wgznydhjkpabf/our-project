package com.campus.trade.controller;

import com.campus.trade.common.Result;
import com.campus.trade.entity.Category;
import com.campus.trade.entity.User;
import com.campus.trade.entity.UserAddress;
import com.campus.trade.mapper.UserMapper;
import com.campus.trade.service.CommonService;
import com.campus.trade.util.SecurityUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommonController {

    private final CommonService commonService;
    private final UserMapper userMapper;

    public CommonController(CommonService commonService, UserMapper userMapper) {
        this.commonService = commonService;
        this.userMapper = userMapper;
    }

    @GetMapping("/api/categories")
    public Result<List<Category>> categories() {
        return Result.ok(commonService.categories());
    }

    @GetMapping("/api/addresses")
    public Result<List<UserAddress>> addresses() {
        return Result.ok(commonService.addresses(SecurityUtils.currentUserId()));
    }

    @PostMapping("/api/addresses")
    public Result<Void> saveAddress(@RequestBody UserAddress address) {
        commonService.saveAddress(SecurityUtils.currentUserId(), address);
        return Result.ok("保存成功", null);
    }

    @DeleteMapping("/api/addresses/{id}")
    public Result<Void> deleteAddress(@PathVariable Long id) {
        commonService.deleteAddress(SecurityUtils.currentUserId(), id);
        return Result.ok("删除成功", null);
    }

    @GetMapping("/api/users/search")
    public Result<List<User>> searchUsers(@RequestParam String keyword) {
        return Result.ok(userMapper.searchByNickname(keyword));
    }
}