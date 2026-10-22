#!/bin/bash
# ==============================================================================
# SCRIPT KHỞI CHẠY TIDECLOAK SERVER CONTAINER HOẶC FALLBACK HYBRID ENCLAVE
# Matter Room — RMIT Hackathon Challenge 2 (Tide Unlocked)
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

echo "======================================================================"
echo "🛡️  MATTER ROOM: KHỞI CHẠY HỆ SINH THÁI TIDECLOAK & EMERGENT AUTHORITY"
echo "======================================================================"

# Kiểm tra Docker có sẵn và daemon đang chạy không
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    echo "✅ Phát hiện Docker Daemon đang hoạt động."
    echo "🚀 Đang khởi động container TideCloak Dev Server (port 8080)..."
    
    docker compose -f docker-compose.tidecloak.yml up -d
    
    echo "⏳ Đang đợi TideCloak Server nạp Realm 'matter-room'..."
    sleep 3
    
    echo "✨ TideCloak Server đã sẵn sàng tại: http://localhost:8080/"
    echo "🔑 Admin Console: http://localhost:8080/admin (user: admin / pass: admin)"
    echo "🌐 OIDC Endpoint: http://localhost:8080/realms/matter-room"
else
    echo "⚠️  Docker không khả dụng hoặc Docker daemon chưa bật."
    echo "🔄 Kích hoạt chế độ: 'SECURE WEB ENCLAVE FALLBACK' (W3C WebCrypto Native)"
    echo "💡 Ứng dụng Matter Room sẽ tự động sử dụng Engine Mật mã học trên Trình duyệt"
    echo "   (AES-256-GCM + Quorum TSS) theo đúng cấu hình trong 'tidecloak.json'."
fi

echo ""
echo "🚀 Đang khởi động Web App Matter Room..."
npm run dev
