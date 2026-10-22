# KỊCH BẢN LỒNG TIẾNG QUAY VIDEO DEMO 110 GIÂY (CHALLENGE 2: TIDE UNLOCKED)
## DỰ ÁN: MATTER ROOM — ZERO-DATA-AUTHORITY VIRTUAL DATA ROOM
### Thời lượng: 110 giây (Đúng quy chuẩn < 120 giây của Tide Foundation)

---

### ⏱️ TỔNG QUAN PHÂN BỔ THỜI GIAN & HÀNH ĐỘNG MÀN HÌNH

```mermaid
timeline
    title Lộ trình Demo Video 110 Giây
    00:00 - 00:25 : CẢNH 1 : Giới thiệu Vấn đề & Nút thắt niềm tin
    00:25 - 00:50 : CẢNH 2 : Negative Test : Sysadmin bị chặn đứng 0% quyền
    00:50 - 01:15 : CẢNH 3 : Quorum Approval : Luật sư ký duyệt 2/2
    01:15 - 01:35 : CẢNH 4 : Positive Test : Bác sĩ giải mã WebCrypto AES-GCM
    01:35 - 01:50 : CẢNH 5 : Architecture Inspector : Live Docker & Forseti C#
```

---

## 🎬 CHI TIẾT KỊCH BẢN TỪNG GIÂY (SCENE-BY-SCENE)

### 📍 CẢNH 1: ĐẶT VẤN ĐỀ & NÚT THẮT NIỀM TIN (00:00 – 00:25)
* **Thao tác màn hình:**
  * Mở trình duyệt tại `http://localhost:5173`.
  * Quay toàn cảnh giao diện Matter Room sang trọng, chỉ chuột vào tiêu đề *"Matter Room — SDNY-2026-CV-04421"*.
  * Lướt nhẹ qua bảng Evidence Matrix hiển thị các bằng chứng vụ án nhạy cảm.
* **Lời thoại tiếng Anh (Đọc vào video):**
  > *"Welcome to Matter Room. In sensitive sexual assault and civil rights litigation, survivors often remain silent because digital evidence systems force them to trust cloud IT administrators. A single curious sysadmin or compromised credential can leak intimate disclosures. We built Matter Room with TideCloak to eliminate this trust bottleneck entirely using Emergent Authority."*
* **Bản dịch tiếng Việt (Để hiểu ý):**
  > *"Chào mừng đến với Matter Room. Trong các vụ kiện xâm hại tình dục nhạy cảm, nạn nhân thường phải im lặng vì hệ thống quản lý hồ sơ số buộc họ phải tin tưởng các quản trị viên máy chủ đám mây. Chỉ một admin tò mò hay một tài khoản bị lộ có thể làm rò rỉ lời khai nhạy cảm. Chúng tôi xây dựng Matter Room cùng TideCloak để xóa bỏ hoàn toàn nút thắt niềm tin này bằng Emergent Authority."*

---

### 📍 CẢNH 2: NEGATIVE TEST — QUẢN TRỊ VIÊN BỊ CHẶN TOÁN HỌC (00:25 – 00:50)
* **Thao tác màn hình:**
  * Click vào Persona Switcher ở thanh Navbar trên cùng, chọn **Alex Mercer (Platform Sysadmin)**.
  * Toàn bộ theme chuyển sang viền cảnh báo đỏ `Sysadmin Mode`.
  * Bấm nút **"Attempt Decrypt (Sysadmin)"** trên tài liệu nhạy cảm (doc_03 hoặc doc_04).
  * Modal từ chối màu đỏ rực bung ra: Hiển thị lỗi `TIDECLOAK DECRYPTION REFUSED`, `Invariant Rule 1`, và `0% Data Authority`.
* **Lời thoại tiếng Anh:**
  > *"Here, we switch to Alex Mercer, the Cloud Infrastructure Admin with full root server privileges. When Alex attempts to decrypt the survivor's intimate medical records, TideCloak's Forseti Enclave immediately shuts him down. Notice: Infrastructure authority is strictly severed from cryptographic data authority. Even with root access, Alex possesses zero data authority, and WebCrypto throws a mathematical tag mismatch."*
* **Bản dịch tiếng Việt:**
  > *"Ở đây, chúng ta chuyển sang Alex Mercer, quản trị viên hạ tầng đám mây với quyền root tối cao. Khi Alex cố tình giải mã hồ sơ y khoa nhạy cảm của nạn nhân, TideCloak Forseti Enclave ngay lập tức chặn đứng. Quyền quản trị hạ tầng đã bị tách rời hoàn toàn khỏi quyền mật mã học. Dù có quyền root, Alex vẫn có 0% quyền truy cập dữ liệu, và WebCrypto ném lỗi toán học ngay lập tức."*

---

### 📍 CẢNH 3: DUAL-CONSENT QUORUM APPROVAL (00:50 – 01:15)
* **Thao tác màn hình:**
  * Chuyển Persona sang **Dr. Miriam Vance (Forensic Expert)**.
  * Click vào **Exhibit B: Forensic Medical Trauma Evaluation** $\rightarrow$ Hệ thống báo lỗi khóa Quorum `QUORUM_REQUIRED (1/2 signed)`.
  * Chuyển Persona sang **Elena Howard, Esq. (Lead Counsel)**.
  * Mở tab **Quorum Approvals**, bấm nút **"Approve & Sign Enclave Quorum"**.
  * Chữ ký số thứ 2 được ghi nhận, trạng thái chuyển sang **APPROVED (2/2)** màu xanh ngọc.
