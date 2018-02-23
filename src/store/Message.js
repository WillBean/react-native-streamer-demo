import { observable, action } from 'mobx';

class Message {
  @observable chatList = [];
  @observable number = 0;

  @action push(chat) {
    if (this.chatList.length > 20) {
      const list = this.chatList.slice(1, this.chatList.length);
      list.push(chat);
      this.chatList = list;
    }
  }
}

export default new Message();
