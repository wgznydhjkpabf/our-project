package com.campus.trade.service;

import com.campus.trade.common.BusinessException;
import com.campus.trade.dto.MessageRequest;
import com.campus.trade.entity.Category;
import com.campus.trade.entity.User;
import com.campus.trade.entity.UserAddress;
import com.campus.trade.entity.UserMessage;
import com.campus.trade.mapper.AddressMapper;
import com.campus.trade.mapper.CategoryMapper;
import com.campus.trade.mapper.GoodsMapper;
import com.campus.trade.mapper.MessageMapper;
import com.campus.trade.mapper.TradeOrderMapper;
import com.campus.trade.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommonService {

    private final CategoryMapper categoryMapper;
    private final MessageMapper messageMapper;
    private final AddressMapper addressMapper;
    private final UserMapper userMapper;
    private final GoodsMapper goodsMapper;
    private final TradeOrderMapper orderMapper;

    public CommonService(CategoryMapper categoryMapper, MessageMapper messageMapper,
                         AddressMapper addressMapper, UserMapper userMapper,
                         GoodsMapper goodsMapper, TradeOrderMapper orderMapper) {
        this.categoryMapper = categoryMapper;
        this.messageMapper = messageMapper;
        this.addressMapper = addressMapper;
        this.userMapper = userMapper;
        this.goodsMapper = goodsMapper;
        this.orderMapper = orderMapper;
    }

    public List<Category> categories() {
        return categoryMapper.findAll();
    }

    public void addCategory(Category category) {
        categoryMapper.insert(category);
    }

    public void updateCategory(Category category) {
        categoryMapper.update(category);
    }

    public void deleteCategory(Integer categoryId) {
        categoryMapper.delete(categoryId);
    }

    public List<UserMessage> inbox(Long userId) {
        return messageMapper.findInbox(userId);
    }

    public List<UserMessage> conversation(Long userId, Long peerId) {
        return messageMapper.findConversation(userId, peerId);
    }

    public void sendMessage(Long senderId, MessageRequest request) {
        if (senderId.equals(request.getReceiverId())) {
            throw new BusinessException("不能给自己发消息");
        }
        UserMessage message = new UserMessage();
        message.setSenderId(senderId);
        message.setReceiverId(request.getReceiverId());
        message.setGoodsId(request.getGoodsId());
        message.setContent(request.getContent());
        messageMapper.insert(message);
    }

    public List<UserAddress> addresses(Long userId) {
        return addressMapper.findByUserId(userId);
    }

    @Transactional
    public void saveAddress(Long userId, UserAddress address) {
        address.setUserId(userId);
        if (address.getIsDefault() != null && address.getIsDefault() == 1) {
            addressMapper.clearDefault(userId);
        }
        if (address.getAddressId() == null) {
            addressMapper.insert(address);
        } else {
            addressMapper.update(address);
        }
    }

    public void deleteAddress(Long userId, Long addressId) {
        addressMapper.delete(addressId, userId);
    }

    public Map<String, Object> dashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("userCount", userMapper.countAll());
        data.put("goodsCount", goodsMapper.countAll());
        data.put("orderCount", orderMapper.countAll());
        data.put("pendingGoodsCount", goodsMapper.countByStatus(0));
        return data;
    }

    public List<User> allUsers() {
        List<User> users = userMapper.findAll();
        users.forEach(u -> u.setPassword(null));
        return users;
    }

    public void updateUserStatus(Long userId, Integer status) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        userMapper.updateStatus(userId, status);
    }
}
