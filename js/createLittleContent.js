/**
 * 小規模のパーツ、コンテンツを作るためのJSファイル。
 */

//Datepickerの日本語用設定。
var dpJpSetting = {
		closeText: '閉じる',
		prevText: '&#x3c;前',
		nextText: '次&#x3e;',
		currentText: '本日',
		monthNames: ['1月','2月','3月','4月','5月','6月',
		             '7月','8月','9月','10月','11月','12月'],
		             monthNamesShort: ['1月','2月','3月','4月','5月','6月',
		                               '7月','8月','9月','10月','11月','12月'],
		                               dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
		                               // dayNamesShort: ['日','月','火','水','木','金','土'],
		                               // dayNamesMin: ['日','月','火','水','木','金','土'],
		                               weekHeader: '週',
		                               dateFormat: 'yy/mm/dd',
		                               firstDay: 0,
		                               isRTL: false,
		                               showMonthAfterYear: true,
		                               yearSuffix: '年'};

/*
 * 関数名:createCalendar(selector)
 * 引数  :string selector:カレンダーにするタグのセレクタ
 * 戻り値:なし
 * 概要  :カレンダーを作る
 * 作成日:2015.02.06
 * 作成者:T.Y
 * 変更者:2015.02.10
 * 作成者:T.M
 * 概要  :カレンダーをクリックした時のコールバック関数を追加しました。
 * 変更者:2015.02.21
 * 作成者:T.M
 * 概要  :カレンダーのタグを作る記述を削除しました。
 */
function createCalendar (selector) {
  // jqueryの記述の始まり
    $(function() {
        $.datepicker.regional['ja'] = dpJpSetting;
		$.datepicker.setDefaults($.datepicker.regional['ja']);

        $(selector).datepicker();
        // ここまで追加・修正しました。
    });// jqueryの記述の終わり
}

/*
 * 関数名:createReservedCalendar(selector)
 * 引数  :string selector:カレンダーにするタグのセレクタ
 * 戻り値:なし
 * 概要  :予約のカレンダーを作る。
 * 作成日:2015.03.18
 * 作成者:T.Masuda
 */
function createReservedCalendar (selector) {
	// jqueryの記述の始まり
	$(function() {
		$.datepicker.regional['ja'] = dpJpSetting;
		$.datepicker.setDefaults($.datepicker.regional['ja']);
		
		$(selector).datepicker({
			// カレンダーの日付を選択したら
			onSelect: function(dateText, inst){
				// 予約のダイアログを出す。
				callReservedDialog(dateText);
			}
		});
		// ここまで追加・修正しました。
	});// jqueryの記述の終わり
}

/*
 * 関数名:setCallCalendar(selector)
 * 引数  :string selector:カレンダーと関連づける要素のセレクタ。
 * 戻り値:なし
 * 概要  :指定した要素をクリックしてカレンダーを呼ぶようにする。
 * 作成日:2015.03.26
 * 作成者:T.Y
 */
function setCallCalendar (selector) {
		//datepickerの日本語表示設定。
        $.datepicker.regional['ja'] = dpJpSetting;
		$.datepicker.setDefaults($.datepicker.regional['ja']);

        $(selector).datepicker();
}


/*
 * 関数名:toolTip
 * 引数  :var targetElement
 * 戻り値:なし
 * 概要  :引数の要素に対してツールチップを表示する
 * 作成日:2015.02.06
 * 作成者:T.Y
 * 変更日:2015.03.10
 * 変更者:T.Masuda
 * 内容　:,を余計に書いてあった部分とコメント抜けを修正しました。
 */
