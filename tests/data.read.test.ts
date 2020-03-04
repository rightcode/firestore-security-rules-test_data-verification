process.env.FIRESTORE_EMULATOR_HOST = "localhost:58080";

import {FirestoreTestSupporter} from "firestore-test-supporter";
import * as firebase from "@firebase/testing";
import path from "path";

import TestData from "./TestData";

describe("データ取得テスト", () => {
    const supporter = new FirestoreTestSupporter("my-test-project", path.join(__dirname, "firestore.rules"));

    const collectionPath = TestData.getCollectionPath();
    const item_id = TestData.getItemId();
    const initialData = TestData.getInitialData();
    const validUpdateData = TestData.getValidUpdateData();
    const admin_user = TestData.getAdminUser();

    beforeEach(async () => {
        await supporter.loadRules();

        // 初期データを追加
        const db = supporter.getFirestoreWithAuth(admin_user);
        const doc = db.collection(collectionPath).doc(item_id);
        await doc.set(initialData)
    });

    afterEach(async () => {
        await supporter.cleanup();
    });

    test('要件にあったデータの取得に成功', async () => {
        // 任意のユーザで認証
        const db = supporter.getFirestoreWithAuth("any_user");
        const doc = db.collection(collectionPath).doc(item_id);
        await firebase.assertSucceeds(doc.get())
    });
    test('認証されていないユーザのデータ取得不可', async () => {
        const db = supporter.getFirestore();
        const doc = db.collection(collectionPath).doc(item_id);
        await firebase.assertFails(doc.get())
    });
    test('売り切れ商品のデータ取得不可', async () => {
        const db = supporter.getFirestoreWithAuth(admin_user);
        const doc = db.collection(collectionPath).doc(item_id);

        // データを売り切れに設定
        const sold_out_data = {...validUpdateData, sold_out: true};
        await firebase.assertSucceeds(doc.set(sold_out_data));

        await firebase.assertFails(doc.get())
    })
});