* **Lời thoại tiếng Anh:**
  > *"Now, independent forensic examiner Dr. Miriam Vance needs to verify trauma evidence for court testimony. Under ordinary access, Exhibit B is cryptographically locked because Quorum threshold is pending. To unlock it, Lead Counsel Elena Howard reviews the request and signs the enclave escrow. Once both Survivor Jane Doe and Counsel Elena sign, the 2-of-2 Quorum consensus is mathematically fulfilled."*
* **Bản dịch tiếng Việt:**
  > *"Bây giờ, bác sĩ pháp y độc lập Dr. Miriam Vance cần thẩm định thương tật để làm chứng trước tòa. Ban đầu, Exhibit B bị khóa chặt vì thiếu Quorum. Để mở khóa, Luật sư trưởng Elena Howard xem xét và ký duyệt vào Quorum. Khi cả Nạn nhân và Luật sư đều đã ký, ngưỡng đồng thuận 2/2 được kích hoạt về mặt toán học."*

---

### 📍 CẢNH 4: POSITIVE TEST — GIẢI MÃ WEBCRYPTO AES-256-GCM (01:15 – 01:35)
* **Thao tác màn hình:**
  * Chuyển Persona lại thành **Dr. Miriam Vance**.
  * Bấm mở lại **Exhibit B** $\rightarrow$ Modal giải mã màu xanh ngọc bung ra trong **12ms**!
  * Hiển thị đầy đủ biên bản giám định y khoa, huy hiệu WebCrypto AES-256-GCM, và đồng hồ đếm ngược tự hủy khóa phiên (Burn Key Timer).
* **Lời thoại tiếng Anh:**
  > *"Switching back to Dr. Vance, she now decrypts Exhibit B in just 12 milliseconds using native client-side WebCrypto AES-256-GCM. The ephemeral session key was synthesized directly inside her browser enclave—never touching our backend servers. She can inspect the findings, copy the attested payload, or immediately burn the session key."*
* **Bản dịch tiếng Việt:**
  > *"Chuyển lại về Bác sĩ Vance, bà mở khóa thành công Exhibit B chỉ trong 12 mili-giây bằng thuật toán WebCrypto AES-256-GCM chạy trên RAM trình duyệt. Khóa phiên tạm thời được tổng hợp ngay tại máy khách—hoàn toàn không chạm vào máy chủ backend. Bà có thể xem kết quả, sao chép payload chứng thực, hoặc tự bấm hủy khóa phiên."*

---

### 📍 CẢNH 5: BẰNG CHỨNG KIẾN TRÚC & KẾT LUẬN (01:35 – 01:50)
* **Thao tác màn hình:**
  * Bấm vào nút huy hiệu **"TideCloak Live (8080)"** trên Navbar.
  * Mở **Enclave Inspector Modal**:
    * Tab 1: Chỉ vào dòng `● LIVE DOCKER OIDC` đang chạy cổng `8080` và JWT token RS256.
    * Tab 2: Lướt qua Hợp đồng Forseti C# kèm mã băm SHA-512 `0x91F4A801...`.
    * Tab 3: Cấu hình MCP Server Raziel `https://mcp.tide.org/mcp`.
* **Lời thoại tiếng Anh:**
  > *"Opening the Enclave Inspector, you can verify our live Docker TideCloak dev container running on port 8080 with OIDC realm import, our Forseti C# policy contract verified by SHA-512 bytecode, and Tide MCP integration. Matter Room proves that trust no longer needs to be the bottleneck. Privacy is guaranteed by mathematics, not human promises. Thank you!"*
* **Bản dịch tiếng Việt:**
  > *"Mở bảng Enclave Inspector, bạn có thể kiểm chứng máy chủ TideCloak Docker đang chạy live ở cổng 8080 cùng realm OIDC, hợp đồng chính sách Forseti C# được bảo chứng bằng mã băm SHA-512, và kết nối Tide MCP. Matter Room chứng minh rằng niềm tin không còn là rào cản. Sự riêng tư được bảo đảm bằng toán học, không phải lời hứa của con người. Cảm ơn các bạn!"*

---

## 💡 MẸO QUAY VIDEO ĐẠT ĐIỂM TUYỆT ĐỐI (100/100)
1. **Âm thanh:** Dùng mic tai nghe rõ tiếng, nói với tốc độ vừa phải, tự tin.
2. **Độ phân giải:** Quay màn hình ở độ phân giải 1080p (1920x1080) hoặc tỉ lệ 16:9.
3. **Thời lượng:** Canh đồng hồ đúng **110 giây** (không được vượt quá 120 giây).
4. **Định dạng file:** Lưu file dưới tên `matter-room/demo.mp4` với dung lượng dưới 60MB để tiện upload Google Drive hoặc YouTube unlisted link.
