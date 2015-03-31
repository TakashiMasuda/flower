/**
 * ダイアログを作る関数をまとめたJSファイル。
 */

/**
 * 体験レッスンページのコンテンツ作成用JavaScript関数 + 汎用テキスト作成JavaScript関数ファイル。
 */


/* 
 * 関数名:createReservedData(reservedData)
 * 概要  :予約希望のデータを作成する。
 * 引数  :Object reservedData
 * 返却値  :Object
 * 作成者:T.M
 * 作成日:2015.02.11
 * 追加者 :T.Yamamoto
 * 追加日 :2015.03.09
 * 内容   :氏名、電話番号、メールアドレス、人数を追加
 */
function createReservedData(reservedData){
	
	// reservedDataに選択作品のデータを格納する。
	reservedData['construct'] = $('input[name="construct"]:checked').val();
	// reservedDataに選択した時限のデータを格納する。
	reservedData['schedule'] = getCheckBoxValue('schedule');
	// 選択した予備日程の曜日を配列で取得してreservedDataに格納する。
	reservedData['weekDay'] = getCheckBoxValue('dayOfWeek');
	// 選択した予備日程の週を配列で取得してreservedDataに格納する。
	reservedData['weekNumber'] = getCheckBoxValue('week');
	// 入力された氏名を取得する
	reservedData['personName'] = $('input[name="personName"]').val();
	// 入力された電話番号を取得する
	reservedData['personPhoneNumber'] = $('input[name="personPhoneNumber"]').val();
	// 入力されたメールアドレスを取得する
	reservedData['personEmail'] = $('input[name="personEmail"]').val();
	// 入力された人数を取得する
	reservedData['personCount'] = $('input[name="personCount"]').val();
	

	// reservedDataを返す。
	return reservedData;
}

