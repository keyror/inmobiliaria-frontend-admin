import { useLoadingStore } from "@/store/loading";

class LoadingService {
  private get store() {
    return useLoadingStore();
  }

  get isLoading() {
    return this.store.isLoading;
  }

  show() {
    this.store.show();
  }

  hide() {
    this.store.hide();
  }
}

export default new LoadingService();
