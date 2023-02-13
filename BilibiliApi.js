const HTTP_HEADER = {
  "User-Agent": ""
};
class HttpUtil {
  constructor() {
    this.Cookie = undefined;
  }
  get(url, header) {
    return new Promise((resolve, reject) => {
      if (header.cookie !== undefined) {
        this.Cookie = header.cookie;
      }
      $http.get({
        url,
        header,
        handler: resp => {
          const { error, data, response } = resp,
            setCookieStr = response.headers["Set-Cookie"];
          $console.info({
            resp
          });
          if (error) {
            reject(error);
          } else {
            if (setCookieStr !== undefined && setCookieStr.length > 0) {
              this.Cookie = this.getCookieBySetcookie(setCookieStr);
            }
            resolve(data);
          }
        }
      });
    });
  }
  getResp(url, header) {
    return new Promise((resolve, reject) => {
      if (header.cookie !== undefined) {
        this.Cookie = header.cookie;
      }
      $http.get({
        url,
        header,
        handler: resp => {
          const { error, response } = resp,
            setCookieStr = response.headers["Set-Cookie"];
          $console.info({
            resp
          });
          if (error) {
            reject(resp);
          } else {
            if (setCookieStr !== undefined && setCookieStr.length > 0) {
              this.Cookie = this.getCookieBySetcookie(setCookieStr);
            }
            resolve(resp);
          }
        }
      });
    });
  }
  getCookieBySetcookie(setCookieStr) {}
}
class AccountLoginApi {
  constructor() {
    this.Cookie = undefined;
    this.Http = new HttpUtil();
  }
  getLoginQrcode() {
    return new Promise((resolve, reject) => {
      const url =
        "https://passport.bilibili.com/x/passport-login/web/qrcode/generate";
      this.Http.get(url).then(
        result => {
          if (result !== undefined || result.code == 0) {
            resolve(result.data);
          } else {
            reject(result);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
  loginByQrcode(qrcode_key) {
    return new Promise((resolve, reject) => {
      const url =
        "https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${qrcode_key}";
      this.Http.getResp(url).then(
        resp => {
          const result = resp.data;
          if (result !== undefined || result.code == 0) {
            const loginResult = result.data;
            if (loginResult.code === 0) {
              loginResult["setCookie"] = resp.response.headers["Set-Cookie"];
              resolve(loginResult);
            } else {
              reject(loginResult);
            }
          } else {
            reject(result);
          }
        },
        resp => {
          reject(resp.error);
        }
      );
    });
  }
}
class WatchHistoryApi {
  constructor(cookie) {
    this.Http = new HttpUtil();
    this.Cookie = cookie;
  }
  getWatchHistory(pageSize = 30) {
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/web-interface/history/cursor?ps=${pageSize}`;
      this.Http.get(url, {
        cookie: this.Cookie
      }).then(
        result => {
          if (result !== undefined || result.code == 0) {
            resolve(result.data);
          } else {
            resolve(result);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
  getLaterToWatch(pageSize = 30) {
    return new Promise((resolve, reject) => {
      const url = `https://api.bilibili.com/x/web-interface/history/cursor?ps=${pageSize}`;
      this.Http.get(url,{
        cookie: this.Cookie
      }).then(
        result => {
          if (result !== undefined || result.code == 0) {
            resolve(result.data);
          } else {
            resolve(result);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
module.exports = {
  AccountLoginApi,
  WatchHistoryApi
};