/* 
 * 関数名:disableInputs(dialog)
 * 概要  :対象のダイアログの入力要素を一時無効にする。
 * 引数  :jQuery dialog
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function disableInputs(dialog){
	// dialogのinputタグ、buttonタグにdisabled属性を追加して一時無効化する。
	$('input,button', dialog).attr('disabled', 'disabled');
}

/* 
 * 関数名:getCheckBoxValue(className)
 * 概要  :チェックボックスの値を配列で取得する。
 * 引数  :String className
 * 返却値  :Array
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function getCheckBoxValue(className){
	// 返却する値を格納する配列を用意する。
	var checkBoxies = [];
	var tmp = $('input[name="'+ className +'"]:checked');
	// チェックが入ったチェックボックスを走査する。
	$('input[name="'+ className +'"]:checked').each(function(i){
		// 該当するチェックボックスから値を取得してcheckBoxiesに格納する。
		checkBoxies[i] = $(this).val();
	});
	
	// checkBoxiesを返す。
	return checkBoxies;
}

/* 
 * 関数名:removeInputDialog(dialog, reservedData)
 * 概要  :入力ダイアログを消す。
 * 引数  :jQuery dialog, Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function removeInputDialog(dialog, reservedData){
	// ダイアログを完全に消去する。
	dialog.dialog("close").dialog("destroy").remove();
	// reservedDataにnullを格納して空扱いにする。
	reservedData = null;
}

/* 
 * 関数名:createSpecialReservedDialog(json, array)
 * 概要  :特別レッスン予約用ダイアログを生成する。
 * 引数  :Object json, Array array
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 */
function createSpecialReservedDialog(json, array){
	
	// ダイアログのデータを格納する連想配列を宣言し、引数の配列に格納されたコンテンツ名と予約希望日時を格納する。
	reservedData = {'year': array[0], 'month': array[1], 'day': array[2]};

	//ダイアログを呼ぶ下準備としてjsonとテンプレートのdomを取得する。
	creator.getJsonFile('source/experience.json');
	creator.getDomFile('source/template.html');
	
	// ダイアログの本体となるdivタグを生成する。
	creator.outputTag('specialReservedDialog');

	// ダイアログに日付欄を追加する。
	createSpecialDate(reservedData['year'], reservedData['month'], reservedData['day']);

	// 生成したdivタグをjQuery UIのダイアログにする。
	$('.specialReservedDialog').dialog({
		// 幅を設定する。
		width			: '300px',
		// 予約ダイアログのクラスを追加する。
		dialogClass		:'reservedDialog',
		// ダイアログを生成と同時に開く。
		autoOpen		: true,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		// モーダルダイアログとして生成する。
		modal			: true,
		// リサイズしない。
		resizable		: false, 
		// 作成完了時のコールバック関数。
		create:function(event, ui){
			// タイトルバーを見えなくする。
			$(this).prev().children().filter('.ui-dialog-titlebar-close').remove();
			$(this).next().css('font-size', '0.5em');
		},
		// ダイアログが閉じられる前のイベント
		beforeClose:function(event, ui){
		},
		// 位置を指定する。
		position:{
			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
			my:'center center',
			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
			at:'center center',
			// ウィンドウをダイアログを配置する位置の基準に指定する。
			of:window
		},
		// ボタンの生成と設定を行う。
		buttons:[
			         {
			        	 // OKボタンのテキスト。
			        	 text:'OK',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // 必須入力項目が皆入力済みであれば
			        		 if($('input[name="construct"]:checked' ,this).length > 0 
			        				 && $('input[name="schedule"]:checked' ,this).length > 0
			        		 		 && ($('input[name="personName"]').val().length > 0)
									 && ($('input[name="personPhoneNumber"]').val().length > 0)
									 && ($('input[name="personEmail"]').val().length > 0)
									 && ($('input[name="personCount"]').val().length > 0)
			        		 ) {
				        		 // 予約希望データを作成する。
			        			 reservedData = createReservedData(reservedData);
				        		 
				        		 // 入力確認ダイアログを呼び出す。
				        		 createSpecialReservedConfirmDialog(reservedData);
				        		 // このダイアログの入力要素を一時的に無効化する。
				        		 disableInputs($(this));
			        		 } else {
			        			 alert('未入力の項目があります。');
			        		 }
			        	 }
			         },
			         {
			        	 // キャンセルボタンのテキスト。
			        	 text:'Cancel',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // ダイアログと、入力された予約データを消去する。
			        		 removeInputDialog($(this), reservedData);
			        	 }
			         }
		         ]
	});
}

/* 
 * 関数名:createSpecialDate(year, month, day)
 * 概要  :予約希望日時のパーツを追加する。
 * 引数  :int year, int month, int day
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 */
function createSpecialDate(year, month, day){
	// 曜日の配列を宣言、初期化する。
	var weekChars = [ '日', '月', '火', '水', '木', '金', '土' ];
	// 予約希望ダイアログに予約希望日時が書かれたタグを追加する。
			// 年月日と曜日のテキストデータを流し込む。月は日付型で0〜11で表現されているので、-1する。
			$('.specialReservedDialog').attr('title', year + '年' + month + '月' + day + '日' 
					+ '(' + weekChars[new Date(year, month - 1, day).getDay()] + '曜日)')
}

/* 
 * 関数名:sendReservedData(reservedData)
 * 概要  :サーバに予約希望データを送信する。
 * 引数  :Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function sendReservedData(reservedData){
	// サーバにデータを送信し、その結果の文字列をisSuccessに格納する。
	var isSuccess = sendData(reservedData);
	// データの送信に成功したら
	if(isSuccess){
		// 帰ってきたメッセージをダイアログで表示する。
		alert(isSuccess);
		// ダイアログを消す。
		removeReservedDialogs($('.reservedDialog .ui-dialog-content'));
	} else {
		// 時間を空けてもう一度実行してもらうようメッセージのダイアログを出す。
		alert("通信に失敗しました。時間をあけてもう一度お試しください。");
	}
}

/* 
 * 関数名:sendData(reservedData)
 * 概要  :サーバに予約希望データを送信する。
 * 引数  :Object reservedData
 * 返却値  :Object or int
 * 作成者:T.M
 * 作成日:2015.02.11
 */
