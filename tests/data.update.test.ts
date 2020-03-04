process.env.FIRESTORE_EMULATOR_HOST = "localhost:58080";

import {FirestoreTestSupporter} from "firestore-test-supporter";
import * as firebase from "@firebase/testing";
import path from "path";

import TestData from "./TestData";

describe("データ更新テスト", () => {
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

    test('要件にあったデータの更新に成功', async () => {
        const db = supporter.getFirestoreWithAuth(admin_user);
        const doc = db.collection(collectionPath).doc(item_id);
        await firebase.assertSucceeds(doc.update(validUpdateData))
    });

    test('データ更新をリクエストしたユーザが商品管理者と一致しない場合は追加不可', async () => {
        const db = supporter.getFirestoreWithAuth("other_user");
        const doc = db.collection(collectionPath).doc(item_id);
        await firebase.assertFails(doc.update(validUpdateData))
    });

    test('商品管理者の変更不可', async () => {
        const other_user = "other_user";
        const db = supporter.getFirestoreWithAuth(other_user);
        const doc = db.collection(collectionPath).doc(item_id);

        // 商品管理者を変更したデータを作成
        const bad_data = {...validUpdateData, admin_user: other_user};
        await firebase.assertFails(doc.update(bad_data))
    });

    test('ロックされたデータの更新不可', async () => {
        const db = supporter.getFirestoreWithAuth(admin_user);
        const doc = db.collection(collectionPath).doc(item_id);

        // データをロック状態に設定
        const locked_data = {...validUpdateData, locked: true};
        await firebase.assertSucceeds(doc.update(locked_data));

        // ロックされたデータの更新に失敗
        const update_data = {...locked_data, price: 3000};
        await firebase.assertFails(doc.update(update_data));
    });

    test('商品名の変更不可', async () => {
        const db = supporter.getFirestoreWithAuth(admin_user);
        const doc = db.collection(collectionPath).doc(item_id);

        const bad_data = {...validUpdateData, title: "吾輩は犬ではない！"};
        await firebase.assertFails(doc.update(bad_data))
    });
});