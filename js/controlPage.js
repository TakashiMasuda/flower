// 画面遷移を操作する関数を中心にまとめたJSファイル。

currentLocation = '';	//現在選択中のページの変数

/*
 * 関数名:isSupportPushState()
 * 引数  :なし
 * 戻り値:boolean
 * 概要  :ブラウザがpushStateに対応しているかをbooleanで返す。
 * 作成日:2015.03.10
 * 作成者:T.M
 */
function isSupportPushState(){
	// 返却値を格納する変数returnsを宣言し、falseで初期化する。
	var returns = false;
	//ブラウザがpushStateに対応していれば
	if(window.history && window.history.pushState){
		//trueを返す様にする。
		returns = true;
	}
	
	//returnsを返す。
	return returns;
}

/*
 * イベント:ready
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :ドキュメント読み込み後のイベント
 * 作成日 :2015.03.10
 * 作成者 :T.M
 */
$(document).ready(function(){
	// リンクをクリックしたら
	$(document).on('click', 'a[href$=".html"]', function(event){
		//pushState対応ブラウザであれば
		if(isSupportPushState()){
			//URLを引数にしてページを切り替える関数をコールする。
			callPage($(this).attr('href'));
			//通常の画面遷移をキャンセルする。		
			event.preventDefault();
		}
	});
});

/*
 * 関数名:overwrightContent(target, data)
 * 引数  :String target, Object state
 * 戻り値:なし
 * 概要  :既存のコンテンツを消して、新たなコンテンツを書き出す。
 * 作成日:2015.03.09
 * 作成者:T.M
 */
function overwrightContent(target, data){
	var dat = $(data);
	//mainのタグを空にする。
	$(target).empty();
	//linkタグを収集する。
//	var links = $(data).filter('link');
	var links = $('link', data);
	//コードが書かれているscriptタグを収集する。
//	var scripts = $(data).filter('script:not(:empty)');
	var scripts = $('script:not(:empty)', data);
	//linkタグを展開する。
	links.each(function(){
		//headタグ内にlinkタグを順次追加していく。
		$(target).append($(this));
	});
	//scriptタグを展開する。
	scripts.each(function(){
		//mainのタグの中にscriptタグを展開し、JavaScriptのコードを順次実行する。
		$(target).append($(this));
	});
}

/*
 * 関数名:callPage(url, state)
 * 引数  :String url, Object state
 * 戻り値:なし
 * 概要  :新たにページを読み込む。
 * 作成日:2015.03.05
 * 作成者:T.M
 * 修正日:2015.03.06
 * 修正者:T.M
 * 内容　:戻るボタンに対応しました。
 */
function callPage(url, state){
	//urlから#を抜き取り、有効なURLを形成する。
	url = url.replace('#', '');
	//Ajax通信を行う。
	$.ajax({
		//URLを指定する。
		url: url,
		//HTMLを返してもらう。
		dataType:'html',
		//同期通信を行う。
		async: false,
		//通信成功時の処理
		success:function(html){
			//JSONデータを格納する変数を初期化する。
			creator.json = null;
			//ひな形のHTMLのDOMを格納する変数を初期化する。
			creator.dom = '';
			//既存のコンテンツを上書きする。
			overwrightContent('.main', html);
			//カレントのURLを更新する。
			currentLocation = url;

			//ログインダイアログが出ていれば
			if($('.loginDialog').length){
				//ログインダイアログを直ちに消す。
				$('.loginDialog').dialog('close').dialog('destroy').remove();
			}

			//第二引数が入力されていなければ、また、pushStateに対応していれば
			if(state === void(0) && isSupportPushState()){
				//画面遷移の履歴を追加する。
				history.pushState({'url':currentLocation}, '', location.href);
			}
		}
	});
}

/*
 * 関数名:callLoadingScreen()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :ローディング画面を表示する。
 * 作成日:2015.03.02
 * 作成者:T.Masuda
 */
function callLoadingScreen(){
		//ローディング画面を出す。
		$('.loading').css('display','block');
}

/*
 * 関数名:hideLoadingScreen()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :ローディング画面を隠す。
 * 作成日:2015.03.05
 * 作成者:T.Masuda
 */