function sendData(reservedData){
	// 返却値を格納する変数returnsを宣言、0で初期化する。
	var returns = 0;
	// ajax通信で予約データをサーバに送信する。
	$.ajax({
		// 予約データ保存用のPHPにデータを送信する。2015.02.19現在該当PHPが無いため自身のURLに送信しています。
		url: location.href,
//		url: init["sendReservedPhp"],
		// テキストデータを返してもらう。
		dataType: 'text',
		// 非同期通信にしない。
		async: false,
		// 予約データを添付する。
		data: {"reserved":reservedData},
		// 通信成功時の処理。
		success:function(text){
			// returnsに帰ってきたテキストを代入する。2015.03.06現在ではテスト用のテキストを返す。
			//returns = text;
			returns = "ご予約希望を承りました。追ってメールでの返信をいたします。";
		}
	});
	
	// returnsを返す。
	return returns;
}

/* 
 * 関数名:moveToPrevDialog(current)
 * 概要  :直前のダイアログに戻る。
 * 引数  :jQuery current
 * 返却値 :なし
 * 作成者:T.M
 * 作成日:2015.02.12
 */
function moveToPrevDialog(current){
	//1つ前のダイアログを取得する。
	var $prevDialog = $('.ui-dialog-content').eq(current.index('.ui-dialog-content') - 1);
	// currentの前のダイアログの入力要素を有効にする。
	$('input' ,$prevDialog).removeAttr('disabled');
	// ダイアログを消去する。
	current.dialog('close').dialog('destroy').remove();
}

/* 
 * 関数名:removeReservedDialogs(dialogs)
 * 概要  :引数の配列にセットされたダイアログを消す。
 * 引数  :array dialogs
 * 返却値 :なし
 * 作成者:T.M
 * 作成日:2015.02.12
 */
function removeReservedDialogs(dialogs){
	// 引数のダイアログの配列を走査する。
	dialogs.each(function(){
		// ダイアログを消去する。
		$(this).dialog('close').dialog('destroy').remove();
	});
}

/* 
 * 関数名:createSpecialReservedConfirmDialog(reservedData)
 * 概要  :入力内容を表示して送信を確定するダイアログを表示する。
 * 引数  :Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 */
function createSpecialReservedConfirmDialog(reservedData){
	// ダイアログの本体となるdivタグを生成する。
	creator.outputTag('specialReservedConfirmDialog');
	
	// 入力された予約内容を一覧表示する。
	createSpecialConfirmSummary(reservedData);
	
	// 生成したdivタグをjQuery UIのダイアログにする。
	$('.specialReservedConfirmDialog').dialog({
		// 幅を設定する。
		width			: '300px',
		// 予約ダイアログのクラスを追加する。
		dialogClass		:'reservedDialog',
		// ダイアログを生成と同時に開く。
		autoOpen		: true,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		// モーダルダイアログとして生成する。
		modal			: true,
		// リサイズしない。
		resizable		: false, 
		// 作成完了時のコールバック関数。
		create:function(event, ui){
			// タイトルバーを見えなくする。
			$(this).prev().children().filter('button').css('display', 'none');
			$(this).next().css('font-size', '0.5em');
		},
		// ダイアログが閉じられる前のイベント
		beforeClose:function(event, ui){
			// ロストした分のダイアログのDOMを補填する。
			creator.getDomFile('source/template.html');		// ファイルのhtmlデータをdomを用いて持ってくる
		},
		// 位置を指定する。
		position:{
			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
			my:'center center',
			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
			at:'center center',
			// ウィンドウをダイアログを配置する位置の基準に指定する。
			of:window
		},
		// ボタンの生成と設定を行う。
		buttons:[
			         {
			        	 // OKボタンのテキスト。
			        	 text:'OK',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // サーバに予約希望データを送信する。
			        		 sendReservedData(reservedData);
			        		 
			        	 }
			         },
			         {
			        	 // キャンセルボタンのテキスト。
			        	 text:'Cancel',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // 前のダイアログに戻る。
			        		 moveToPrevDialog($(this));
			        		 }
			        	 }
			         
		         ]
	});
}

