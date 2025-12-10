import axios from "axios";

const PRODUCT_SERVICE_URL = "http://product-service:3004"; 
// hoặc http://localhost:3002 nếu bạn đang chạy local

export class ProductClient {
    static async getVariantById(id: string) {
        try {
            const res = await axios.get(`${PRODUCT_SERVICE_URL}/product-variants/${id}`);
            return res.data;
        } catch (err) {
            return null;
        }
    }
}