function toolTip() {
  $(function() {
    //　要素を追加する処理
    $('body').append('<div class="tip"></div>');

    $('.tip')                         // 表示するツールチップに関するcssを有効にする
      .css({                          // jqueryでcssを記述する宣言をする
          border: '1px solid Black',  // 枠線を1pxで黒色、実線で描く
          backgroundColor: '#ffc',    // 背景を黄色っぽくする
          fontSize: 'smaller',        // ツールチップ内での文字のサイズは小さめにする
          padding: '2px',             // 2px分要素全体の幅を広くとる
          position: 'absolute',       // ポジションを絶対位置にする
          display: 'none'             // 画面には表示しない

      })
    //ツールチップを表示する処理
    $('.tiplink')
      //マウスオーバしたときの処理
      .mouseenter(function(e) {
      //.tipがアニメーション中でない場合のみ処理をする
        $('.tip:not(:animated)')
        //data-tips属性から本体テキストを設定
          .text($(this).data('tips'))
        //マウスの座標に応じて表示位置を決定
          .css({
            top: e.pageY,	//現在マウスポインターがあるY座標
            left: e.pageX,	//現在マウスポインターがあるX座標
            zIndex: 2		//z-indexを指定して重なりを制御する。
          })
          .fadeIn(300);//300ミリ秒かけて表示する
      })
      //マウスオーバから離れたときの処理
      .mouseleave(function(e) {
      $('.tip')//tipの中身について
        .fadeOut(500);//500ミリ秒かけて表示しなくなる
      })

  });  
}

/*
 * 関数名:getContentName()
 * 引数  :なし
 * 戻り値:String
 * 概要  :URLから現在のファイル名を取り出し返す。
 * 作成日:2015.02.12
 * 作成者:T.M
 */
function getContentName(){
	// URLからファイル名を取得する。
	var contentName = location.href.substring(location.href.lastIndexOf("/")+1,location.href.length);
	// ファイル名から拡張子を取り除く。
	contentName = contentName.substring(0,contentName.indexOf('.'));
	// ファイル名に予約コンテンツであるということを示す文字列を追加する。
	contentName = contentName + 'Reserved';
	
	//contentNameを返す
	return contentName;
}

/*
 * 関数名:createDateArray(dateText)
 * 引数  :String dateText
 * 戻り値:なし
 * 概要  :日付文字列を配列にして返す。
 * 作成日:2015.02.12
 * 作成者:T.M
 */
function createDateArray(dateText){

	// 選択した日付を1つの文字列から配列に変換する。
	var date = dateText.split('/');
	//@mod 2015.02.19 T.M jQuery UIのバージョン変更により不要になりました。
	// 配列内の日付の並びが年月日になっていないので、並びを修正した配列を整数に直した上でtrueDateに格納する。
//	var trueDate = [parseInt(date[2]), parseInt(date[0]), parseInt(date[1])];

	//@mod 2015.02.19 T.M jQuery UIのバージョン変更により、trueDateではなくdateを返すことになりました。
	// trueDateを返す。
	return date;
	// trueDateを返す。
//	return trueDate;
}

/*
 * 関数名:callReservedDialog
 * 引数  :String dateText
 * 戻り値:なし
 * 概要  :ページに対応した予約ダイアログを生成する。
 * 作成日:2015.02.10
 * 作成者:T.M
 */
function callReservedDialog(dateText){
	// コンテンツ名を取得する。
	var contentName = getContentName();
	// 日付配列を取得する。
	var date = createDateArray(dateText)
	
	// コンテンツ名、レッスン予約のダイアログを生成する関数、日付の配列を引数にしてcreateText関数をコールする
	createSpecialReservedDialog(contentName, date);
}

/*
 * 関数名:useZoomImage(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :fancyboxによる画像の拡大表示を有効にする。
 * 作成日:2015.03.20
 * 作成者:T.M
 */
function useZoomImage(selector){
	// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
	// 拡大表示を行うようにする。
	$('.' + selector + ' a').fancybox({
		'hideOnContentClick': true
	});
}

/*
 * 関数名:createGallery(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :カルーセルのギャラリーを生成する。
 * 作成日:2015.02.21
 * 作成者:T.M
 * 変更日:2015.03.09
 * 変更者:T.M
 * 内容　:setTimeoutを利用してAjax通信でのページ読み込みに対応しました。
 */
