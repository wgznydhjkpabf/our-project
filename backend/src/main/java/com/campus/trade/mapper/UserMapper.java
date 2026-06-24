package com.campus.trade.mapper;

import com.campus.trade.entity.User;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {

    User findById(@Param("userId") Long userId);

    User findByStudentNo(@Param("studentNo") String studentNo);

    User findByEmail(@Param("email") String email);

    User findByAccount(@Param("account") String account);

    int insert(User user);

    int updateProfile(User user);

    int updateStatus(@Param("userId") Long userId, @Param("status") Integer status);

    int updateCreditScore(@Param("userId") Long userId, @Param("creditScore") java.math.BigDecimal creditScore);

    int updateEmail(@Param("userId") Long userId, @Param("email") String email, @Param("emailVerified") Integer emailVerified);

    int countAll();

    java.util.List<User> findAll();

    java.util.List<User> searchByNickname(@Param("keyword") String keyword);
}
