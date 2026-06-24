@echo off
chcp 65001 >nul
echo ========================================
echo   初始化校园二手交易平台数据库
echo   账号: root  密码: 123456
echo ========================================

mysql -u root -p123456 < "%~dp0sql\init.sql"
if %errorlevel% neq 0 (
    echo.
    echo [失败] 数据库初始化失败，请检查：
    echo   1. MySQL 服务是否已启动
    echo   2. 账号密码是否为 root / 123456
    echo   3. mysql 命令是否在 PATH 环境变量中
    pause
    exit /b 1
)

echo.
echo [成功] 数据库 campus_trade 初始化完成！
pause
