package com.campus.trade.controller;

import com.campus.trade.common.Result;
import com.campus.trade.dto.MessageRequest;
import com.campus.trade.entity.Category;
import com.campus.trade.entity.UserAddress;
import com.campus.trade.entity.UserMessage;
import com.campus.trade.service.CommonService;
import com.campus.trade.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommonController {

    private final CommonService commonService;

    public CommonController(CommonService commonService) {
        this.commonService = commonService;
    }

    @GetMapping("/api/categories")
    public Result<List<Category>> categories() {
        return Result.ok(commonService.categories());
    }

    @GetMapping("/api/messages")
    public Result<List<UserMessage>> inbox() {
        return Result.ok(commonService.inbox(SecurityUtils.currentUserId()));
    }

    @GetMapping("/api/messages/{peerId}")
    public Result<List<UserMessage>> conversation(@PathVariable Long peerId) {
        return Result.ok(commonService.conversation(SecurityUtils.currentUserId(), peerId));
    }

    @PostMapping("/api/messages")
    public Result<Void> send(@Valid @RequestBody MessageRequest request) {
        commonService.sendMessage(SecurityUtils.currentUserId(), request);
        return Result.ok("发送成功", null);
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
}