/* 
 * 関数名:createSpecialConfirmSummary(reservedData)
 * 概要  :予約データを予約内容確認ダイアログに書き出す。
 * 引数  :Object reservedData
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 * 追加者 :T.Yamamoto
 * 追加日 :2015.03.10
 * 内容   :389行目のtextメソッドをhtmlメソッドに変更しました
 */
function createSpecialConfirmSummary(reservedData){
	// 予約希望日時を書き出す。
	$('.dateValue').text(reservedData['year'] + '年' + reservedData['month'] + '月' + reservedData['day'] + '日')
	// 希望作品を書き出す。
	$('.constructValue').text(reservedData['construct']);
	// 希望の時限を書き出す。
	$('.scheduleValue').html(reservedData['schedule']);
	// 予備の希望曜日を書き出す。
	$('.subWeekOfDayValue').text(reservedData['weekDay']);
	// 予備の希望週を書き出す。
	$('.subWeekValue').text(reservedData['weekNumber']);
	// 個人情報の氏名を書き出す。
	$('.subPersonNameValue').text(reservedData['personName']);
	// 個人情報の電話番号を書き出す。
	$('.subPersonPhoneNumberValue').text(reservedData['personPhoneNumber']);
	// 個人情報のメールアドレスを書き出す。
	$('.subPersonEmailValue').text(reservedData['personEmail']);
	// 個人情報の人数を書き出す。
	$('.subPersonCountValue').text(reservedData['personCount']);
}

/* 
 * 関数名:getInitData(path, continues)
 * 概要  :初期化用データの連想配列を取得して返す。
 * 引数  :String path, int continues
 * 返却値  :Object
 * 作成者:T.M
 * 作成日:2015.02.12
 */
function getInitData(path, continues){
	// 返却値を格納する変数を宣言、0で初期化する。
	var returns = 0;
	// for文で規定回数通信するか、通信成功するまで通信を繰り返す。
	for (var i = 0; i < continues && returns == 0; i++){
		// Ajax通信を行いファイルを取得する。
		returns = getJSONFile(path);
	}
	
	// ファイルが取得できていなかったら
	if(!(returns)){
		alert('初期化ファイルの取得に失敗しました。');
	}
	
	// 取得したデータを返す。
	return returns;
}

/* 
 * 関数名:getJSONFile(path)
 * 概要  :JSONファイルを取得して返す。
 * 引数  :String path
 * 返却値  :Object or int
 * 作成者:T.M
 * 作成日:2015.02.12
 */
function getJSONFile(path){
	// 返却値を格納する変数を宣言、0で初期化する。
	var returns = 0;

	// ajax通信で予約データをサーバに送信する。
	$.ajax({
		// pathのファイルを取得する。
		url: path,
		// テキストデータを返してもらう。
		dataType: 'JSON',
		// 同期通信を行う。
		async: false,
		// 通信成功時の処理。
		success:function(json){
			// returnsに取得したJSONデータを格納する。
			returns = json;
		}
	});
	
	// returnsを返す。
	return returns;
}

/* 
 * 関数名:createLoginDialog()
 * 概要  :ログインダイアログを生成する。
 * 引数  :なし
 * 返却値 :なし
 * 作成者:T.M
 * 作成日:2015.02.18
 * 変更者:T.M
 * 変更日:2015.03.30
 * 内容　:サーバサイドの処理に合わせてOKボタンのコールバック関数を書き直しました。
 */
