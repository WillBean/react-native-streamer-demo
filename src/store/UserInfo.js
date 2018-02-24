import { observable, action } from 'mobx';
import storage from '../common/storage';
import { fecthUserLogin, fetchUserRegister, fetchUserUploadAvatar, fetchUserUpdateDesc } from '../common/api/users';

class UserInfo {
  @observable username = 'WillBean';
  @observable avatarImg;
  @observable description;
  @observable accessToken = '5a8d37df88730b6201553401';

  @action fetch = async () => {
    // 从storage获取
    try {
      const data = await storage.load({
        key: 'userState',
        autoSync: false,
      });
      const {
        username, avatarImg, description, accessToken,
      } = data;
      this.username = username;
      this.accessToken = accessToken;
      this.avatarImg = avatarImg;
      this.description = description;
    } catch (err) {
      console.log(`获取用户信息失败: ${err}`);
    }
  }

  @action login = (username, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fecthUserLogin({
          username,
          password,
        });
        const data = await res.json();
        const { code, accessToken } = data;
        if (code === 0) {
          this.username = username;
          this.accessToken = accessToken;

          storage.save({
            key: 'userState',
            data: {
              username,
              accessToken,
              description: this.description,
              avatarImg: this.avatarImg,
            },
          });
          resolve(data);
        } else {
          reject(data);
        }
      } catch (err) {
        console.log(`存储用户信息失败: ${err}`);
        reject(err);
      }
    });
  }

  @action register = (username, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetchUserRegister({
          username,
          password,
        });
        const data = await res.json();
        const { code } = data;
        if (code === 0) {
          this.username = username;
          resolve(data);
        } else {
          reject(data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  @action avatar = (body) => {
    body.append('username', this.username);
    body.append('accessToken', this.accessToken);
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetchUserUploadAvatar(body);
        const data = await res.json();
        const { code, avatarImg } = data;
        if (code === 0) {
          this.avatarImg = avatarImg;

          storage.save({
            key: 'userState',
            data: {
              username: this.username,
              accessToken: this.accessToken,
              description: this.description,
              avatarImg,
            },
          });
          resolve(data);
        } else {
          reject(data);
        }
      } catch (err) {
        console.log(`存储用户头像失败: ${err}`);
        reject(err);
      }
    });
  }

  @action updateDesc = (description) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetchUserUpdateDesc({
          description,
          username: this.username,
          accessToken: this.accessToken,
        });
        const data = await res.json();
        const { code, avatarImg } = data;
        if (code === 0) {
          this.avatarImg = avatarImg;

          storage.save({
            key: 'userState',
            data: {
              username: this.username,
              accessToken: this.accessToken,
              description,
              avatarImg: this.avatarImg,
            },
          });
          resolve(data);
        } else {
          reject(data);
        }
      } catch (err) {
        console.log(`存储用户描述失败: ${err}`);
        reject(err);
      }
    });
  }
}

export default new UserInfo();
