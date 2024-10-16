import axios from "axios";

const config = {
  headers: {
    Token: "2bb7115f-8a45-11ef-8e53-0a00184fe694",
    ShopId: "194769",
  },
};
const getWards = async (districtId) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id",
        { district_id: districtId },
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

export default getWards;