function createLoginDialog(){
	creator.getJsonFile('source/login.json');	// ファイルのデータをjsonを用いて持ってくる
	creator.getDomFile('source/template.html');		// ファイルのhtmlデータをdomを用いて持ってくる

	//ダイアログのタグを作る。
	creator.outputTag('loginDialog');
	
	// 生成したdivタグをjQuery UIのダイアログにする。
 	$('.loginDialog').dialog({
		// 幅を設定する。
		width			: '300',
		// 幅を設定する。
		title			: 'ログイン',
		// ダイアログを生成と同時に開く。
		autoOpen		: true,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		// モーダルダイアログとして生成する。
		modal			: true,
		// リサイズしない。
		resizable		: false, 
		// 作成完了時のコールバック関数。
		create:function(event, ui){
			//文字サイズを小さめにする。
			$(this).next().css('font-size', '0.5em');
		},
		// 位置を指定する。
		position:{
			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
			my:'center center',
			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
			at:'center center',
			// ウィンドウをダイアログを配置する位置の基準に指定する。
			of:window
		},
		// ボタンの生成と設定を行う。
		buttons:[
		         {
			     	// OKボタンのテキスト。
			        text:'ログイン',
			        // ボタン押下時の処理を記述する。
			        click:function(event, ui){
			        		 
			        	 var userid = $('input.userName' ,this).val()	//入力されたユーザIDと	
			        	 var password = $('input.password' ,this).val()	//パスワードを取得して変数に格納する。
			        	 
			        	 // 必須入力項目が皆入力済みであれば
			        	 if(userid != '' && password != ''){
			        		 
			        		 //通信の返却値を格納する変数を宣言する。
			        		 var transResult = {"result":false};
			        		 // ajax通信を行いサーバにユーザ情報を送る。
			        		 $.ajax({
			        			 //ログイン認証のPHPにデータを送信する。
			        			url:init["loginServlet"],
//			        			url:location.href,
			        			//ユーザ名とパスワードをPHPに送信する。
			        			data:{'userid':userid,
			        				'password':password},
			        			//JSONで結果を返してもらう。
			        			dataType:'JSON',
//			        			dataType:'HTML',
			        			//同期通信を行う。
			        			async:false,
			        			//通信成功時の処理
			        			success:function(json){
			        				// 通信結果のデータをtransResultに格納する。
//			        				transResult = {"result":"true","user":"testuser","userName":"user"};
			        				transResult = json;
			        			},
			        			//通信失敗時の処理
			        			error:function(){
			        				//エラーログを出す。
			        				console.log(errorMessages[0]);
			        				//通信結果をnullにする。
			        				transResult = null;
			        			}
			       			 });
			        		 
		        			// 通信が成功していたら
		        			 if(transResult!=null){
			        			// ユーザ情報の取得に成功していたら
			        			 if('issuccess' in transResult && parseInt(transResult['issuccess'])){
			        				 //@mod T.Masuda 2015.03.27 Cookieを期限付きにしました。
			        				 //日付クラスインスタンスを生成する。
			        				 var cookieLimit = new Date();
			        				 //現在の日付にクッキーの生存時間を加算し、cookieLimitに追加する。
			        				 cookieLimit.setTime(cookieLimit.getTime() + parseInt(init['cookieLimitTime']));
			        				 //cookieにユーザIDと期限の日付を格納する。日本語の文字化けを防ぐため、escape関数にかけた上で格納する。
			        				 document.cookie = 'user=' + userid + ';expires=' + cookieLimit.toGMTString();
			        				 //同様にユーザ名もクッキーに格納する。日本語の文字化け防止のため、ユーザ名の文字列をescape関数にかける。
			        				 document.cookie = 'userName=' + escape(transResult["username"]) + ';expires=' + cookieLimit.toGMTString();
			        				 //ここまで変更しました。
			        				 // ダイアログを消去する。
						       		 $(this).dialog('close').dialog('destroy').remove();
						       		 //画面を更新する。
						       		 location.reload();
			        			 } else {
			        				 // 認証失敗のメッセージを出す。
			        				 alert(errorMessages[1]);
			        			 }
			        		//通信に失敗していたら。 
			       			 } else {
			       			//通信エラーのメッセージを出す。
		        			alert(errorMessages[2]);
			       			}
			       		//空欄に入力するようにメッセージを出す。
			       		 } else {
			       			 alert(errorMessages[3]);
		        		 }
		        	 }
		         },
		         {
			        	 // キャンセルボタンのテキスト。
			        	 text:'Cancel',
			        	 // ボタン押下時の処理を記述する。
			        	 click:function(event, ui){
			        		 // ダイアログを消去する。
			        		 $(this).dialog('close').dialog('destroy').remove();
			        	 }
			         }
		         ]
	});
}

