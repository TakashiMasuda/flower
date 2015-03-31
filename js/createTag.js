//JSONとHTMLのパーツのひな形から、HTMLのパーツを作り上げる関数群。

//createTagコール時の引数として使う定数。
CREATETAG_FIRST = -1;

function createTag(){
	//JSONデータを格納する変数。
	this.json = null;
	//ひな形のHTMLのDOMを格納する変数。
	this.dom = '';
	//ブログページのナンバリングのJSON連想配列。
	this.numbering = '';
	//フォームデータを格納する連想配列。
	this.formData = {};
	
	/*
	 * 関数名:this.getJsonFile = function((jsonPath))
	 * 概要  :JSONファイルを取得して返す。
	 * 引数  :String jsonPath:JSONを要求する先。
	 * 		:Object map:サーバへ渡す値の連想配列。
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 * 変更者:T.Masuda
	 * 変更日:2015.03.30
	 * 内容　:サーバへ連想配列を渡せる様に変更しました。
	 */
	this.getJsonFile = function(jsonPath, map){
		//一時的に値を保存する変数tmpを宣言する。
		var tmp;
		//mapに何も入力されていなければ、空の連想配列を代入する。
		map = map === undefined ? {"blank":""} : map;
		//Ajax通信でjsonファイルを取得する。
		$.ajax({
			//jsonファイルのURLを指定する。
			url: jsonPath,
			//取得するファイルの形式をJSONに指定する。
			dataType: 'JSON',
			//同期通信を行う。
			async: false,
			//サーバへ連想配列を送信する。
			data: map,
			//通信完了時の処理を記述する。
			success: function(json){
				//クラスのメンバjsonに取得したjsonの連想配列を格納する。
				tmp = json;
			},
			//通信失敗時の処理。
			error:function(){
				//エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});

		//フィールドのメンバのjsonが空であれば
		if(this.json == null){
			//クラスのメンバのjsonにtmpの連想配列を格納する。
			this.json = tmp;
		//既にJSONが格納されていたら
		} else {
			//連想配列を連結する。
			this.json = $.extend(tmp,this.json);
		}
	};

	/* 
	 * 関数名:this.getDomFile = function((domPath))
	 * 概要  :JSONファイルを取得して返す。
	 * 引数  :String jsonPath
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 */
	this.getDomFile = function(htmlPath){
		//一時的に値を保存する変数tmpを宣言する。
		var tmp;
		
		//Ajax通信でjsonファイルを取得する。
		$.ajax({
			//jsonファイルのURLを指定する。
			url: htmlPath,
			//取得するファイルの形式をJSONに指定する。
			dataType: 'HTML',
			//同期通信を行う。
			async: false,
			//通信完了時の処理を記述する。
			success: function(html){
				//クラスのメンバdomに取得したDOMのオブジェクトを格納する。
				tmp = html;
			},
			//通信失敗時の処理。
			error:function(){
				//エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});
		
		//クラスのメンバのdomにtmpのHTML文字列をオブジェクトに変換して格納する。
		this.dom = $(tmp);
	};

	/* 
	 * 関数名:this.outputTag = function(key, domNodeName, appendTo)
	 * 概要  :キーからパーツを。
	 * 引数  :String key, String domNodeName, String appendTo
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.20
	 */
	this.outputTag = function(key, domNodeName, appendTo){
		//domNodeNameがundefined(未入力)であれば、キー名をdomNodeNameにする。
		domNodeName = domNodeName === undefined ? key : domNodeName;
			
		//JSONの先頭のキーの連想配列と、DOMの先頭を取得する。
		mapNode = this.getMapNode(key);			//マップの先頭を取得する。
		domNode = this.getDomNode(domNodeName);	//DOMの先頭を取得する。

		// createTagでキーに対応したHTMLのパーツを作成し、変数tagに格納する。
		var tag = this.createTag(mapNode, domNode);
		// パーツの作成に成功したならば
		if(tag != null){
			//@mod 2015.03.10 T.Masuda 第三引数appendToに対応しました。
			//appendToが入力されていれば
			if(appendTo != null){
				//appendで、作成したタグをappendToに追加する。
				$(appendTo).append(tag);
			//appendToが空であれば	
			} else {
				//appendで作成したタグをmainに追加する。
				$('.main').append(tag);
			}
			//@mod 2015.03.10 T.Masuda ここまで変更しました。
		// パーツの作成に失敗したならば
		} else{
			//失敗のメッセージダイアログを出す。
			console.log(key + 'の作成に失敗しました。');
		}
	}	
	
	/* 
	 * 関数名:this.createTag = function(curMapNode, curDomNode)
	 * 概要  :JSON連想配列のキーからタグに値を格納する。
	 * 引数  :Object curMapNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 */
	this.createTag = function(curMapNode, curDomNode){
		
		//マップ、DOMが取得できていなかったら
		if(curMapNode == null || curDomNode == undefined){
			//処理を終える。
			return null;
		}
				
		//連想配列に子がいる限りループする。
		for(key in curMapNode){
			var mapNode = curMapNode[key];	//mapNodeの内容をcurMapNode内のmapNodeの参照に切り替える。
			var attribute = false;				//属性値を格納する変数
			
			//キーがtextであれば
			if(key == 'text'){
				//curDomにテキストtextメソッドで追加する。
				curDomNode.text(mapNode);
			//キーがHTMLであれば
			} else if(key == 'html'){
				//curDomにテキストをhtmlメソッドで追加する。
				curDomNode.html(mapNode);
			//mapNodeが配列であれば
			} else if($.isArray(mapNode)){
				//キー名でタグを作成し、そのテキストにキー値をセットする。
				this.createTagArray(key, mapNode, curDomNode);
			//mapNodeが子であれば
			} else if(typeof mapNode == 'object'){
				//カレントの子DOMノードからkeyを持つDOMノードを取得する。
				var domNode = this.getDomChild(key, curDomNode);
				//domNodeがnullでなければ
				if(domNode){
					//子ノードへ再帰する。
					this.createTag(mapNode, domNode);
				}
			//curDomNodeのAttribute配列からmapNodeのキー値を持つノードを取得する。
			} else if(attribute = curDomNode[0].getAttributeNode(key)){
				//取得したノードにmapNodeの値をセットする。
				attribute.value = mapNode;
			}
		}
	
		//curDomNodeを返す。
		return curDomNode;
	};
	
	/* 
	 * 関数名:this.getMapNode = function(key)
	 * 概要  :JSON連想配列の最上階層からキーに対応した値を取り出す。
	 * 引数  :String key
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 */
	this.getMapNode = function(key){
		//クラスメンバの連想配列からキーに応じた連想配列を返す。
		return this.json[key];
	};

	/* 
	 * 関数名:this.getDomNode = function(key)
	 * 概要  :キーに対応するHTMLのパーツを返す。
	 * 引数  :String key
	 * 返却値  :jQuery
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 * 内容  :テンプレートのHTMLそのものではなく、コピーを返す様に変更しました。
	 */
	this.getDomNode = function(key){
		//メンバのHTMLからキーに対応した要素をコピーして返す。
		return $($(' > *[class="' + key +'"]', this.dom).clone(false));
	};
	
	/* 
	 * 関数名:this.createTagArray = function(mapNode, domNode)
	 * 概要  :リストタイプのタグを配置する。
	 * 引数  :String key, Object mapNode, jQuery domNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 * 内容　:本来想定されていた動作に修正されました。
	 */
	this.createTagArray = function(key, mapNode, domNode){
		//domNodeのキーの要素を取得する。
		domNode = this.getDomChild(key, domNode); 
		
		//引数にnullがあれば
		if(key == null || mapNode == null || domNode == null){
			//処理をやめる。
			return;
		}
		
		//不足しているタグの個数を算出する。
		var clones = mapNode.length - 1;
		//domNodeを必要な分コピーする。
		for(var i = 0; i < clones; i++){
			//1個目のmapNodeの後ろに自身のコピーを追加する。
			$(domNode[0]).after($(domNode[0]).clone(false));
		}

		//domNodeの兄弟要素を全て取得する。
		
		
		//mapNodeの配列分ループする。
		for(var i = 0; i < mapNode.length; i++){
			//keyでタグを生成する。
			$(domNode).text(mapNode[i]);
			//domNodeを次に移動する。
			domNode = $(domNode).next();
		}
	}

	/* 
	 * 関数名:this.getDomChild = function(key, domNode)
	 * 概要  :リストタイプのタグを配置する。
	 * 引数  :String key, jQuery domNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 * 内容　:タグに対応しました。
	 */
	this.getDomChild = function(key, domNode){
		var domNodeReturn;							//domNodeの返却用変数を作る。
		var domNodeReturn = $('.' + key, domNode);	//domNodeの子の階層からkeyのクラスを持つノードを取得する。
		//DOMの取得に失敗したら
		if(domNodeReturn[0] == null){
			//domNodeの子の階層からkeyのタグ名を持つノードを取得する。
			domNodeReturn = $(key, domNode);
		}
		
		//domNodeReturnを返す。
		return domNodeReturn;
	}
	
	/* 
	 * 関数名:this.outputNumberingTag = function(jsonName, startPage, displayPageMax, displayPage)
	 * 概要  :ナンバリングと、それに応じたブログのページを作る。
	 * 引数  :String jsonName:処理対象となるJSONのキー名。
	 * 		 int startPage:表示する1つ目のナンバリングの数
	 * 		 int displayPageMax:表示するナンバリングの最大数
	 * 		 int displayPage:表示するブログのページ番号
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 */
	this.outputNumberingTag = function(jsonName, startPage, displayPageMax, displayPage){
		
		//numberingの内容をクリアする（numberingはクラスのメンバとして宣言する）
		this.numbering = {};		

		//ナンバリング用のJSONを作る。
		this.createNumbering(jsonName, startPage, displayPageMax, displayPage);
		
		//記事を消す
		$('.blog').empty();
		//コンテンツ表示
		this.outputTag(displayPage, jsonName, '.blog');
		
		//ナンバリングを消す。
		$('.numberingOuter').empty();
		//ナンバリング用Tagを表示する。
		this.outputTag('numbering', 'numbering', '.numberingOuter');
		
		//現在表示中のページに対応するナンバリングの色を変える。
		this.selectPageNumber(displayPage);
	}

	/* 
	 * 関数名:this.createNumbering = function(jsonName, startPage, displayNum)
	 * 概要  :ブログページのナンバリング(ページャ)を作る。
	 * 引数  :String jsonName:JSON名。
	 * 		 int startPage:表示する1つ目のナンバリングの番号。
	 * 		 int displayPageMax:表示するナンバリングの最大個数。
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 */
	this.createNumbering = function(jsonName, startPage, displayPageMax, displayPage){
		//ページ数を取得する。
		var pageMax = this.getJsonObjectNum(jsonName);
		
		//ページ数が1以下ならナンバリングを作成せずに終了する。
		if(pageMax <= 1){
			return;
		}
		
		// <<ボタンを作る。(1ページ前に進める)
		this.createNumberingAround(this.numbering, 'pre', '<<', startPage,
										displayPageMax, displayPage-1, pageMax, jsonName);

		//ナンバリングの中の最後の数字を算出して変数に格納する。最終ページを超えていれば最終ページに丸める。
		var lastPage = (startPage + displayPageMax) <= pageMax ? (startPage + displayPageMax) : pageMax;
		
		//for文でナンバリングを必要なだけ作る。
		for(var i = startPage; i <= lastPage; i++){
			var indexText = (i - startPage + 1).toString();	//ナンバリングのボタンの連番の数値を文字列にする。
			var map = {};									//ページ数をキーとしたオブジェクトを生成する。
			map[indexText] = {};							//mapにindexTextの値をキーとした連想配列を追加する。
			
			//"text"キーにページ数を設定する。
			map[indexText]['text'] = i;
			//関数実行属性にoutputNumberingTagを設定する。
			map[indexText]['onclick'] = 'creator.outputNumberingTag("' 
				+ jsonName + '",' + startPage + ', ' + displayPageMax + ',' + i + ')';
			//numberingオブジェクトの中に、作成したオブジェクトを追加する。
			this.numbering[indexText] = map[indexText];
		}
			
		// <<ボタンを作る。(1ページ後に進める)
		this.createNumberingAround(this.numbering, 'next', '>>', startPage,
										displayPageMax, displayPage+1, pageMax, jsonName);
			
		//メンバjsonオブジェクトにnumberingオブジェクトを追加する。
		this.json['numbering'] = this.numbering;
		//numberingオブジェクトを返す。
		return this.numbering;
	}
	
	/* 
	 * 関数名:this.createNumberingAround = function(numbering, key, numberingString, startPage, displayPageMax, displayPage, pageMax)
	 * 概要  :ナンバリングの<<、>>を作る。
	 * 引数  :object numbering:ナンバリングが格納されている連想配列
	 * 		 string key:キー名。'pre'または'next'が入っている。
	 * 		 String numberingString:該当するナンバリングの文字。
	 * 		 int startPage:表示する最初のナンバリングの番号。
	 * 		 int displayPageMax:表示するナンバリングの個数。
	 * 		 int displayPage:現在のページ番号。
	 * 		 int pageMax:全ページ数。
	 * 		String jsonName:JSON名。
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 */
	this.createNumberingAround = function(numbering, key, numberingString, startPage, displayPageMax, displayPage, pageMax, jsonName){
		var startAroundPage;
		
		//開始ページを算出する
		//前移動の場合
		if (key === 'pre' && startPage > 1) {
			//開始ページを算出、1ページ以下の場合には1ページに丸める
			startAroundPage = startPage > displayPage ? (startPage-1) : startPage;		
		//後移動の場合
		} else if (key === 'next' && (startPage+displayPageMax) < pageMax) {
			//開始ページを算出、表示ページが最終ページを超えている場合、最終ページから開始ページを逆算する。
			startAroundPage = (startPage+displayPageMax) < displayPage ? startPage+1 : startPage;		
		//上記以外の場合
		} else {
			return;
		}
		
		var keyObj = {};	//keyオブジェクトを生成する。
		keyObj[key] = {};	//keyのキーを持った連想配列を追加する。
		
		//有効属性をONにする。
		keyObj[key]['enable'] = 'on';
		//実際に設定する文字をtextに設定する。
		keyObj[key]['text'] = numberingString;
		
		//関数実行属性をoutputNumberingTagに設定する。
		keyObj[key]['onclick'] = 'creator.outputNumberingTag("' + jsonName +'",'
			+ Math.round(startAroundPage) +','+ displayPageMax + ',' + displayPage +')';
		
		//numberingオブジェクトの中に追加する。
		numbering[key] = keyObj[key];
	}

	/* 
	 * 関数名:this.getJsonObjectNum = function(jsonName)
	 * 概要  :jsonの指定キー直下ののキーの数を返す。
	 * 引数  :String jsonName:処理対象のJSONのキー名。
	 * 返却値  :int
	 * 作成者:T.Masuda
	 * 作成日:2015.03.13
	 */
	this.getJsonObjectNum = function(jsonName){
		//返却する値を格納するための変数を宣言、0で初期化する。
		var retNum = 0;

		//jsonのキー走査する。
		for(key in this.json){
			//キーが数字であれば
			if(!(isNaN(key))){
				//retNumに1を足す
				retNum++;
			}
		}
		
		//retNumを返す。
		return retNum;
	}
	
	/* 
	 * 関数名:this.selectPageNumber = function(displayPage)
	 * 概要  :選択中のページナンバーの色を変える。
	 * 引数  :int displayPage:表示中のページ番号。
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.03.13
	 */
	this.selectPageNumber = function(displayPage){
		//全てのページナンバーからselectクラスを除去する。
		$('.numbering li').removeClass('select');
		//選択中のページナンバーのタグにselectクラスを付与して色を変える。
		$('.numbering li:contains(' + displayPage + ')').addClass('select');
	}
	
}
	
