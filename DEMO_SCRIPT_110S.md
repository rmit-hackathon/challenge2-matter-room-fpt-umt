# KỊCH BẢN LỒNG TIẾNG QUAY VIDEO DEMO 110 GIÂY (CHALLENGE 2: TIDE UNLOCKED)
## DỰ ÁN: MATTER ROOM — ZERO-DATA-AUTHORITY VIRTUAL DATA ROOM (BRAINSTORM 2.0)
### Thời lượng: 110 giây (Quy chuẩn nghiêm ngặt < 120 giây của Tide Foundation)

---

### ⏱️ TỔNG QUAN PHÂN BỔ THỜI GIAN & HÀNH ĐỘNG MÀN HÌNH

```mermaid
timeline
    title Lộ trình Demo Video 110 Giây — Chuẩn Brainstorm 2.0
    00:00 - 00:20 : CẢNH 1 : Giới thiệu Vấn đề & Hệ thống 3 Cấp Phân quyền (C0 - C1 - C2)
    00:20 - 00:40 : CẢNH 2 : Negative Test : Sysadmin bị chặn đứng 0% Quyền & Khóa CRUD
    00:40 - 01:05 : CẢNH 3 : Positive Test : All-Keyholders Quorum 3/3 & Giải mã WebCrypto 12ms
    01:05 - 01:25 : CẢNH 4 : Innovation Highlight : Exception Engine (Bảng 5 — Loại trừ Giám hộ bạo hành)
    01:25 - 01:50 : CẢNH 5 : Architecture Inspector : Live Docker 8080, Forseti C# & Tide MCP
```

---

## 🎬 CHI TIẾT KỊCH BẢN TỪNG GIÂY (SCENE-BY-SCENE)

### 📍 CẢNH 1: ĐẶT VẤN ĐỀ & PHÂN TẦNG DỮ LIỆU C0, C1, C2 (00:00 – 00:20)
* **Thao tác màn hình:**
  * Mở trình duyệt tại `http://localhost:5173`.
  * Quay giao diện Matter Room sang trọng, trỏ chuột vào tiêu đề *"Matter Room — SDNY-2026-CV-04421"*.
  * Lướt qua 3 thẻ thống kê phân cấp dữ liệu ở đầu trang:
    * **C0 (Operational):** Vận hành công khai, mở toàn quyền Sửa / Xóa / Xuất.
    * **C1 (Confidential):** Hồ sơ mật nhóm luật sư, cấm sửa/xóa, chỉ luật sư phụ trách được xuất file.
    * **C2 (Sensitive/Sealed):** Bệnh án & chứng cứ niêm phong, cấm sửa/xóa/xuất, bắt buộc Quorum Tất cả bên giữ khóa (*All Keyholders*).
* **Lời thoại tiếng Anh (Đọc vào video):**
  > *"Welcome to Matter Room. In sensitive sexual assault litigation, survivors stay silent because digital evidence systems force them to trust cloud IT administrators. We engineered Matter Room with TideCloak to eliminate this bottleneck. We enforce a strict 3-tier classification: C0 Operational for public dockets, C1 Confidential restricted to legal counsel, and C2 Sensitive sealed evidence where export, edit, and deletion are mathematically prohibited."*
* **Bản dịch tiếng Việt (Để hiểu ý):**
  > *"Chào mừng đến với Matter Room. Trong các vụ kiện xâm hại tình dục nhạy cảm, nạn nhân buộc phải im lặng vì hệ thống quản lý số bắt họ phải tin tưởng các quản trị viên đám mây. Chúng tôi xây dựng Matter Room cùng TideCloak để xóa bỏ hoàn toàn nút thắt niềm tin này. Dữ liệu được chia thành 3 cấp: C0 Vận hành công khai, C1 Bảo mật nhóm thụ lý chỉ luật sư được xuất file, và C2 Chứng cứ niêm phong tuyệt đối cấm sửa, xóa hay xuất ngoài."*

---

### 📍 CẢNH 2: NEGATIVE TEST — QUẢN TRỊ VIÊN BỊ CHẶN TOÁN HỌC 0% DATA AUTHORITY (00:20 – 00:40)
* **Thao tác màn hình:**
  * Click vào Persona Switcher ở Navbar trên cùng, chọn **Alex Mercer (Platform Sysadmin)**.
  * Toàn bộ viền giao diện chuyển sang cảnh báo đỏ `Sysadmin Mode`.
  * Thử click nút **Xóa (Delete)** hoặc **Xuất (Export)** trên dòng tài liệu C1/C2 $\rightarrow$ Bật Toast thông báo đỏ: *“TỪ CHỐI THAO TÁC: Quy tắc C1/C2 cấm xóa/xuất đối với Quản trị viên”*.
  * Bấm nút **"Attempt Decrypt (Sysadmin)"** trên tài liệu C2 (Exhibit B: Forensic Medical Trauma).
  * Modal từ chối đỏ rực bung ra: Hiển thị lỗi `TIDECLOAK DECRYPTION REFUSED`, `Invariant Rule 1`, và `0% Data Authority`.
