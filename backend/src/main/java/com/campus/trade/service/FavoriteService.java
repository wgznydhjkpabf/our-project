package com.campus.trade.service;

import com.campus.trade.common.BusinessException;
import com.campus.trade.entity.Goods;
import com.campus.trade.entity.UserFavorite;
import com.campus.trade.mapper.GoodsMapper;
import com.campus.trade.mapper.UserFavoriteMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FavoriteService {

    private final UserFavoriteMapper favoriteMapper;
    private final GoodsMapper goodsMapper;

    public FavoriteService(UserFavoriteMapper favoriteMapper, GoodsMapper goodsMapper) {
        this.favoriteMapper = favoriteMapper;
        this.goodsMapper = goodsMapper;
    }

    @Transactional
    public void toggle(Long userId, Long goodsId) {
        Goods goods = goodsMapper.findById(goodsId);
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        if (goods.getUserId().equals(userId)) {
            throw new BusinessException("不能收藏自己的商品");
        }

        UserFavorite existing = favoriteMapper.findByUserIdAndGoodsId(userId, goodsId);
        if (existing != null) {
            favoriteMapper.deleteByUserIdAndGoodsId(userId, goodsId);
        } else {
            UserFavorite favorite = new UserFavorite();
            favorite.setUserId(userId);
            favorite.setGoodsId(goodsId);
            favoriteMapper.insert(favorite);
        }
    }

    public boolean isFavorite(Long userId, Long goodsId) {
        return favoriteMapper.findByUserIdAndGoodsId(userId, goodsId) != null;
    }

    public List<UserFavorite> list(Long userId) {
        return favoriteMapper.findByUserId(userId);
    }

    public Map<String, Object> count(Long userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("count", favoriteMapper.countByUserId(userId));
        return result;
    }
}
