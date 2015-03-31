/* アクションを制御するJSファイル。 */

/*
 * 関数名:clickButtonToFile(parentClass)
 * 引数  :String parentClass:対象となる要素の親要素。
 * 　　　　String sendValTarget:アップロードされたファイルを渡す対象。ボタンと同じ階層。
 * 戻り値:なし
 * 概要  :ボタンを押したら同階層のファイルアップロードのボタンを押した事にする。
 * 作成日:2015.03.18
 * 作成者:T.M
 */
function clickButtonToFile(parentClass, sendValTarget){
	//アップロードボタンのchangeイベントを定義する。
	$(document).on('change', parentClass + ' > input[type="file"]', function(){
		//指定した対象に値を渡す。
		$(sendValTarget, $(this).parent()).val($(this).val());
	});
	
	//ボタンのクリックイベントを登録する。
	$(document).on('click', parentClass + ' > button', function(){
		//アップロードボタンをクリックする。
		$('input[type="file"]', $(this).parent()).click();
	});
}


/*
 * 関数名:checkAllRecord()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :見出しのチェックボックスをクリックしたら全ての行のチェックボックスのオンオフが切り替わる。
 * 作成日:2015.03.26
 * 作成者:T.M
 */
function checkAllRecord(){
	//見出し行のチェックボックスがクリックされたら
	$(document).on('click', '.tableHead th:first-child input:checkbox', function(){
		var parentTable = $('table').has(this);
		//見出し行のチェックボックスにチェックが入ったら
		if($(this).is(':checked')){
			//1列目のチェックボックスをみんな入れる。
			$('tr td:first-child input:checkbox', parentTable).prop('checked', true);
		//そうでなければ
		} else{
			//1列目のチェックボックスをみんな外す。
			$('tr td:first-child input:checkbox', parentTable).prop('checked', false);
		}
	});
}