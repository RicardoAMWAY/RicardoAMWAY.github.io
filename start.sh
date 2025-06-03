#!/bin/bash

echo "🎯 启动掼蛋记分器..."
echo "📁 当前目录: $(pwd)"
echo ""

# 检查是否在正确的项目目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请确保在项目根目录中运行此脚本"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    echo "   可以使用: brew install node"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    npm install
fi

echo "🚀 启动开发服务器..."
echo "   本地访问地址: http://localhost:5173"
echo "   按 Ctrl+C 停止服务器"
echo ""

npm run dev 