@echo off
chcp 65001 >nul
echo ========================================
echo   启动后端 (Spring Boot) - 端口 8080
echo ========================================
cd /d "%~dp0backend"
echo 正在编译...
call mvn clean compile -DskipTests
if %errorlevel% neq 0 (
    echo [失败] 编译失败，请检查上方错误信息
    pause
    exit /b 1
)
call mvn spring-boot:run
pause
