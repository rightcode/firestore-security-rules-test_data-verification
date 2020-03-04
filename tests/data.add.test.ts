// Firestoreエミュレータのホストとポートを指定
process.env.FIRESTORE_EMULATOR_HOST = "localhost:58080";

import {FirestoreTestSupporter} from "firestore-test-supporter";
import * as firebase from "@firebase/testing";
import path from "path";

// テストデータクラスの読み込み
import TestData from "./TestData";

describe("データ追加テスト", () => {
    const supporter = new FirestoreTestSupporter("my-test-project", path.join(__dirname, "firestore.rules"));

    // テストデータを変数に設定
    const collectionPath = TestData.getCollectionPath();
    const item_id = TestData.getItemId();
    const initialData = TestData.getInitialData();
    const admin_user = TestData.getAdminUser();

    beforeEach(async () => {
        // セキュリティルールの読み込み
        await supporter.loadRules();
    });

    afterEach(async () => {
        // データのクリーンアップ
        await supporter.cleanup();
    });

    test('要件にあったデータの追加に成功', async () => {
        const db = supporter.getFirestoreWithAuth(admin_user);
        const doc = db.collection(collectionPath).doc(item_id);
        await firebase.assertSucceeds(doc.set(initialData))
    });

    test('データ追加をリクエストしたユーザが商品管理者と一致しない場合は追加不可', async () => {
        // 商品管理者と異なるユーザで認証
        const db = supporter.getFirestoreWithAuth("other_user");

        const doc = db.collection(collectionPath).doc(item_id);
        await firebase.assertFails(doc.set(initialData))
    });
});