/* 
 * 関数名:checkLogin()
 * 概要  :ログイン状態をチェックする。
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.02.18
 * 修正者:T.M
 * 修正日:2015.03.10
 * 変更　:ユーザー名が複数表示されてしまうバグへ対応しました。
 */
function checkLogin(){
	// ログインしているか否かの結果を返すための変数を用意する。
	var result = false;
	// クッキーを連想配列で取得する。
	var cookies = GetCookies();
	//ログイン中であれば
	if('user' in cookies && cookies['user'] != ""){
		// ログインボタンをログアウトボタンに差し替える。
		$('.login').removeClass('login')
					.addClass('logout')
					.attr('src', 'image/icon(logout22-50).png');
		//ログアウトボタンの下にユーザ名を表示する。
		$('.logout')
					// spanタグを追加する。
					.after($('<span></span>')
							// ユーザ名のクラスを設定する。
							.addClass('userName')
							//cookieからユーザ名を取り出し表示する。
							.text(cookies['userName'] + '様')
							)
					// spanタグを追加する。
					.after($('<span></span>')
							// ユーザ名のクラスを設定する。
							.addClass('welcome')
							//cookieからユーザ名を取り出し表示する。
							.text('ようこそ')
							)
					;
		// ログアウトのイベントを定義する。
		$(document).on('click', '.logout', function(){
			// ユーザのクッキーを削除してログアウトする。
			deleteCookie('user');
			deleteCookie('userName');
			//画面を更新する。
   		 	location.reload();
		});
		
		// ログインしている状態であるという結果を変数に格納する。
		result = true;
	}
	
	// ログイン状態を返す。
	return result;
}

/* 
 * 関数名:function checkLoginState()
 * 概要  :ログイン状態をチェックする。
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2015.02.20
 */
function checkLoginState(){
	// ログイン状態をチェックする。
	if(!(checkLogin())){
		//ログインボタンのイベントを設定する。
		$('.login').on('click', function(){
			// ログインダイアログを呼び出す。
			createLoginDialog();
		});
	}
}


//クッキーの削除。http://javascript.eweb-design.com/1404_dc.htmlより。
function deleteCookie(cookieName) {
  cName = cookieName + "="; 			// 削除するクッキー名
  dTime = new Date();					//クッキーを削除するために日付クラスを取得。
  dTime.setYear(dTime.getYear() - 1);	//去年の日付をセットする。
  //クッキーの有効期限に過去の日付を指定することで、該当するクッキーを削除する。
  document.cookie = cName + ";expires=" + dTime.toGMTString();
}

/* クッキーを連想配列で取得する関数。http://so-zou.jp/web-app/tech/programming/javascript/cookie/#no5より。 */
function GetCookies()
{
    var result = new Array();

    var allcookies = unescape(document.cookie);
    if( allcookies != '' )
    {
        var cookies = allcookies.split( '; ' );

        for( var i = 0; i < cookies.length; i++ )
        {
            var cookie = cookies[ i ].split( '=' );

            // クッキーの名前をキーとして 配列に追加する
            result[ cookie[ 0 ] ] = decodeURIComponent( cookie[ 1 ] );
        }
    }
    //結果を返す。
    return result;
}
//エラーメッセージの配列。
var errorMessages = [
'failed to connect',
'ユーザ認証に失敗しました。ユーザ名、またはパスワードを確認してください。',
'サーバとの通信に失敗しました。時間を置いて再度お試しください。',
'ユーザ名、パスワード、または両方が空欄になっています。'
];

