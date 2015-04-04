package test;	//テスト用パッケージ。

//入力エラー用の例外クラスをインポートする。
import java.io.IOException;
import java.io.PrintWriter;



import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;










import java.util.Map.Entry;






//サーブレットでのエラー用の例外クラスをインポートする。
import javax.servlet.ServletException;
//サーブレットのクラス群をインポートする。
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

//サーブレットのGetJSONクラスを宣言する。
public class SaveJSON extends HttpServlet {
	/**
	 * シリアルを発行する。
	 */
	private static final long serialVersionUID = 1560113726092507162L;

	/*
	 * 関数名:private String saveMyOption(String jsonString)
	 * 概要  :個人設定を保存する。
	 * 引数  :String jsonString:保存するデータを含んだJSON。
	 * 戻り値:String:処理が成功したか否かのJSONを返す。
	 * 作成日:2015.04.03
	 * 作成者:T.Masuda
	 */
	private String saveMyOption(String jsonString) throws JsonParseException, JsonMappingException, IOException, SQLException {
		//返却する値を返す変数を用意する。
		String retText = "";

		//JSON文字列をJavaのオブジェクトに変換するためのクラスのインスタンスを用意する。
		ObjectMapper mapper = new ObjectMapper();
		//JSONの文字列から連想配列を作成する。
		Map<Integer, String> jsonMap = mapper.readValue(jsonString, Map.class);
		
		//クエリを作る。
		String sql = createMergeSql(jsonMap, "setting");
		//クエリを実行し、レコードの保存を行う。
		int updated = DBManager.executeUpdateQuery(sql);
		
		//アップデートが行われていれば
		if(updated != 0){
			//成功の旨を伝えるJSONを返す。
			retText = "{\"issuccess\":\"1\",\"message\":\"保存に成功しました。\"}";
		//一件も変わらなければ
		} else {
			retText = "{\"issuccess\":\"0\",\"message\":\"保存に失敗しました。\"}";
		}
		
		//生成したテキストを返す。
		return retText;
	}

	/*
	 * 関数名:private String createMergeSql(Map jsonMap, String table)
	 * 概要  :Merge文のSQLを作る。
	 * 引数  :Map jsonMap:JSONを変換した連想配列。
	 * 		:String table:テーブル名。
	 * 戻り値:String:作成したクエリを返す。
	 * 作成日:2015.04.03
	 * 作成者:T.Masuda
	 */
	private String createMergeSql(Map<Integer, String> jsonMap, String table) throws SQLException {
		//ユーザIDから会員IDを取得するクエリを変数に格納する。
		String sql = "SELECT memberId FROM Login WHERE userId='" + jsonMap.get("userId") + "';";
		jsonMap.remove("userId");	//今後ユーザIDは邪魔になるので消す。
		//会員IDの入った結果セットを取得する。
		ResultSet rs = DBManager.getResultSet(sql);
		//結果セットのポインタを進める。
		rs.next();
		
		//会員IDを取得する。
		int serial = rs.getInt("memberId");
		//mapを操作する。
		
		//クエリ前半、中盤、後半部分の文字列となる文字列を持たせるStringBuilderのインスタンスを生成する。
		StringBuilder columns = new StringBuilder();
		StringBuilder values = new StringBuilder();
		StringBuilder updates = new StringBuilder();
		
		//columnsにクエリの先頭の文字列を入れる。
		columns.append("INSERT INTO " + table + " (memberId, ");
		//valuesにクエリの中盤に挟む文字列を入れる。
		values.append(") values(" + serial + ", ");
		//updadtesにクエリの後半頭の文字列を入れる。
		updates.append(") on duplicate key update memberId='" + serial + "', ");
		
		//jsonMapを走査する。
		for(Entry<Integer, String> entry : jsonMap.entrySet()){
			columns.append(entry.getKey() + ",");	//列名を入力する部分にキーを配置する。
			values.append("'"+entry.getValue() + "',");	//値を入力する部分に値を配置する。
			updates.append(entry.getKey() + "='" + entry.getValue() +"',");
		}
		
		//それぞれ最後のカンマを消す。
		columns.setLength(columns.length() - 1);
		values.setLength(values.length() - 1);
		updates.setLength(updates.length() - 1);
		
		//3つのStringBuilderの文字列を連結し、締めの文を加える。
		columns.append(values.toString() + updates.toString() + ";");
		return columns.toString();	//生成したクエリの文字列を返す。
	}

	static int getMemberId(String userId) throws SQLException{
		//ユーザIDから会員IDを取得するクエリを変数に格納する。
		String getMemberIdsql = "SELECT memberId FROM Login WHERE userId='" + userId + "';";
		//会員IDの入った結果セットを取得する。
		ResultSet rs = DBManager.getResultSet(getMemberIdsql);
		//結果セットのポインタを進める。
		rs.next();
		
		//会員IDを取得して返す。
		return rs.getInt("memberId");
	}

