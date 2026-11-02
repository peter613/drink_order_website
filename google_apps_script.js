/**
 * Google Apps Script 飲料訂單處理程式
 * 試算表網址：https://docs.google.com/spreadsheets/d/1m0ykuSQNeCm08oBL8FxlDivDP5-AERAap1DSwuS-XTs/edit
 * 
 * 【使用說明】：
 * 1. 打開上述 Google 試算表。
 * 2. 點選頂部選單「擴充功能」->「Apps Script」。
 * 3. 刪除原有所有代碼，將此檔案全部內容複製貼上。
 * 4. 點擊右上角「部署」->「新增部署作業」。
 * 5. 齒輪圖示選擇「網頁應用程式 (Web App)」。
 *    - 說明：飲料訂單 API
 *    - 執行身分：我 (您的 Google 帳號)
 *    - 存取權限：所有人 (Anyone)  <--- 非常重要！請務必選「所有人」
 * 6. 點擊「部署」，授權存取（若出現警告，點進階 -> 前往專案授權）。
 * 7. 複製產生的「網頁應用程式網址 (Web App URL)」，貼回訂購網站的設定中即可！
 */

function doPost(e) {
  // 使用 LockService 防止多人同時下單時產生重複流水號或寫入衝突
  var lock = LockService.getScriptLock();
  var lockSuccess = lock.tryLock(15000); // 最多等待 15 秒
  
  if (!lockSuccess) {
    return createJsonResponse({
      status: "error",
      message: "系統忙碌中，請稍後再試！"
    });
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // 1. 若試算表為空白，自動建立標題列與美化格式
    if (sheet.getLastRow() === 0) {
      var headers = ["流水號", "訂購時間", "姓名", "電話", "個人訂購內容", "合計金額", "訂單備註"];
      sheet.appendRow(headers);
      
      // 設定標題列樣式
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#2d6a4f");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      
      // 設定欄寬
      sheet.setColumnWidth(1, 150); // 流水號
      sheet.setColumnWidth(2, 170); // 訂購時間
      sheet.setColumnWidth(3, 100); // 姓名
      sheet.setColumnWidth(4, 130); // 電話
      sheet.setColumnWidth(5, 380); // 個人訂購內容
      sheet.setColumnWidth(6, 100); // 合計金額
      sheet.setColumnWidth(7, 200); // 訂單備註
    }

    // 2. 解析前端傳來的資料 (支援 JSON 或 URL-encoded)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var name = data.name || "未填寫";
    var phone = data.phone || "未填寫";
    var note = data.note || "無";
    var totalPrice = Number(data.totalPrice) || 0;
    var itemsSummary = data.itemsSummary || "";

    // 如果沒有傳入 itemsSummary，但有傳入 items 陣列，則自動組合格式
    if (!itemsSummary && Array.isArray(data.items)) {
      itemsSummary = data.items.map(function(item, idx) {
        var toppingsStr = (item.toppings && item.toppings.length > 0) ? " + " + item.toppings.join("、") : "無加料";
        return (idx + 1) + ". " + item.name + "(" + item.size + ") / " + 
               item.sugar + " / " + item.ice + " / " + toppingsStr + 
               " | $" + item.unitPrice + " x " + item.quantity + "杯 = $" + (item.unitPrice * item.quantity);
      }).join("\n");
    }

    // 3. 產生唯一的流水號 (主鍵)
    // 格式：ORD-西元年日時-4位序號，例如 ORD-20261102-0001
    var now = new Date();
    var timeZone = "GMT+8";
    var datePrefix = Utilities.formatDate(now, timeZone, "yyyyMMdd");
    var timestamp = Utilities.formatDate(now, timeZone, "yyyy/MM/dd HH:mm:ss");

    var lastRow = sheet.getLastRow();
    var orderCount = lastRow; // 扣除標題行，目前是第幾筆訂單
    var paddedNumber = ("0000" + orderCount).slice(-4);
    var orderId = "ORD-" + datePrefix + "-" + paddedNumber;

    // 4. 將訂單資料寫入試算表
    var newRow = [
      orderId,       // 流水號 (主鍵)
      timestamp,     // 訂購時間
      name,          // 姓名
      "'" + phone,   // 電話 (加上單引號防止開頭 0 被 Excel/Sheets 省略)
      itemsSummary,  // 個人訂購內容
      totalPrice,    // 合計金額
      note           // 訂單備註
    ];

    sheet.appendRow(newRow);

    // 設定金額欄位格式為貨幣，訂單內容為自動換行
    var currentRowIndex = sheet.getLastRow();
    sheet.getRange(currentRowIndex, 5).setWrap(true);
    sheet.getRange(currentRowIndex, 6).setNumberFormat("$#,##0");
    sheet.getRange(currentRowIndex, 1, 1, 4).setHorizontalAlignment("center");
    sheet.getRange(currentRowIndex, 6).setHorizontalAlignment("right");

    // 5. 回傳成功 JSON 回應
    return createJsonResponse({
      status: "success",
      orderId: orderId,
      timestamp: timestamp,
      customer: name,
      phone: phone,
      totalPrice: totalPrice,
      message: "訂單已成功送達試算表！"
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "寫入試算表失敗：" + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

// 支援 GET 請求，方便使用者直接在瀏覽器打開網址測試是否部署成功
function doGet(e) {
  return createJsonResponse({
    status: "online",
    message: "Google Apps Script 飲料訂購系統後端服務運作正常！請使用 POST 方法送出訂單。"
  });
}

// 輔助函式：建立 JSON 輸出格式
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