// 初期化用関数をコールして初期化用データの連想配列を用意する。
var init = getInitData("source/init.json", 100);

/* 
 * 関数名:showEditDialog(editElem)
 * 概要  :テキストを編集するダイアログを表示する。
 * 引数  :Element editElem:編集対象となる要素。
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.03.18
 */
function showEditDialog(editElem){
	
//	//jQuery UIのダイアログを生成する。
//	$('.textEditDialog').dialog({
//		// 幅を設定する。
//		width			: '300px',
//		// 予約ダイアログのクラスを追加する。
//		dialogClass		:'reservedDialog',
//		// ダイアログを生成と同時に開く。
//		autoOpen		: true,
//		// Escキーを押してもダイアログが閉じないようにする。
//		closeOnEscape	: false,
//		// モーダルダイアログとして生成する。
//		modal			: true,
//		// リサイズしない。
//		resizable		: false, 
//		// 作成完了時のコールバック関数。
//		create:function(event, ui){
//			//ダイアログのテキストエリアのjQueryオブジェクトを生成する。
//			var textarea = $('textarea', this);
//			//テキストエリアに連動元の入力要素の内容をコピーする。
//			textarea.val($(editElem).val());
//			//テキストエリアと入力要素の内容が連動するようにイベント登録する。
//			textarea.change(function(){
//				//editElemの値をtextareaの値で上書きする。
//				editElem.val(textarea.val());
//			});
//		},
//		// 位置を指定する。
//		position:{
//			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
//			my:'center center',
//			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
//			at:'center center',
//			// ウィンドウをダイアログを配置する位置の基準に指定する。
//			of:window
//		},
//		// ボタンの生成と設定を行う。
//		buttons:[
//			         {
//			        	 // 終了ボタンのテキスト。
//			        	 text:'終了',
//			        	 // ボタン押下時の処理を記述する。
//			        	 click:function(event, ui){
//			        		// ダイアログを完全に消去する。
//			        		$(this).dialog("close").dialog("destroy").remove();
//			        	 }
//			         }
//		         ]
//	});
}

/* 
 * 関数名:useEditDialog(selector)
 * 概要  :指定した要素をクリックしたらテキスト編集用のダイアログを出すイベントを登録する。
 * 引数  :string selector:編集対象となる要素のセレクタ。
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.03.18
 */
function useEditDialog(selector){
	
	//createTagでダイアログのタグを作る。
	creator.outputTag('textEditPopup','textEditPopup','body');
	//ダイアログのテキストエリアのjQueryオブジェクトを生成する。
	var textarea;
	
	//タグに呼び出すダイアログを指定する属性を追加する。
	$(selector).attr('data-smallipop-referenced-content', '#textEditPopupBody').attr('title', 'Referenced content');
	
	//smallipopによるポップアップを生成する。
    $(selector).smallipop({
    	hideOnPopupClick:false,		//ポップアップをクリックしても消えないようにする。
    	triggerOnClick:true,		//対象をクリックすることでポップアップが出るようにする。
    	windowPadding:0,			//ウィンドウに対する最低限のpaddinをなくす。
    	onAfterShow:function(from){	//ポップアップ表示前の処理。
    		//ポップアップのテキストエリアのjQueryオブジェクトを取得する。
    		textarea = $('.textEditPopupBody textarea', document).eq(1);
    		//ポップアップの呼び出し元のテキストエリアの内容をコピーする。
			textarea.val($(from).val());
			//2つのテキストエリアの内容が連動するようにイベント登録する。
			textarea.on('change', function(){
				//呼び出し元のテキストエリアの値をポップアップのテキストエリアの値で上書きする。
				from.val(textarea.val());
			});    		
    	},
    	onAfterHide:function(){		//ポップアップが消えた後の処理。
    		textarea.off('change');	//テキストエリアのイベントを解除する。
    	}
    });
}