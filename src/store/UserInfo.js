import { observable, action } from 'mobx';
import storage from '../common/storage';
import { fecthUserLogin, fetchUserRegister, fetchUserUploadAvatar, fetchUserUpdateDesc } from '../common/api/users';

class UserInfo {
  @observable username;
  @observable avatarImg;
  @observable description = '';
  @observable accessToken;

  @action fetch = () => new Promise(async (resolve, reject) => {
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
      resolve();
    } catch (err) {
      console.log(`获取用户信息失败: ${JSON.stringify(err)}`);
      reject(err);
    }
  })

  @action login = (username, password) => new Promise(async (resolve, reject) => {
    try {
      const res = await fecthUserLogin({
        username,
        password,
      });
      const data = await res.json();
      const {
        code, accessToken, description, avatarImg,
      } = data;
      if (code === 0) {
        this.username = username;
        this.accessToken = accessToken;
        this.description = description;
        this.avatarImg = avatarImg;

        storage.save({
          key: 'userState',
          data: {
            username,
            accessToken,
            description,
            avatarImg,
          },
        });
        resolve(data);
      } else {
        reject(data);
      }
    } catch (err) {
      console.log(`存储用户信息失败: ${JSON.stringify(err)}`);
      reject(err);
    }
  })

  @action register = (username, password) => new Promise(async (resolve, reject) => {
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
  })

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
        console.log(`存储用户头像失败: ${JSON.stringify(err)}`);
        reject(err);
      }
    });
  }

  @action updateDesc = description => new Promise(async (resolve, reject) => {
    try {
      const res = await fetchUserUpdateDesc({
        description,
        username: this.username,
        accessToken: this.accessToken,
      });
      const data = await res.json();
      const { code } = data;
      if (code === 0) {
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
      console.log(`存储用户描述失败: ${JSON.stringify(err)}`);
      reject(err);
    }
  })

  @action setUsername = (val) => {
    this.username = val;
  }

  @action logout = () => new Promise(async (resolve, reject) => {
    this.username = '';
    this.avatarImg = '';
    this.description = '';
    this.accessToken = '';

    try {
      await storage.save({
        key: 'userState',
        data: {
          username: this.username,
          accessToken: this.accessToken,
          description: this.description,
          avatarImg: this.avatarImg,
        },
      });
      resolve();
    } catch (err) {
      console.log(`用户注销失败: ${JSON.stringify(err)}`);
      reject(err);
    }
  });
}

export default new UserInfo();
