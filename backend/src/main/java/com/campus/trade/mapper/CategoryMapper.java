package com.campus.trade.mapper;

import com.campus.trade.entity.Category;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CategoryMapper {

    List<Category> findAll();

    int insert(Category category);

    int update(Category category);

    int delete(@Param("categoryId") Integer categoryId);
}