	/*
	 * 関数名:private String createSaveMyPhotoSql(Map jsonMap)
	 * 概要  :Myギャラリーの写真保存用のMerge文のSQLを作る。
	 * 引数  :Map jsonMap:JSONを変換した連想配列。
	 * 戻り値:String:作成したクエリを返す。
	 * 作成日:2015.04.03
	 * 作成者:T.Masuda
	 */
	private String createSaveMyPhotoSql(Map jsonMap) throws SQLException {
		//写真のIDを取得する。
		int id = Integer.parseInt((String) jsonMap.get("id"));
		String sql = "";
		//新規作成(idが0)であれば
		if(id == 0){
			//会員の連番IDを取得する。
			int memberId = getMemberId((String) jsonMap.get("userId"));
			jsonMap.remove("id");	//IDのキーを消す。
			//調整したjsonMapからMerge文のクエリを作る。
			sql = this.createMergeSql(jsonMap, "MyGallery");
			jsonMap.put("memberId", memberId);	//会員の連番IDを追加する。
		}else{
			//調整したjsonMapからMerge文のクエリを作る。
			sql = this.createMergeSql(jsonMap, "MyGallery");
		}
		
		return sql;	//作成したクエリを返す。
	}
	
	/*
	 * 関数名:private String saveMyPhoto(String jsonString)
	 * 概要  :MyGalleryの写真を保存する。
	 * 引数  :保存するデータを含んだJSON。
	 * 戻り値:String:処理が成功したか否かのJSONを返す。
	 * 作成日:2015.04.03
	 * 作成者:T.Masuda
	 */
	private String saveMyPhoto(String jsonString) throws JsonParseException, JsonMappingException, IOException, SQLException {
		//返却する値を返す変数を用意する。
		String retText = "";
		
		//JSON文字列をJavaのオブジェクトに変換するためのクラスのインスタンスを用意する。
		ObjectMapper mapper = new ObjectMapper();
		//JSONの文字列から連想配列を作成する。
		Map<Integer, String> jsonMap = mapper.readValue(jsonString, Map.class);
		
		//クエリを作る。
		String sql = createSaveMyPhotoSql(jsonMap);
		//クエリを実行し、レコードの保存を行う。
		int updated = DBManager.executeUpdateQuery(sql);
		
		//アップデートが行われていれば
		if(updated != 0){
			//新規作成であったら
			if(jsonMap.containsKey("memberId")){
				String j = String.valueOf(jsonMap.get("memberId"));
				//最新の写真のIDを取得するクエリを準備する。
				String getCurrentId = "SELECT * FROM MyGallery AS m1 WHERE postDate = (SELECT MAX(postDate) FROM MyGallery AS m2 WHERE m1.memberId = m2.memberId) AND m1.memberId =" + j + ";";
				ResultSet rs = DBManager.getResultSet(getCurrentId);	//最新のレコードを取得する。
				rs.next();	//結果セットのポインタを値が取得できるところへ進める。
				//成功の旨を伝えるJSONを返す。作成したレコードのIDもisnewのキーに設定する。
				retText = "{\"issuccess\":\"1\",\"message\":\"保存に成功しました。\",\"isnew\":\"" + rs.getInt("id") + "\"}";
			//そうでなければ
			} else {
				//成功の旨を伝えるJSONを返す。
				retText = "{\"issuccess\":\"1\",\"message\":\"保存に成功しました。\",\"isnew\":\"0\"}";
			}
		//一件も変わらなければ
		} else {
			retText = "{\"issuccess\":\"0\",\"message\":\"保存に失敗しました。\",\"isnew\":\"0\"}";
		}
		
		//生成したテキストを返す。
		return retText;
	}
	
	//POSTメソッドで通信する。
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
		    throws ServletException, IOException {
		//テキストを出力する準備をする。
		PrintWriter out = response.getWriter();
		//返却するテキストを格納する変数を宣言、初期化する。
		String retText = "";
		
		//コンテンツ番号を取得する。
		int contentNum = Integer.parseInt(request.getParameter("contentNum"));
		//保存用JSONを取得する。
		String jsonString = request.getParameter("json");
		
		//SQLExceptionのtryブロック
		try {	
			//コンテンツ番号で処理を分岐する。
			switch(contentNum){
				//1であれば、Myギャラリーのデータの保存を行う。
				case 1: retText = saveMyPhoto(jsonString);
						break;	//switchを抜ける。
				//2であれば、個人設定の変更を保存する。
				case 2:
					retText = saveMyOption(jsonString);
						break;	//switchを抜ける。
				//どれでもなければ何もしない。
				default:break;
			}
		} catch (SQLException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}
		
		//保存メソッドから返却された値を出力する。
		out.print(retText);
		//出力ストリームを閉じる。
		out.close();
	}
}