function createGallery(selector){
	//一旦ギャラリーを隠す。
	$('.' + selector).hide();
	//時間をおいて関数を実行する。
	window.setTimeout(function(){
		//ギャラリーを見える様にする。
		$('.' + selector).show();
		
		//SmoothDivScrollの関数をコールしてギャラリーを作る。
		$('.' + selector).smoothDivScroll({
			//カーソル合わせでスクロールする領域を表示する。
			hotSpotScrolling: true,
			//タッチでのスクロールを有効にする。
			touchScrolling: true,
			manualContinuousScrolling: true,
			//マウスホイールによるスクロールを無効にする。
			mousewheelScrolling: false,
			visibleHotSpotBackgrounds:"always"
		});
		
		//fancyboxで画像を拡大できるようにする。
		useZoomImage(selector);
	//1秒置いて実行する。
	}, 1000);
}

/*
 * 関数名:createUnmovableGallery(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :不動のギャラリーを生成する。
 * 作成日:2015.02.21
 * 作成者:T.M
 */
function createUnmovableGallery(selector){
// jQueryプラグイン「Slick」によりカルーセルのギャラリーを作成する。
	$('.' + selector).slick({
        //以下2ステップ、矢印を使わない設定。
		accessibility:false,
        arrows:false,
        // レスポンシブレイアウトに対応する。
        responsive:true,
        //可変幅にする。
		variableWidth:true,
        // 用意されている画像の数だけ並べる。
        slidesToShow:$('.' + selector + ' img').length
	});
	
// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
// 拡大表示を行うようにする。
	$('.' + selector + ' a').fancybox({
		'hideOnContentClick': true
	}); 
}

/*
 * 関数名:allCheckbox
 * 引数  :var checkboxTarget, var allCheckTarget
 * 戻り値:なし
 * 概要  :クリックするとすべてのチェックボックスにチェックを入れる。
 * 作成日:2015.02.28
 * 作成者:T.Yamamoto
 */
function allCheckbox(checkboxTarget, allCheckTarget) {
	// jqueryの記述の始まり
 	$(function() {
 		// 第一引数の要素がクリックされたときの処理
		$('body').on('click', checkboxTarget, function() {
			// 第一引数のチェックボックスにチェックが入った時の処理
			if($(checkboxTarget + ':checked').val() == 'on') {
				// 第二引数のチェックボックスにチェックする
				$(allCheckTarget).prop('checked', true);
			// 第一引数のチェックボックスのチェックが外れた時の処理
			} else if ($(checkboxTarget + ':checked').val() == undefined) {
				// 第二引数のチェックボックスのチェックを外す
				$(allCheckTarget).prop('checked', false);
			};
		});
 	});
}

/*
 * 関数名:createTab(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :タブのコンテンツを作成する。
 * 作成日:2015.03.17
 * 作成者:T.Masuda
 */
function createTab(selector){
	//タブのコンテンツを作成する。
	$(selector).easytabs({
		updateHash:false,	//タブのインデックスをクリックしてもURLのハッシュが変わらないようにする。
		cache:false
	});
}

/*
 * イベント名:(document).bind('easytabs:ajax:complete')
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :Ajax通信でタブの内容を呼び出したときのイベント。
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
$(document).bind('easytabs:ajax:complete', function(event, $clicked, $targetPanel, response, status, xhr){
	//overwriteContent関数同様、scriptタグとlinkタグを取得する。
	var pagedrawer = $('script, link', response);
	//コードを順番に実行する。
	$.when(
		//読み込み先のタブパネル内に取得したタグを展開する。
		$($targetPanel).html(pagedrawer)
	).done(function(){
		//createTagのJSONを初期化する。
		creator.json = '';
	});
});


/*
 * 関数名:outputKeyNumberObject(json, domkey, target)
 * 概要  :整数値でナンバリングされた連想配列のキーを持つオブジェクトからパーツを作り追加する。
 * 引数  :Object json:走査対象のJSONの連想配列
 * 		 String domkey:DOMのキー
 * 		 String target:作成したDOMのappend先
 * 戻り値:なし
 * 作成日:2015.03.20
 * 作成者:T.Masuda
 */
function outputKeyNumberObject(json, domkey, target){
	//取得したJSONを走査する。
	for(key in json){
		//キーが数値なら
		if(!(isNaN(key))){
			//キーを一時保存して利用する。
			var keytmp = key;
			//パーツを生成し、指定先に追加する。
			creator.outputTag(keytmp, domkey, target);
			//追加したキーを削除する。
			delete json[keytmp];
		}
	}
	//trタグを追加したなら
	if($('.recordWrapper').length > 0){
		//trタグを取得する
		var records = $('.recordWrapper tr');
		//tableタグを外す
		unwrapTable('.'+records.attr('class'));
	}
}

