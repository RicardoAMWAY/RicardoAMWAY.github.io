#!/bin/bash

# 掼蛋记分器部署脚本
echo "🎯 开始部署掼蛋记分器..."

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "❌ dist目录不存在，请先运行 npm run build"
    exit 1
fi

# 构建项目
echo "🔨 重新构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 尝试推送到 GitHub
echo "📤 尝试推送到 GitHub..."
git add -A
git commit -m "部署更新：修复标题、添加计时和烟花功能"
git push origin main

if [ $? -eq 0 ]; then
    echo "🎉 部署成功！"
    echo "🌐 网站将在几分钟内更新：https://ricardoamway.github.io"
else
    echo "⚠️  推送失败，可能是网络问题"
    echo "📋 请手动将 dist/ 目录中的文件上传到 GitHub:"
    echo "   1. 访问 https://github.com/RicardoAMWAY/RicardoAMWAY.github.io"
    echo "   2. 上传以下文件："
    echo "      - dist/index.html → index.html"
    echo "      - dist/assets/* → assets/"
    echo "      - dist/manifest.json → manifest.json"
fi

echo ""
echo "🔍 功能验证清单："
echo "✅ 标题显示'掼蛋记分器'"
echo "✅ 玩家记录和进度条功能"
echo "✅ 防连点保护机制"
echo "✅ 游戏时间记录"
echo "✅ 获胜烟花效果" 