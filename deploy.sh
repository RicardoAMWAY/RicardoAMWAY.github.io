#!/bin/bash

# 掼蛋记分器部署脚本
echo "🎯 开始部署掼蛋记分器..."

# 检查当前配置
echo "🔧 检查 Vite 配置..."
if grep -q 'base: "\\./"' vite.config.ts || grep -q "base: '\\./" vite.config.ts; then
    echo "✅ Vite 配置正确（使用相对路径）"
else
    echo "⚠️  正在修复 Vite 配置为相对路径..."
    sed -i.bak 's/base: ["\047]\/["\047]/base: "\.\/"/' vite.config.ts
    echo "✅ Vite 配置已修复"
fi

# 构建项目
echo "🔨 重新构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 将构建文件复制到根目录（GitHub Pages 需要）
echo "📁 准备 GitHub Pages 文件..."

# 复制构建文件到根目录
cp dist/index.html .
echo "✅ index.html 已复制"

# 更新 assets 目录
rm -rf assets
cp -r dist/assets .
echo "✅ assets 目录已更新"

# 复制 manifest.json
cp dist/manifest.json .
echo "✅ manifest.json 已复制"

# 创建部署包（备用）
echo "📦 创建部署包..."
rm -rf github-pages-deploy
mkdir -p github-pages-deploy
cp index.html github-pages-deploy/
cp -r assets github-pages-deploy/
cp manifest.json github-pages-deploy/
echo "✅ 部署包已准备在 github-pages-deploy/ 目录"

# 验证文件
echo "🔍 验证部署文件..."
if grep -q "掼蛋记分器" index.html; then
    echo "✅ 标题正确：掼蛋记分器"
else
    echo "❌ 标题验证失败"
    exit 1
fi

if [ -f "assets/index-"*".js" ]; then
    echo "✅ JavaScript 文件存在"
else
    echo "❌ JavaScript 文件缺失"
    exit 1
fi

if [ -f "assets/index-"*".css" ]; then
    echo "✅ CSS 文件存在"
else
    echo "❌ CSS 文件缺失"
    exit 1
fi

# 提交更改
echo "📝 提交更改..."
git add -A
git commit -m "部署更新：修复 GitHub Pages 路径问题，添加计时和烟花功能

- 修复标题为'掼蛋记分器'
- 添加玩家记录和进度条功能
- 添加防连点保护机制（3秒冷却）
- 添加游戏时间记录功能
- 添加获胜烟花效果
- 修复 Vite 配置使用相对路径
- 将构建文件正确放置在根目录"

# 尝试推送到 GitHub
echo "📤 尝试推送到 GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署成功！"
    echo "🌐 网站将在几分钟内更新：https://ricardoamway.github.io"
    echo ""
    echo "⏱️  等待 2-3 分钟后访问网站验证功能"
else
    echo ""
    echo "⚠️  推送失败，可能是网络问题"
    echo "📋 请手动将以下文件上传到 GitHub 仓库根目录:"
    echo "   1. 访问 https://github.com/RicardoAMWAY/RicardoAMWAY.github.io"
    echo "   2. 删除仓库中的旧文件"
    echo "   3. 上传 github-pages-deploy/ 目录中的文件："
    echo "      - index.html"
    echo "      - assets/ 文件夹"
    echo "      - manifest.json"
    echo ""
    echo "   或者等网络恢复后重新运行此脚本"
fi

echo ""
echo "🔍 功能验证清单（部署后检查）："
echo "✅ 标题显示'掼蛋记分器'"
echo "✅ 玩家记录部分显示两个队伍的进度条"
echo "✅ 防连点功能（按钮点击后3秒内不能再次点击）"
echo "✅ 游戏时间记录（开始游戏后记录时间）"
echo "✅ 获胜烟花效果（有队伍获胜时显示烟花）"
echo "✅ 获胜弹窗显示游戏时长"
echo ""
echo "💡 如果网站没有更新，请："
echo "   1. 等待 2-3 分钟（GitHub Pages 更新需要时间）"
echo "   2. 清除浏览器缓存或按 Ctrl+F5 强制刷新"
echo "   3. 检查 GitHub 仓库的 Settings → Pages 设置" 