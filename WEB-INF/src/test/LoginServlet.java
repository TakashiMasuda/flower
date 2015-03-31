package test;	//テスト用パッケージ。

//入力エラー用の例外クラスをインポートする。
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;



//サーブレットでのエラー用の例外クラスをインポートする。
import javax.servlet.ServletException;
//サーブレットのクラス群をインポートする。
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//サーブレットのGetJSONクラスを宣言する。
public class LoginServlet extends HttpServlet {
	/**
	 * シリアルを発行する。
	 */
	private static final long serialVersionUID = 1560113726092507162L;
	
	String successmessage = "login success";	//ログイン成功のメッセージ。
	//ログイン失敗のメッセージ。
	String failmessage = "ログインに失敗しました。ユーザーID、パスワードをご確認ください。";

	/*
	 * 関数名:static String createLoginResultJSON()
	 * 概要  :ログイン試行結果のJSONを作る。
	 * 引数  :int success:ログイン成功か否かの値。0で失敗、それ以外は成功となる。
	 * 		:username	:取得したユーザ名。ログイン失敗時には空文字となる。
	 * 		:String message:クライアントへ返すメッセージ。
	 * 戻り値:String:JSONの文字列。
	 * 作成日:2015.03.30
	 * 作成者:T.Masuda
	 */
	static String createLoginResultJSON(int success, String username, String message){
		//文字列生成のため、StringBuilderクラスのインスタンスを生成する。
		StringBuilder sb = new StringBuilder();
		//ログイン試行結果の値をJSONを入れる。
		sb.append("{\"issuccess\":\"" + success + "\",");
		//ユーザ名をJSONを入れる。
		sb.append("\"username\":\"" + username + "\",");
		//メッセージを入れる。
		sb.append("\"message\":\"" + message + "\"}");
		//作成したJSON文字列を返す。
		return sb.toString();
	}
	
	//getメソッドで通信する。
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
		    throws ServletException, IOException {
		// 文字エンコード。JSON設定
		response.setContentType("application/json;charset=UTF-8");
		//ユーザIDを受け取る。
		String userid = request.getParameter("userid");
		//パスワードを受け取る。
		String password = request.getParameter("password");
		//返却する文字列を生成するクラスのインスタンスを生成する。
		StringBuilder loginresult = new StringBuilder();
		// 出力の準備を行う
		PrintWriter out = response.getWriter();
		
		//ログインデータを取得するためのSQLを作成する。
		String sql = "SELECT l.password,p.nickname FROM Login AS l, Person AS p WHERE l.userId = '" + userid +"' AND l.memberId = p.id;";
		
		//SQLExceptionのtryブロック。
		try {
			//DBManagerクラスを利用し、DBへの接続を開始する。
			Connection con = DBManager.getConnection();
			//ステートメントを作成する。
			Statement stmt = con.createStatement();
			//クエリを実行し、結果セットを取得する。
			ResultSet rs = stmt.executeQuery(sql);
			
			//レコードが取得できていれば、ユーザの存在チェックを通過する。
			if(rs != null){
				//結果セットの行のポインタを動かす。
				rs.next();
				//パスワードが合っていれば
				if(password.equals(rs.getString("password"))){
					String str1 = rs.getString("password");
					String str2 = rs.getString("nickname");
					//ログイン成功となるので、その旨のJSONを作成する。
					loginresult.append(createLoginResultJSON(1, rs.getString("nickname"), successmessage));
				//パスワードが間違っていたら
				} else{
						//ログイン失敗となるので、その旨のJSONを作成する。
					loginresult.append(createLoginResultJSON(0, "", failmessage));
				}
			//レコードが取得できていないということで、このユーザは存在しないということとなる。
			} else {
				//ログイン失敗のメッセージのJSONを作成する。
				loginresult.append(createLoginResultJSON(0, "", failmessage));
			}
		//catchブロック。
		} catch (SQLException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();	//スタックトレースを出力する。
		}
		
		//ログイン結果のJSONを文字列の変数に格納する。
		String retresult = loginresult.toString();
			
		// JSONを書き出す
		out.print(retresult);
		// フラッシュする
		out.flush();
		// 出力ストリームを閉じる
		out.close();	
	}
}