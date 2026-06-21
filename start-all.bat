@echo off
chcp 65001 >nul
echo ========================================
echo   校园二手交易平台 - 一键启动
echo ========================================

echo [1/3] 初始化数据库...
mysql -u root -p58612497aA < "%~dp0sql\init.sql"
if %errorlevel% neq 0 (
    echo [警告] 数据库初始化失败（可能已存在），继续启动...
)

echo [2/3] 启动后端 (新窗口)...
start "CampusTrade-Backend" cmd /k "%~dp0start-backend.bat"

echo 等待后端启动 (15秒)...
timeout /t 15 /nobreak >nul

echo [3/3] 启动前端 (新窗口)...
start "CampusTrade-Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo ========================================
echo   启动完成！
echo   前端: http://localhost:5173
echo   后端: http://localhost:8080
echo   管理员: admin / admin123
echo ========================================
pause
