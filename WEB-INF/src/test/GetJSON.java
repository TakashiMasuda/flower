package test;	//テスト用パッケージ。

//入力エラー用の例外クラスをインポートする。
import java.io.IOException;
import java.io.PrintWriter;


//サーブレットでのエラー用の例外クラスをインポートする。
import javax.servlet.ServletException;
//サーブレットのクラス群をインポートする。
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//サーブレットのGetJSONクラスを宣言する。
public class GetJSON extends HttpServlet {
	/**
	 * シリアルを発行する。
	 */
	private static final long serialVersionUID = 1560113726092507162L;

	//getメソッドで通信する。
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
		    throws ServletException, IOException {
//		HttpServletResponse httpServletResponse = ResponseUtil.getResponse();
		// 文字エンコード。JSON設定
//		httpServletResponse.setContentType("application/json;charset=UTF-8");
		// 出力の準備を行う
//		PrintWriter out = httpServletResponse.getWriter();
		
		// Fig2(受注伝票のリストのレコードを取得する)
//		results = jdbcManager.from(Fig2.class)
//				.getResultList();
		
		// 文字列を作成するためのクラスのインスタンスを準備
		StringBuilder buf = new StringBuilder();
		// JSONの行のID
		int id = 1;
	    // 送信するJSONを作成する
		// 総数
		buf.append("{\"total\":\"");
		// レコード数をセット
//	    buf.append(results.size());
		// ページ数
	    buf.append("\", \"page\": \"");
		// 1ページに設定
	    buf.append(1);
		// レコード数
	    buf.append("\", \"records\": \"");
		// レコード数をセット
//	    buf.append(results.size());
		// 行
	    buf.append("\", \"rows\": [");
		// 拡張for文でリストの行を生成する
//	    for (Fig2 fig2: results) {
			// 行ID
	        buf.append("{\"id\":\"");
			// IDをセット
	        buf.append(id++);
			// セル。配列形式で記述
	        buf.append("\", \"cell\":[\"");
			// チェックボックスのHTML
//	        buf.append("<input type=\\\"checkbox\\\" class=\\\"list_select\\\" value=\\\"checked\\\">");
	        //ラジオボタンのHTML
//	        buf.append("<input type=\\\"radio\\\" name=\\\"radio\\\" class=\\\"radio\\\" value=\\\"checked\\\">");
			// 区切り文字
	        buf.append("\", \"");
			// 番号
//	        buf.append(fig2.no);
	        buf.append("\", \"");
			// 製品番号
//	        buf.append(fig2.productNum);
	        buf.append("\", \"");
			// 製品種別
//	        buf.append(fig2.productType);
	        buf.append("\", \"");
			// 製品名
//	        buf.append(fig2.product);
	        buf.append("\", \"");
			// ロット番号
//	        buf.append(fig2.lotNum);
	        buf.append("\", \"");
			// 単価
//	        buf.append(fig2.price);
	        buf.append("\", \"");
			// 個数
//	        buf.append(fig2.quantity);
	        buf.append("\", \"");
			// 金額
//	        buf.append(fig2.ammount);
	        buf.append("\", \"");
			// 発送先
//	        buf.append(fig2.delivery);
			// 行を閉じる
	        buf.append("\"]},");
	    }
	    
	    // 最後のカンマを削る
//	    buf.setLength(buf.length() - 1);
	    // 配列を閉じる
//	    buf.append("]}");
		
	    // JSONを書き出す
//		out.print(buf.toString());
		// フラッシュする
//		out.flush();
		// 出力ストリームを閉じる
//		out.close();	
		}
//	}
