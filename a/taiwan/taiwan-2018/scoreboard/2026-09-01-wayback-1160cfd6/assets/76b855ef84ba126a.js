/*------ 讀取xml ------*/
$.ajax({
	url: 'htmlReadXml/HeadFooter.xml',				//xml讀取檔案路徑
	type: 'GET',        							//擷取方式
	dataType: 'xml',    							//資料型態可以不設定，且此型態不可是text或html
	timeout: 1000,      							//timeout時間
	error: function (xhr, status, error) {
		//alert(xhr.responseText);					//顯示詳細錯誤訊息
		alert('讀取資料錯誤，請重新整理頁面!');						//顯示自定錯誤訊息
	},
	success: function (xml) {				

		$(xml).find("data").each(function (i) {  	//取得xml父節點     
			//xml的總筆數
			var total = $(xml).find("data").length;						
			//取得子節點中的header
			var header = $(this).children("header").text();
			//取得子節點中的footer
			var footer = $(this).children("footer").text();                    
			
			
			//將產生後的li塞入div[class = previousFocus]物件下的ul
			$('#Mheader').append(header);
			//將產生後的li塞入div[class = previousFocus]物件下的ul
			$('#Mfooter').append(footer);
		});
	}
});	
/*------ 結束讀取xml ------*/

