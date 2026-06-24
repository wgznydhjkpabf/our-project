package com.campus.trade.service;

import com.campus.trade.common.BusinessException;
import com.campus.trade.dto.GoodsRequest;
import com.campus.trade.entity.Goods;
import com.campus.trade.mapper.GoodsMapper;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GoodsService {

    private final GoodsMapper goodsMapper;

    public GoodsService(GoodsMapper goodsMapper) {
        this.goodsMapper = goodsMapper;
    }

    public Map<String, Object> list(String keyword, Integer categoryId, Integer status,
                                    Long userId, String sortBy, int page, int size) {
        int offset = (page - 1) * size;
        List<String> allowedSortBy = Arrays.asList("time", "price_asc", "price_desc", "view_count");
        if (!allowedSortBy.contains(sortBy)) {
            sortBy = null;
        }
        List<Goods> list = goodsMapper.search(keyword, categoryId, status, userId, sortBy, offset, size);
        int total = goodsMapper.countSearch(keyword, categoryId, status, userId);
        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        return result;
    }

    public Goods detail(Long goodsId) {
        Goods goods = goodsMapper.findById(goodsId);
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        goodsMapper.increaseViewCount(goodsId);
        goods.setViewCount(goods.getViewCount() + 1);
        return goods;
    }

    public Long publish(Long userId, GoodsRequest request) {
        Goods goods = toEntity(request);
        goods.setUserId(userId);
        goods.setStatus(0);
        goodsMapper.insert(goods);
        return goods.getGoodsId();
    }

    public void update(Long userId, Long goodsId, GoodsRequest request) {
        Goods existing = requireOwnerGoods(userId, goodsId);
        Goods goods = toEntity(request);
        goods.setGoodsId(goodsId);
        goods.setUserId(existing.getUserId());
        goods.setStatus(existing.getStatus() == 2 ? 2 : 0);
        goodsMapper.update(goods);
    }

    public void offShelf(Long userId, Long goodsId) {
        requireOwnerGoods(userId, goodsId);
        goodsMapper.updateStatus(goodsId, 3);
    }

    public void audit(Long goodsId, boolean pass) {
        Goods goods = goodsMapper.findById(goodsId);
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        goodsMapper.updateStatus(goodsId, pass ? 1 : 3);
    }

    private Goods requireOwnerGoods(Long userId, Long goodsId) {
        Goods goods = goodsMapper.findById(goodsId);
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        if (!goods.getUserId().equals(userId)) {
            throw new BusinessException(403, "无权操作该商品");
        }
        return goods;
    }

    private Goods toEntity(GoodsRequest request) {
        Goods goods = new Goods();
        goods.setCategoryId(request.getCategoryId());
        goods.setTitle(request.getTitle());
        goods.setDescription(request.getDescription());
        goods.setPrice(request.getPrice());
        goods.setOriginalPrice(request.getOriginalPrice());
        goods.setConditionLevel(request.getConditionLevel() == null ? 3 : request.getConditionLevel());
        goods.setImages(request.getImages());
        goods.setTradeLocation(request.getTradeLocation());
        return goods;
    }
}
