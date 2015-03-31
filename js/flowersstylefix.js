// レイアウト・外観調整用JSファイル。

	/* 
	 * 関数名:fixXCoordinateOnScroll(fixedElem)
	 * 概要  :引数に指定した、position:fixed;を設定した要素を横スクロールするようにする。
	 * 引数  :Selector fixedElem
	 * 返却値 :なし
	 * 作成者:T.M
	 * 作成日:2015.02.09
	 */
function fixXCoordinateOnScroll(fixedElem){
	// ヘッダーが画面横スクロールに合わせてスクロールしない問題の解決。
	// 画面スクロールが発生したら
	$(window).scroll(function(){
		// ヘッダーの左からの位置をスクロール分マイナスする。
		$(fixedElem).css('left', -(window.scrollX));
	});
}
/* 
 * 関数名:fixYCoordinate(upperElem, lowerElem)
 * 概要  :第一引数に指定した要素の高さ分の上marginを第二引数に指定した要素に設定する。
 * 引数  :Selector upperElem, Element lowerElem
 * 返却値 :なし
 * 作成者:T.M
 * 作成日:2015.02.09
 * 変更者:T.M
 * 変更日:2015.02.22
 * 内容　:ウィンドウのリサイズイベントに変更しました。
*/
function fixYCoordinate(upperElem, lowerElem){
	// upperElemの高さをlowerElemの上marginに設定する。
	$(lowerElem).css('margin-top', $(upperElem).height());
	// リサイズイベントを登録する。
	// スマホレイアウト時はメディアクエリーにより、ここで設定されるmarginが無視されます。
	$(window).resize(function(){
		// upperElemの高さをlowerElemの上marginに設定する。
		$(lowerElem).css('margin-top', $(upperElem).height());
	});
}

