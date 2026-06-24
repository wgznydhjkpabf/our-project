package com.campus.trade.mapper;

import com.campus.trade.entity.Goods;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface GoodsMapper {

    Goods findById(@Param("goodsId") Long goodsId);

    List<Goods> search(@Param("keyword") String keyword,
                       @Param("categoryId") Integer categoryId,
                       @Param("status") Integer status,
                       @Param("userId") Long userId,
                       @Param("offset") int offset,
                       @Param("limit") int limit);

    int countSearch(@Param("keyword") String keyword,
                    @Param("categoryId") Integer categoryId,
                    @Param("status") Integer status,
                    @Param("userId") Long userId);

    int insert(Goods goods);

    int update(Goods goods);

    int updateStatus(@Param("goodsId") Long goodsId, @Param("status") Integer status);

    int increaseViewCount(@Param("goodsId") Long goodsId);

    int countAll();

    int countByStatus(@Param("status") Integer status);
}
