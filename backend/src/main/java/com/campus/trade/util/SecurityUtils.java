package com.campus.trade.util;

import com.campus.trade.common.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new BusinessException(401, "未登录");
        }
        return (Long) auth.getPrincipal();
    }

    public static Integer currentRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getDetails() == null) {
            throw new BusinessException(401, "未登录");
        }
        return (Integer) auth.getDetails();
    }
}
