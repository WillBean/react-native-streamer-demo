import { observable, action } from 'mobx';
import { fetchLiveList } from '../common/api/lives';

class Lives {
  @observable start = 0;
  @observable step = 10;
  @observable active = true;
  @observable end = false;
  @observable list = [];

  @action async fetch() {
    const { start, step, active } = this;
    const res = await fetchLiveList({
      start,
      step,
      active,
    });
    const data = await res.json();
    this.start += data.list.length;
    this.end = data.end;
    this.list = this.list.concat(data.list);
  }
}

export default new Lives();
