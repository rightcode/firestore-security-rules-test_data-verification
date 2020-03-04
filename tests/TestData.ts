class TestData {
    // コレクションパスの取得
    static getCollectionPath() {
        return "items"
    }

    // 商品IDの取得
    static getItemId() {
        return "XXXXXXXXXX"
    }

    // 商品タイトルの取得
    static getTitle() {
        return "吾輩は犬である！"
    }

    // 商品管理者の取得
    static getAdminUser() {
        return "fuyutsuki";
    }

    // 初期データの取得
    static getInitialData() {
        return {
            item_id: this.getItemId(),
            title: this.getTitle(),
            admin_user: this.getAdminUser(),
            price: 1000,
            description: "猫じゃないよ。犬だよ。",
            locked: false,
            sold_out: false
        }
    }

    // 要件に沿った更新データの取得
    static getValidUpdateData() {
        return {
            item_id: this.getItemId(),
            title: this.getTitle(),
            admin_user: this.getAdminUser(),
            price: 12000,
            description: "猫が好きです。でも犬はも～っと好きです。",
            locked: false,
            sold_out: false
        };
    }
}

export default TestData;