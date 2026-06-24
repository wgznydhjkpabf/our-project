package com.campus.trade.mapper;

import com.campus.trade.entity.EmailVerifyCode;
import org.apache.ibatis.annotations.Param;

public interface EmailVerifyCodeMapper {

    int insert(EmailVerifyCode record);

    EmailVerifyCode findLatestValid(@Param("email") String email,
                                    @Param("scene") String scene,
                                    @Param("code") String code);

    int markUsed(@Param("id") Long id);

    int countRecentByEmail(@Param("email") String email, @Param("minutes") int minutes);
}