* **Lời thoại tiếng Anh:**
  > *"Here, we switch to Alex Mercer, the Cloud Infrastructure Admin with full root server privileges. When Alex attempts to export or decrypt the survivor's intimate forensic records, TideCloak's Forseti Enclave immediately shuts him down. Notice: Infrastructure authority is completely severed from cryptographic data authority. Even with root access, Alex possesses zero percent data authority, and WebCrypto throws a mathematical tag mismatch."*
* **Bản dịch tiếng Việt:**
  > *"Tại đây, chúng ta chuyển sang Alex Mercer, quản trị viên hạ tầng đám mây với quyền root máy chủ. Khi Alex cố xuất file hoặc giải mã hồ sơ y khoa nhạy cảm của nạn nhân, TideCloak Forseti Enclave lập tức chặn đứng. Quyền quản trị hạ tầng bị tách rời hoàn toàn khỏi quyền dữ liệu mật mã học. Dù có quyền root, Alex vẫn có 0% quyền truy cập dữ liệu, và WebCrypto ném lỗi sai lệch khóa toán học."*

---

### 📍 CẢNH 3: POSITIVE TEST — ALL-KEYHOLDERS QUORUM 3/3 & WEBCRYPTO 12MS (00:40 – 01:05)
* **Thao tác màn hình:**
  * Chuyển Persona sang **Elena Howard, Esq. (Lead Counsel)** $\rightarrow$ Mở tab **Quorum Approvals**, bấm nút **"Ký duyệt (Sign as Counsel)"** (2/3 chữ ký).
  * Chuyển Persona sang **Sarah Jenkins (Legal Guardian)** $\rightarrow$ Bấm nút **"Ký duyệt (Sign as Guardian)"**.
  * Ngay lập tức trạng thái Quorum chuyển sang huy hiệu xanh ngọc: **APPROVED (3/3 All Keyholders Signed)**!
  * Quay lại bảng Evidence Matrix $\rightarrow$ Nút giải mã chuyển sang màu xanh ngọc **"Giải mã WebCrypto"** $\rightarrow$ Bấm mở **Exhibit B: Confidential Forensic Medical Trauma Evaluation**.
  * Modal giải mã xanh ngọc bung ra sau **12 mili-giây**, hiển thị nội dung y khoa, huy hiệu WebCrypto AES-256-GCM, và đồng hồ đếm ngược tự hủy khóa phiên (Burn Key Timer).
* **Lời thoại tiếng Anh:**
  > *"To unseal sensitive C2 evidence for court submission, all 3 Keyholders must reach consensus. Lead Counsel Elena Howard reviews and signs the request. Then, court-appointed Guardian Sarah Jenkins executes her signature. With all 3 keyholders verified—Survivor, Counsel, and Guardian—the 3-of-3 threshold is fulfilled. Counsel Elena can now synthesize the ephemeral key and decrypt Exhibit B in just 12 milliseconds using native client-side WebCrypto AES-256-GCM."*
* **Bản dịch tiếng Việt:**
  > *"Để mở niêm phong chứng cứ C2 phục vụ nộp Tòa án, cả 3 Bên giữ khóa phải đồng thuận. Luật sư trưởng Elena Howard xem xét và ký duyệt. Kế tiếp, Người giám hộ Sarah Jenkins ký xác nhận. Khi đủ cả 3 bên—Nạn nhân, Luật sư và Người giám hộ—ngưỡng 3/3 được kích hoạt. Luật sư Elena giờ đây có thể tự tổng hợp khóa phiên và giải mã thành công Exhibit B chỉ trong 12 mili-giây bằng WebCrypto AES-256-GCM."*

---

### 📍 CẢNH 4: INNOVATION HIGHLIGHT — EXCEPTION SAFEGUARDS ENGINE (BẢNG 5) (01:05 – 01:25)
* **Thao tác màn hình:**
  * Bấm vào nút vàng cam **"⚡ Exception Engine (Table 5)"** trên Navbar hoặc đầu trang Evidence Matrix.
  * Modal Mô phỏng Ngoại lệ mở ra:
    * Bật Toggle **"Rule 4: Nghi ngờ Người giám hộ bạo hành (Guardian Conflicted)"**.
    * Hệ thống ngay lập tức phát banner cảnh báo đỏ khẩn cấp: *Sarah Jenkins bị cách ly khỏi luồng duyệt Quorum, tự động hạ ngưỡng từ 3/3 xuống 2/2 (Jane Doe + Elena Howard)*.
    * Ghi vết kiểm toán tự động `[EXCEPTION_RULE_4] Conflicted guardian excluded`.
    * Chỉ chuột vào Toggle **"Rule 3: Silence != Consent"** và **"Rule 8: Outage Fail-Closed"** chứng minh tính kiên cường Zero-Trust.
