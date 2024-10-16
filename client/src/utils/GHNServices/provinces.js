import axios from "axios";

const config = {
  headers: {
    Token: "2bb7115f-8a45-11ef-8e53-0a00184fe694",
    ShopId: "194769",
  },
};
const getProvinces = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
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

export default getProvinces;
