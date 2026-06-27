/**
 * Google Apps Script - Flappy Bird Voucher Backend for VietinBank
 * Để sử dụng: 
 * 1. Mở Google Sheets -> Extensions -> Apps Script.
 * 2. Copy nội dung file này dán vào Code.gs
 * 3. Tạo Sheet có các cột như yêu cầu (createdAt, dateKey, sessionId, fullName, phone, score, etc).
 * 4. Deploy as Web App -> Anyone (Bất kỳ ai).
 */

const SHEET_NAME = "VoucherData";

function doPost(e) {
  try {
    let rawData = e.postData.contents;
    let data = JSON.parse(rawData);

    let phone = data.phone;
    let score = parseInt(data.score, 10) || 0;
    
    // Yêu cầu tối thiểu
    if (!phone || !data.fullName || score < 30) {
      return responseJson({
        success: false,
        status: "INVALID_SCORE",
        message: "Điểm chưa đủ điều kiện nhận voucher hoặc thiếu thông tin."
      });
    }
    
    let dateKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    
    // Kiểm tra trùng SĐT trong ngày
    if (checkPhoneReceivedToday(phone, dateKey)) {
      return responseJson({
        success: false,
        status: "DUPLICATE_PHONE_TODAY",
        message: "Số điện thoại này đã nhận voucher hôm nay. Cảm ơn Quý khách đã tham gia."
      });
    }
    
    // Tính toán reward ở backend
    let rewardCount = calculateReward(score);
    if (rewardCount === 0) {
      return responseJson({
        success: false,
        status: "INVALID_SCORE",
        message: "Điểm chưa đủ điều kiện nhận voucher."
      });
    }

    // Sinh mã voucher
    let voucherCodes = [];
    for (let i = 0; i < rewardCount; i++) {
      voucherCodes.push(generateVoucherCode(dateKey));
    }
    
    // Lưu vào Sheet
    appendDataToSheet({
      ...data,
      dateKey: dateKey,
      status: "APPROVED",
      voucherCount: rewardCount,
      voucherCodes: voucherCodes.join(",")
    });
    
    return responseJson({
      success: true,
      status: "APPROVED",
      message: rewardCount === 2 ? "Xuất sắc! Quý khách nhận được 2 voucher 2 lít xăng." : "Chúc mừng Quý khách đã nhận voucher!",
      score: score,
      voucherCount: rewardCount,
      voucherCodes: voucherCodes
    });
    
  } catch (error) {
    return responseJson({
      success: false,
      status: "ERROR",
      message: "Có lỗi xảy ra, vui lòng thử lại sau.",
      error: error.toString()
    });
  }
}

function calculateReward(score) {
  if (score >= 50) return 2;
  if (score >= 30) return 1;
  return 0;
}

function checkPhoneReceivedToday(phone, dateKey) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return false;
  
  let data = sheet.getDataRange().getValues();
  // Giả định cột: dateKey ở index 1, phone ở index 5, status ở index 12 (0-indexed)
  // Thực tế cần mapping chính xác theo cấu trúc cột bạn tạo.
  for (let i = 1; i < data.length; i++) {
    let rowDate = data[i][1]; 
    let rowPhone = data[i][5];
    let rowStatus = data[i][12];
    
    if (rowDate === dateKey && rowPhone == phone && rowStatus === "APPROVED") {
      return true;
    }
  }
  return false;
}

function generateVoucherCode(dateKey) {
  let datePart = dateKey.replace(/-/g, "");
  let randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return "VTB-XANG-" + datePart + "-" + randomPart;
}

function appendDataToSheet(record) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    // Khởi tạo headers
    sheet.appendRow(["createdAt", "dateKey", "sessionId", "fullName", "phone", "score", "voucherCount", "voucherCodes", "playStartedAt", "playEndedAt", "durationSeconds", "tapCount", "status", "userAgent", "note"]);
  }
  
  sheet.appendRow([
    new Date().toISOString(),
    record.dateKey,
    record.sessionId || "",
    record.fullName,
    record.phone,
    record.score,
    record.voucherCount,
    record.voucherCodes,
    record.playStartedAt || "",
    record.playEndedAt || "",
    record.durationSeconds || "",
    record.tapCount || "",
    record.status,
    record.userAgent || "",
    record.note || ""
  ]);
}

function responseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
