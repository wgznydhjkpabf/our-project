@echo off
chcp 65001 >nul
echo ========================================
echo   启动前端 (React + Ant Design) - 端口 5173
echo ========================================
cd /d "%~dp0frontend"
if not exist "node_modules\react\" (
    echo 首次运行或框架切换后，正在安装依赖...
    if exist "node_modules\" rmdir /s /q node_modules
    call npm install
)
call npm run dev
pause
