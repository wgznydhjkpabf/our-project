package com.campus.trade.mapper;

import com.campus.trade.entity.UserFavorite;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserFavoriteMapper {

    void insert(UserFavorite favorite);

    void deleteByUserIdAndGoodsId(Long userId, Long goodsId);

    UserFavorite findByUserIdAndGoodsId(Long userId, Long goodsId);

    List<UserFavorite> findByUserId(Long userId);

    int countByUserId(Long userId);

    int countByGoodsId(Long goodsId);
}