/*
 * 関数名:unwrapTable(row)
 * 概要  :trタグの親となるtableタグを消す。createTagでtrタグを追加する場合に使用する。
 * 引数  :String row:trタグのセレクタ文字列
 * 戻り値:なし
 * 作成日:2015.03.25
 * 作成者:T.Masuda
 */
function unwrapTable(row){
	//trタグの親、祖父であるtbody、tableタグを消す。
	$(row).unwrap().unwrap();
}

/*
 * 関数名:injectionTableData(target, map)
 * 概要  :対象となるテーブルに配置された空のセルに連想配列の値を流し込む。
 * 引数  :String target:処理対象となるテーブル。
 * 		:Object map:流し込むデータを持つ連想配列。
 * 戻り値:なし
 * 作成日:2015.03.26
 * 作成者:T.Masuda
 */
function injectionTableData(target, map){
	//ループのカウンター変数を準備する。
	var counter = 0;
	//処理対象のテーブルのjQueryオブジェクトを取得する。
	var $table = $(target);
	
	//mapを操作する。
	for(key in map){
		//対応するセルにデータを流し込む。
		$('.' + key + ' td', $table).text(map[key]);
		//疑似フォームで値を受け取る準備がしてあれば、そちらにも値を流し込む。
		$('.imitateForm input:hidden').filter('[name="' + key + '"]').val(map[key]);
	}
}

