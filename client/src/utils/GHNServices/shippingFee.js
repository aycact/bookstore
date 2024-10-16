import axios from "axios";

const config = {
  headers: {
    Token: "2bb7115f-8a45-11ef-8e53-0a00184fe694",
    ShopId: "194769",
  },
};
const getShippingFee = async (toDistrictId) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          from_district_id: 1455,
          from_ward_code: "",
          service_id: 53321,
          service_type_id: 2,
          to_district_id: toDistrictId,
          to_ward_code: "",
          height: 50,
          length: 20,
          weight: 500,
          width: 20,
          insurance_value: 10000,
          cod_failed_amount: 2000,
          coupon: null,
        },
        config
      )
      .then((res) => {
        resolve(res.data.data.total);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default getShippingFee;