function hideLoadingScreen(){
	//ローディング画面を隠す。
	$('.loading').css('display','none');
}

/*
 * イベント:ready
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :ローディング画面の作成。
 * 作成日 :2015.03.10
 * 作成者 :T.M
 */
$(document).ready(function(){
	//ローディング画面を追加する。
	$('body').prepend($('<div></div>')
			.addClass('loading')
			//ローディング画像を追加する。
			.append($('<img>')
					//ローディング画像のパスを追加する。
					.attr('src', 'image/loading.gif')
			)
			//Loadingの文字を表示する。
			.append($('<p></p>')
					//文字を追加する。
					.text('Loading...')
			)
	);
});

/*
 * 関数名:createFormData(form)
 * 引数  :jQuery form
 * 戻り値:Object
 * 概要  :フォームの投稿データを作る。
 * 作成日:2015.03.09
 * 作成者:T.Masuda
 */
function createFormData(form){
	//返却するデータを格納する変数を宣言する。
	var formDataReturn = {};
	
	//フォーム内の入力要素を走査する。
	$('input:text, input[type="email"], textarea, input:radio:checked, input:checkbox:checked', form).each(function(){
		//値を取得する。
		var val = $(this).val();
		//name属性の値を取得する。
		var name = $(this).attr('name');
		
		//name属性で括られた最初のチェックボックスなら
		if($(this).attr('type') == 'checkbox' 
			&& $(this).index('[name="' + name + '"]') == 0){
			//valを配列として扱う。
			val = [];
			//name属性で括られたチェックボックスを走査していく。
			$('input:checkbox[name="' + name + '"]').each(function(i){
				//配列にチェックボックスの値を格納していく。
				val[i] = $(this).val();
			});
			//formDataを連想配列として扱い、keyとvalueを追加していく。
			formDataReturn[name] = val;
		//チェックが入った2番目以降のチェックボックスであるか、name属性がない入力要素であれば
		} else if(($(this).attr('type') == 'checkbox' 
			&& $(this).index('[name="' + name + '"]') != 0) || name === void(0)){
			//何もしない。
		//それ以外であれば
		} else {
			//formDataを連想配列として扱い、keyとvalueを追加していく。
			formDataReturn[name] = val;
		}
	});
	
	//フォームデータを返す。
	return formDataReturn;
}

/*
 * イベント:submit
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :フォームがsubmitされたときのイベント。
 * 作成日 :2015.03.10
 * 作成者 :T.M
 */
$(document).on('submit', '.contactForm, .sendForm, .editStudent', function(event){
	//submitイベントをキャンセルする。
	event.preventDefault();
	//フォームのaction属性から送信URLを取得する。
	var url = $(this).attr('action');
	
	//送信するデータを格納する連想配列を作成する。
	var formData = createFormData($(this));
	
	//postメソッドでフォームの送信を行う。
	$.post(url, formData,
	// 成功時の処理を記述する。
	 function(data){
		//mainのタグを空にする。
		$('.main').empty();
		//取得したページのmainタグ直下の要素をを取得し、mainのタグに格納する。
		$('.main').append($('.main > *', data));
		//linkタグを収集する。
		var links = $(data).filter('link');
		//scriptタグを収集する。
		var scripts = $(data).filter('script:parent');
		//linkタグを展開する。
		links.each(function(){
			//headタグ内にlinkタグを順次追加していく。
			$('.main').append($(this));
		});
		//scriptタグを展開する。
		scripts.each(function(){
			//mainのタグの中にscriptタグを展開し、JavaScriptのコードを順次実行する。
			$('.main').append($(this));
		});
		//カレントのURLを更新する。
		currentLocation = url;
	});
});

/*
 * 関数名:functionFilter
 * 引数  :var filterTarget
 * 戻り値:なし
 * 概要  :引数をセレクターにしてマウスオーバーしたときに透過率を0.5にする
 * 作成日:2015.02.05
 * 作成者:T.Y
 * 変更日:2015.02.22
 * 変更者:T.Masuda
 * 内容  :トップメニューにある表示中のページのボタンの背景色を変える。
 */