/*
 * 関数名:createNewPhoto()
 * 概要  :作成したMyギャラリーの新規のし写真に基本データを追加する。
 * 引数  :なし
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function createNewPhoto(){
	var $new = $('.myPhoto:last');	//新規の写真を変数に入れる。
	var cookieData = GetCookies();	//ユーザ名取得のため、クッキーのデータを連想配列で取得する。
	
	//ユーザ名を写真に追加する。
	$('.myPhotoUser', $new).text(cookieData['user']);
	//今日の日付を取得し、写真に追加する。
	$('.myPhotoDate', $new).text(getDateTime());
}

/*
 * 関数名:getDateTime()
 * 概要  :日付を取得する。
 * 引数  :なし
 * 戻り値:string:日付の文字列。
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function getDateTime(){
	var date = new Date()//日付取得のため、Dateクラスのインスタンスを生成する。
	//日付を取得して返す。
	return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
}

/*
 * 関数名:deletePhoto()
 * 概要  :チェックが入ったMyギャラリーの写真を削除する。
 * 引数  :なし
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function deletePhoto(){
	//チェックボックスが入っている写真があれば
	if($('.myPhotoCheck:checked')){
		var deleteTarget = [];	//削除対象の写真のIDを格納する配列を宣言、初期化する。
		var json = {};			//サーバへ送信するJSONの連想配列。
		
		//チェックが入った写真を走査する。
		$('.myPhoto:has(.myPhotoCheck:checked)').each(function(i){
			//削除対象の写真のIDを配列に追加していく
			deleteTarget[i] = $('.myPhotoId', this).text();
		});
		
		//コンテンツ番号と削除対象のIDの配列をJSONの連想配列に格納する。
		json['contentNum'] = 1;
		json['idList'] = deleteTarget;
		//JSONの連想配列をJSON文字列に変換する。
		var sendJson = JSON.stringify(json);
		
		//Ajax通信でレコード削除のサーブレットを呼び出す。
		$.ajax({
			url:'deleteContent',	//レコード削除のサーブレットを呼び出す。
			dataType:'text',		//テキストデータを返してもらう。
			async:false,			//同期通信を行う。
			data:{json:sendJson},	//削除関連の情報を格納したJSONを送信する。
			success:function(text){		//通信成功時の処理。
				//1件以上削除できていれば
				if(!(parseInt(text))){
					alert(text);		//削除完了のメッセージを出す。
					//選択された写真を消す。
					$('.myPhoto').has('.myPhotoCheck:checked').remove();
				//削除できていなければ
				} else {
					alert('写真の削除に失敗しました。');			//削除失敗のメッセージを出す。
				}
			},
			error:function(){		//通信失敗時の処理。
				alert('通信に失敗しました。');		//通信失敗のメッセージを出す。
			}
		});
	} else {
		//写真未選択の旨を伝える。
		alert('削除する写真を選んでください。');
	}
}

/*
 * 関数名:postPhoto(photo)
 * 概要  :サーバに保存する写真のデータを送信する。
 * 引数  :element photo:写真のタグ。
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function postPhoto(photo){
	//写真のデータを連想配列にして返してもらう。
	var photoData = JSON.stringify(createPhotoData(photo));
	
	//Ajax通信でサーバに写真のデータを送信する。
	$.ajax({
		url:init['postJSON'],	//初期化データの連想配列にあるURLに送信する
		method:"POST",			//POSTメソッドで送信量を気にせず送信できるようにする。
		dataType:'json',		//JSONで返してもらう。
		data:{json:photoData, contentNum:"1"},			//作成した写真データを送信する。
		//通信が成功したら
		success:function(json){
			//写真が新規作成であったら
			if(parseInt(json['isnew'])){
				$('.myPhotoId' ,photo).text(json['isnew']);	//新規作成時に取得したIDを設定する。
			}
		},
		//通信が失敗したら
		error:function(){
			//保存失敗の旨を伝える。
			alert('写真の保存に失敗しました。');
		}
	});
}

/*
 * 関数名:createPhotoData(photo)
 * 概要  :写真のデータの連想配列を作成する。
 * 引数  :element photo:写真のタグ。
 * 戻り値:Object:写真のデータ。
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function createPhotoData(photo){
	var retMap = {};	//返す連想配列を用意する。
	//ユーザIDを送信するため、クッキーを取得する。
	var cookie = GetCookies();
	
	//画像ソースを格納する。
	retMap['photo'] = $('.myPhotoLink', photo).attr('href');
	//日付を格納する。
	retMap['postDate'] = $('.myPhotoDate', photo).text();
	//ユーザIDを格納する。
	retMap['userId'] = cookie['userId'];
	//タイトルを格納する。
	retMap['title'] = $('.myPhotoTitle', photo).text();
	//コメントを格納する。
	retMap['comment'] = $('.myPhotoComment', photo).text();
	//写真IDを格納する。
	retMap['id'] = $('.myPhotoId', photo).text();
	
	//作成した連想配列を返す。
	return retMap;
}

/*
 * 関数名:startEditText(textElem)
 * 概要  :テキストを編集するモードに移行する。
 * 引数  :elemental textElem:対象となる要素。
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function startEditText(textElem){
	var currentText = $(textElem).text()		//テキストの値を取得する。
	var className = $(textElem).attr('class');	//クラス名を取得する。
	
	//classNameがコメントのクラスであれば
	if(className == 'myPhotoComment'){
		//編集用のテキストエリアを配置する。
		$(textElem).after($('<textarea>')
				.addClass(className + 'Edit')	//編集テキストエリア用のクラスをセットする。
				.val(currentText)				//テキストを引き継ぐ。
			);
	} else {
		//編集用のテキストエリアを配置する。
		$(textElem).after($('<input>')
				.addClass(className + 'Edit')	//編集テキストエリア用のクラスをセットする。
				.val(currentText)				//テキストを引き継ぐ。
				.attr('type', 'text')			//テキストボックスのtypeをセットする。	
		);
	}
	
	//追加した要素にフォーカスする。
	$('.' + className + 'Edit').focus();
	
	//イベント発火元の要素を消す。
	$(textElem).remove();
};

/*
 * 関数名:endEditText($this)
 * 概要  :テキストの編集モードを終了する。
 * 引数  :jQuery $this
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function endEditText(textElem){
	var $this = $(textElem);	//引数の要素のjQueryオブジェクトを取得する。
	//編集後のテキストボックスを取得する。
	var currentText = $this.val();
	//編集モードになる前のクラス名を取得する。
	var pastClass = $this.attr('class').replace('Edit', '');
	
	//編集モードになる前のタグを生成する。
	$this.after($('<p></p>')
			.text(currentText)
			.addClass(pastClass)
		);
	
	//用済みになった編集要素を消す。
	$this.remove();
}

/*
 * 関数名:popupComment(selector)
 * 概要  :指定した要素をクリックまたはタップするとテキストがポップアップで表示されるようにする。
 * 引数  :string selector:ポップアップさせる要素。
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function popupComment(selector){
	//指定した要素をクリックまたはダブルクリックしたらテキストがポップアップ表示される様にする。
	$(selector, document).smallipop({triggerOnClick:true});
}

/*
 * 関数名:beforeConfirmButtonPush(func, message, arg)
 * 概要  :関数をコールする前に確認のダイアログを出す。
 * 引数  :funciton func:対象の関数
 * 		:string message:ダイアログに出すメッセージ。
 * 		:?		arg:引数。特に型を指定しない。
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function beforeConfirmButtonPush(func, message, arg){
	//確認ダイアログを出し、OKかキャンセルかを選択してもらう。
	ret = confirm(message);
	
	//OKが押されたら
	if(ret){
		//引数の関数をコールする。
		func(arg);
	}
}

/*
 * イベント名:$(document).on('click', '.myGalleryEditButtons .deleteButton')
 * 引数  　 	:string 'click':クリックイベントの文字列
 * 			:string '.myGalleryEditButtons .deleteButton':削除ボタンのセレクタ
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの削除ボタンを押したときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('click', '.myGalleryEditButtons .deleteButton', function(){
	//チェックが入っている写真があれば
	if($('myPhotoCcheck')){
		//確認ダイアログを出して同意を得てから画像を消す。
		beforeConfirmButtonPush(deletePhoto, '選択した写真を削除しますか?', '');
	}
});

/*
 * イベント名:$(document).on('dblclick', '.myGallery .myPhotoTitle')
 * 引数  　 	:string 'dblclick':ダブルクリックイベントの文字列
 * 			:string '.myGallery .myPhotoTitle':写真のタイトルのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のタイトルをダブルクリックしたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('dblclick', '.myGallery .myPhotoTitle', function(){
	//タイトルを編集モードにする。
	startEditText(this);
});

/*
 * イベント名:$(document).on('blur', '.myGallery .myPhotoTitleEdit')
 * 引数  　 	:string 'blur':フォーカスが外れたときのイベントの文字列
 * 			:string '.myGallery .myPhotoTitle, .myGallery .myPhotoCommentEdit':写真のタイトルとコメントのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のタイトルの編集を終えたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('blur', '.myGallery .myPhotoTitleEdit, .myGallery .myPhotoCommentEdit', function(){
	var $photo = $('.myPhoto').has(this);	//対象の写真のjQueryオブジェクトを取得しておく。
	//編集モードを解除する。
	endEditText(this);
	//編集したデータを送信する。
	postPhoto($photo);
});

/*
 * イベント名:$(document).on('dblclick', '.myGallery .myPhotoComment')
 * 引数  　 	:string 'dblclick':ダブルクリックイベントの文字列
 * 			:string '.myGallery .myPhotoComment':写真のコメントのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のコメントをダブルクリックしたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('dblclick', '.myGallery .myPhotoComment', function(){
	//コメントを編集モードにする。
	startEditText(this);
});

/*
 * イベント名:$(document).on('click', '.myGalleryEditButtons .createButton')
 * 引数  　 	:string 'click':クリックイベントの文字列
 * 			:string '.myGalleryEditButtons .createButton':新規ボタンのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のコメントの編集を終えたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('click', '.myGalleryEditButtons .createButton', function(){
	//画像アップローダーのタグをクリックする。
	$('.uploader').click();
});

/*
 * イベント名:$(document).on('change', '.uploader .createButton')
 * 引数  　 	:string 'change':値変化のイベントの文字列
 * 			:string '.myGalleryEditButtons .uploader':新規ボタンのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のコメントの編集を終えたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
	//アップロードボタンの値が変わったときのイベント(=アップロードを行った後のイベント)
	$(document).on('change', '.myGalleryEditButtons .uploader', function(event){
		//ファイルを取得する
		var file = event.target.files[0];
		//保存先を指定して画像のアップロードを行う。
        $(this).upload('uploadImage',"photo/general/web", function(xml) {
        	//返ってきたデータから成否判定の値を取り出す。
        	var issuccess = parseInt($(xml).find('issuccess').text());
        	if(issuccess){	//保存に成功していたら
        		var src = $(xml).find('src').text();	//画像の保存先を取得する。
        		//画像の縮小を行う。
        		canvasResize(file, {
        			crop: false,	//画像を切り取るかを選択する
        			quality: 80,	//画像の品質
        			//コールバック関数。画像パスを引数として受け取る。
        			callback: function(data) {
        				//createTagで新たな写真を作成する。
        				creator.outputTag('blankPhoto', 'myPhoto', '.myGallery');
        				//新たな写真を初期化する。
        				createNewPhoto();
        				//画像拡大用のタグにソースをセットする。
        				$('.myPhotoLink:last').attr('href', src);
        				//画像サムネイルに使う要素の画像を設定する。
        				$('.myPhotoImage:last').css('background-image', 'url('  +  src + ')');
        			}
        		})
        	//保存に失敗していたら
        	} else {
        		alert($(xml).find('message').text());	//メッセージを取り出してアラートに出す。
        	}
        //サーバから返されたデータをXMLとして扱う。
        },"xml");
	});
	
/*
 * 関数名:function saveMyOptionSetting()
 * 概要  :Myオプションページの設定を保存する。
 * 引数  :funciton func:対象の関数
 * 戻り値:なし
 * 作成日:2015.04.03
 * 作成者:T.Masuda
 */