* **Lời thoại tiếng Anh:**
  > *"Real-world litigation involves traumatic edge cases. In our Exception Simulator, we implement Table 5 safeguards. When we trigger Rule 4—Guardian Implicated in Abuse—TideCloak instantly isolates Guardian Sarah Jenkins, flags an emergency audit alert, and falls back to a 2-of-2 Quorum between Survivor and Counsel. Furthermore, Rule 3 guarantees silence is never consent, and Rule 8 enforces zero-trust fail-closed during network outages."*
* **Bản dịch tiếng Việt:**
  > *"Thực tế tố tụng luôn có những trường hợp ngoại lệ đau lòng. Trong bộ mô phỏng ngoại lệ, chúng tôi hiện thực hóa trọn vẹn Bảng 5. Khi kích hoạt Quy tắc 4—Nghi ngờ người giám hộ bạo hành—TideCloak lập tức cách ly Sarah Jenkins, phát cảnh báo kiểm toán khẩn cấp, và tự động hạ ngưỡng Quorum về 2/2 giữa Nạn nhân và Luật sư. Hơn nữa, Quy tắc 3 bảo đảm không bao giờ coi im lặng là đồng ý, và Quy tắc 8 kích hoạt chế độ đóng băng an toàn tuyệt đối khi mạng gặp sự cố."*

---

### 📍 CẢNH 5: BẰNG CHỨNG KIẾN TRÚC & LỜI KẾT (01:25 – 01:50)
* **Thao tác màn hình:**
  * Bấm vào nút huy hiệu **"TideCloak Live (8080)"** trên Navbar.
  * Mở **Enclave Inspector Modal**:
    * Tab 1: Trỏ chuột vào dòng `● LIVE DOCKER OIDC` đang chạy cổng `8080` cùng realm OIDC với vai trò `GUARDIAN`.
    * Tab 2: Lướt qua Hợp đồng Forseti C# kiểm tra đồng thời Invariant 1 (`ADMIN`/`IT_ADMIN`), Invariant 2 (C0), Invariant 3 (C1), và Invariant 4 (C2 Quorum 3/3).
    * Tab 3: Cấu hình Raziel MCP Server `https://mcp.tide.org/mcp`.
* **Lời thoại tiếng Anh:**
  > *"Opening the Enclave Inspector, you can verify our live Docker TideCloak container running on port 8080 with OIDC realm import, our Forseti C# policy contract enforcing C0, C1, C2 rules, and Tide MCP integration. Matter Room proves that trust no longer needs to be the bottleneck. Privacy and human dignity are guaranteed by mathematics, not human promises. Thank you!"*
* **Bản dịch tiếng Việt:**
  > *"Mở bảng Enclave Inspector, bạn có thể kiểm chứng máy chủ TideCloak Docker đang chạy trực tiếp trên cổng 8080 cùng realm OIDC, hợp đồng chính sách Forseti C# thực thi triệt để các quy tắc C0, C1, C2, và kết nối Tide MCP. Matter Room chứng minh rằng niềm tin không còn là rào cản. Quyền riêng tư và nhân phẩm con người được bảo vệ bằng toán học, không phải lời hứa của con người. Cảm ơn các bạn!"*

---

## 💡 MẸO QUAY VIDEO ĐẠT ĐIỂM TUYỆT ĐỐI (100/100 TỪ BAN GIÁM KHẢO)
1. **Âm thanh:** Dùng mic lọc tạp âm, ngữ điệu dứt khoát, tự tin, phát âm rõ các thuật ngữ kỹ thuật (*Emergent Authority, Forseti Enclave, Zero-Data-Authority, WebCrypto AES-GCM*).
2. **Độ phân giải:** Quay màn hình chuẩn 1080p (1920x1080) tỉ lệ 16:9, zoom chuột mượt mà vào các chi tiết huy hiệu và toast thông báo.
3. **Thời lượng:** Canh đồng hồ đúng **110 giây** (tuyệt đối không vượt 120 giây).
4. **Định dạng file:** Xuất MP4 H.264 dưới 60MB, đặt tên `matter-room-demo-110s.mp4`.