function functionFilter (filterTarget) {
  // jqueryの記述の始まり
	//現在表示中のページのボタン以外に対して
    $(document)
        .on('mouseenter', filterTarget, function() {	// 引数の要素にマウスを乗せた時の処理
            $(this).addClass('active');   				 // 引数の要素にactiveクラスを付与する。
        })
        .on('mouseleave', filterTarget, function() {	// 引数の要素からマウスが離れたときの処理
            $(this).removeClass('active');  			// 引数の要素からactiveクラスを除去する。
        });
}
	
/*
 * 関数名:changeSelectedButtonColor
 * 引数  :var filterTarget
 * 戻り値:なし
 * 概要  :選択した要素の色を変えるクラスを付与する。
 * 作成日:2015.03.06
 * 作成者:T.Masuda
 */
function changeSelectedButtonColor(filterTarget){
	//一旦全てのactive,currentクラスを剥奪する。	
	$(filterTarget).removeClass('active');
	$(filterTarget).removeClass('current');
	// 現在のページのボタンの枠に対して、currentクラスを付与する。
	$(filterTarget, document).filter(':has(a[href$="' + currentLocation + '"])').addClass('current');
}

/*
 * イベント名:ajaxStart
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :Ajax通信を開始した後の処理。
 * 作成日　　:2015.03.09
 * 作成者　　:T.Masuda
 */
//Ajax通信が始まったら
$(document).ajaxStart( function(){
	//ローディング画面を出す。
	callLoadingScreen();
});


/*
 * イベント名:ajaxStop
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :Ajax通信を終えた後の処理。
 * 作成日　　:2015.03.09
 * 作成者　　:T.Masuda
 */
//Ajax通信が全て終了したら
$(document).ajaxStop( function(){
	//ローディング画面を隠す。
	hideLoadingScreen();
	//選択されたトップメニューの色を変える。
	changeSelectedButtonColor('.topMenu li');
});
/* 以上、ローディング画面呼び出しのイベント登録。 */

/*
 * 関数名:なし
 * 引数  :なし
 * 戻り値:なし
 * 概要  :Ajax通信でのページ読み込みを行っていても、ブラウザバック等の履歴機能を有効にする。
 * 作成日:2015.03.09
 * 作成者:T.Masuda
 */
//popStateに対応できているブラウザであれば
if (isSupportPushState()){
	//popStateのイベントを定義する。
    $(window).on("popstate",function(event){
        //初回アクセスであれば何もしない。
    	if (!event.originalEvent.state){
    		return; // 処理を終える。
    	}
        var state = event.originalEvent.state; 	//stateオブジェクトを取得する。
        currentLocation = state['url'];			//stateから現在のURLを取り出し保存する。
        callPage(state['url'], state);			//履歴からページを読み込む。
  });
}

/*
 * イベント名:load
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :ページの読み込みを終えた後の処理。
 * 作成日　　:2015.03.09
 * 作成者　　:T.Masuda
 */
$(window).on('load', function(){
	//pushStateに対応していれば、pushStateで更新のイベント
	if (isSupportPushState()){
		//初回ロードでなければ
		if (window.history.state){
			//履歴からURLを引き出す
			var currentUrl = window.history.state.url;
			//ページを読み込む。更新なので履歴を積まないために第二引数を入力する。
			callPage(currentUrl, window.history.state);
		}
	//pushStateに対応していなければhashchangeのイベントで更新を行う。
	}else{
		//ハッシュ切り替えイベント発生時の処理
		$(window).bind("hashchange", function(ev){
			//ハッシュが変わっていれば
			if(location.hash) {
				//URLからハッシュを取り出し、変数に格納する。
				var hash = location.hash;
				//該当するページを読み込む。
				callPage(hash);
				//そうでなければ
			} else {
				//画面を更新する。
				location.reload();
			}
		});
		
		//画面遷移でのページ読み込み時点でハッシュがあれば
		if(location.hash) {
			//URLからハッシュを取り出し、変数に格納する。
			var hash = location.hash;
			//該当するページを読み込む。
			callPage(hash);
		//そうでなければ
		}
	}
});