function saveMyOptionSetting(){
	//設定のデータを連想配列にして返してもらう。
	var settingData = JSON.stringify(createMyOptionData());
	
	//Ajax通信でサーバに写真のデータを送信する。
	$.ajax({
		url:init['postJSON'],	//初期化データの連想配列にあるURLに送信する
		method:"POST",			//POSTメソッドで送信量を気にせず送信できるようにする。
		dataType:'json',		//JSONで返してもらう。
		data:{json:settingData, contentNum:"2"},	//作成した設定を送信する。
		//通信が成功したら
		success:function(json){
			var success = parseInt(json['issuccess']);	//成功したかどうかのデータを取得する。
			var message = "更新に失敗しました。時間をおいてお試しください。";	//メッセージを格納する変数を宣言する。
			//取得したデータが成功のものなら
			if(success){
				message = "更新が完了しました。";	//成功メッセージを用意する。
			}
			
			alert(message);	//結果をダイアログで表示する。
		},
		//通信が失敗したら
		error:function(){
			//保存失敗の旨を伝える。
			alert('通信に失敗しました。時間をおいてお試しください。');
		}
	});
}

/*
 * 関数名:function createMyOptionData()
 * 概要  :Myオプションページの設定の送信データを作成する。
 * 引数  :なし
 * 戻り値:Object : 設定データの連想配列。
 * 作成日:2015.04.03
 * 作成者:T.Masuda
 */
function createMyOptionData(){
	var retMap = {};	//返す連想配列を用意する。
	//ユーザIDを送信するため、クッキーを取得する。
	var cookie = GetCookies();
	
	//Myギャラリー公開設定の値を格納する。。
	retMap['myGalleryPublication'] = $('input[name="myGalleryPublication"]:checked').attr('value');
	//ブログ公開設定を格納する。
	retMap['blogPublication'] = $('input[name="blogPublication"]:checked').attr('value');
	//ブログタイトルを格納する。
	retMap['blogTitle'] = $('input[name="blogTitle"]').val();
	//ユーザIDを格納する。
	retMap['userId'] = cookie['userId'];
	
	return retMap;	//作成したデータを返す。
}
/*
 * イベント名:$(document).on('change', 'myOptionConfirmChangeButton')
 * 引数  　 	:string 'click':クリックのイベントの文字列
 * 			:string '.myOptionConfirmChangeButton':Myオプションページの更新ボタンのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myオプションページでの設定を保存する。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('click', '.myOptionConfirmChangeButton', function(event){
	saveMyOptionSetting();	//設定を保存する。
});