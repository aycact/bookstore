import axios from "axios";

const config = {
  headers: {
    Token: "2bb7115f-8a45-11ef-8e53-0a00184fe694",
    ShopId: "194769",
  },
};
const getDistricts = async (provinceId) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
        { province_id: provinceId },
        config
      )
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default getDistricts;