/*
 * 関数名:callPageInTab(url, tabPanel)
 * 概要  :タブパネル内でページを切り替える。
 * 引数  :String url:読み込むhtmlファイルのURL
 * 		 element tabPanel:タブパネルのDOM要素
 * 戻り値:なし
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
function callPageInTab(url, tabPanel){
	//ajax通信を行う
	$.ajax({
		url:url,				//読み込むファイルのURLを指定する。
		dataType:'html',		//htmlのデータを返してもらう。
		async:false,			//同期通信を行う。
		success:function(html, dataType){	//通信に成功したら
			//タブパネル内を書き換える。
			overwrightContent(tabPanel,html);
			creator.json = '';	/* JSONをクリアする。 */
		},
		//通信エラーであれば
		error:function(XMLHttpRequest, textStatus, errorThrown){
			//エラーを通知する。
			alert('通信に失敗しました。時間をあけて試してください。');
		}
	})
}

/*
 * イベント名:$(document).on('click')
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :タブパネル内でリンクをクリックしたときのイベント。
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
//表示中のタブパネル内でリンク付きのボタンがクリックされたら
$(document).on('click', '.tabPanel.active button[href]', function(){
	//タブ内でのページの切り替えを行う。
	callPageInTab($(this).attr('href'), $('.tabPanel').has(this));
});


/*
 * 関数名:submitImitateForm(form)
 * 概要  :疑似フォームを送信して画面を切り替える。
 * 引数  :element tabPanel:疑似フォームのDOM要素
 * 戻り値:なし
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
function submitImitateForm(form){
	//フォームのデータを作る。
	var formData = createFormData(form);
	//現在のタブを取得する。
	var activeTabPanel = $('.tabPanel').has(form);
	
	//createTagのインスタンスの連想配列メンバにフォームデータを格納する。
	creator.json['formData'] = formData;
	
	//フォームを送信する先のページに切り替える。
	callPageInTab(form.attr('action'), activeTabPanel);
};

/*
 * 関数名:sendImitateForm()
 * 概要  :疑似フォームを送信して画面を切り替える。ボタンのonclick属性でコールする。
 * 引数  :なし
 * 戻り値:なし
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
function sendImitateForm(form){
	var $form = $(form);	//疑似フォームとなる要素を取得する。
	//フォームのデータを作る。
	var formData = createFormData($form);
	//createTagのフォームデータのメンバを初期化する。
	creator.formData = {};
	//createTagのインスタンスの連想配列メンバにフォームデータを格納する。
	creator.formData['formData'] = formData;
	
	//フォームを送信する先のページに切り替える。
	callPage($form.attr('action'));
};

/*
 * イベント名:$(document).on('submit', '.imitateForm')
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :フォームをsubmitしたときのイベント。
 * 作成日　　:2015.03.26
 * 作成者　　:T.Masuda
 */
$(document).on('submit', '.imitateForm', function(){
	event.preventDefault();	//submitイベント本来の画面遷移をキャンセルする。
	sendImitateForm(this);	//自己定義の関数でフォームの送信を行う。
});

/*
 * イベント名:$(document).on('click')
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :タブパネル内で疑似フォームをサブミット(クリック)したときのイベント。
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
//表示中のタブパネル内で疑似フォームがサブミットされたら
$(document).on('click', '.imitateForm .submit', function(){
	//疑似サブミットの処理の関数をコールする。
	submitImitateForm($('.imitateForm').has(this));
});

/*
* 関数名:function createUserData(contentNum)
* 概要  :cookieからユーザ名を取得し、コンテンツ番号と共にサーバへ送信するための連想配列に格納して返す。
* 引数  :int contentNum:コンテンツ番号。
* 戻り値:Object:サーバへ送信するデータを格納した連想配列。
* 作成日　　:2015.03.31
* 作成者　　:T.Masuda
*/
function createUserData(contentNum){
	var cookie = GetCookies();	//cookieの連想配列を取得する。
	var retMap = {};			//返却用の連想配列を準備する。
	
	//cookieからユーザIDを取得し、retMapに格納する。
	retMap["userId"] = cookie["userId"];
	//retMapにコンテンツ番号を格納する。
	retMap["contentNum"] = contentNum;
	
	//作成した連想配列を返す。
	return retMap;
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
