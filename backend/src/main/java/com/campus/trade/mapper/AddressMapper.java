package com.campus.trade.mapper;

import com.campus.trade.entity.UserAddress;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AddressMapper {

    List<UserAddress> findByUserId(@Param("userId") Long userId);

    UserAddress findById(@Param("addressId") Long addressId);

    int insert(UserAddress address);

    int update(UserAddress address);

    int delete(@Param("addressId") Long addressId, @Param("userId") Long userId);

    int clearDefault(@Param("userId") Long userId);
}
