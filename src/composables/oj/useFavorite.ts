import { ref, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { addFavorite, checkFavorite, removeFavorite, type FavoriteType } from '@/utils/api';

export function useFavorite(type: FavoriteType, getId: () => string) {
  const message = useMessage();
  const saved = ref(false);
  const loading = ref(false);
  let seq = 0;
  watch(getId, async id => {
    const current = ++seq;
    saved.value = false;
    if (!id) return;
    try {
      const value = await checkFavorite(type, id);
      if (current === seq) saved.value = value;
    } catch (cause) {
      if (current === seq) message.error(cause instanceof Error ? cause.message : '读取收藏状态失败');
    }
  }, { immediate: true });
  const toggle = async () => {
    const id = getId();
    if (!id || loading.value) return;
    loading.value = true;
    try {
      if (saved.value) await removeFavorite(type, id);
      else await addFavorite(type, id);
      saved.value = !saved.value;
      message.success(saved.value ? '已收藏' : '已取消收藏');
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : '收藏操作失败');
    } finally { loading.value = false; }
  };
  return { saved, loading, toggle };
}
