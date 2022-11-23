import Axios from "axios";
import { useRouter } from "vue-router";

const request = Axios.create({
  baseURL: "/api", // 跨域
  paramsSerializer: {
    indexes: null,
  },
});


// 响应拦截器
request.interceptors.response.use(
  function (response) {
    const router = useRouter();
    switch (response.data.code) {
      case 40001:
        console.log({
          type: "error",
          message: response.data.message,
        });
        router.push({ path: "/login" }).then();
        break;
      case 50000:
        console.log({
          type: "error",
          message: response.data.message,
        });
        break;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default request;
