import { observable, action } from 'mobx';
import { fetchLiveList } from '../common/api/lives';

class Lives {
  @observable start = 0;
  @observable step = 10;
  @observable active = true;
  @observable end = false;
  @observable list = [];

  @action fetch = () => new Promise(async (resolve) => {
    const { start, step, active } = this;
    const res = await fetchLiveList({
      start,
      step,
      active,
    });
    const data = await res.json();
    this.start += data.lists.length;
    this.end = data.end;
    this.list = this.list.concat(data.lists);
    resolve();
  })

  @action refresh = () => new Promise(async (resolve) => {
    const { list, step, active } = this;
    const res = await fetchLiveList({
      start: 0,
      step: list.length + step,
      active,
    });
    const data = await res.json();
    this.list = data.lists;
    resolve();
  })
}

export default new Lives();
