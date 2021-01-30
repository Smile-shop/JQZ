import Vue from 'vue';
import Component from 'vue-class-component';
import {List} from 'vant';

@Component({
  components: {
    List,
  },
})
export default class LoadMore extends Vue {
  // 数据列表
  public dataList: any[] = [];

  // 是否加载
  public isLoading: boolean = false;

  // 是否全部完成
  public isFinished: boolean = false;

  // 当前页数
  public pageNum: number = 1;

  // 显示数量
  public pageSize: number = 20;

  // 加载更多
  public async loadMore(isInit: boolean, selectData: () => Promise<any>) {
    if (isInit) {
      this.pageNum = 1;
      this.isFinished = false;
      document.documentElement!.scrollTop = 0;
    } else {
      this.pageNum++;
    }
    this.isLoading = true;
    const res = selectData();

    res.then((data: any) => {
      const {list, pageNum, pages} = data;
      this.pageNum = pageNum;

      // 分页处理
      if (pageNum >= pages) {
        this.isFinished = true;
      }

      if (pageNum > 1) {
        this.dataList.push(...list);
      } else {
        this.dataList = list;
      }

      // 加载完成
      this.isLoading = false;
    }).catch(reason => {
      // 加载完成
      this.isFinished = true;
      this.isLoading = false;
    });
  }
}
