import { ref } from 'vue';
import { getContestScoreboard, type ContestRankVo } from '@/utils/api';

export function useContestScoreboard() {
  const loading = ref(false);
  const rows = ref<ContestRankVo[]>([]);
  const error = ref('');

  const fetchScoreboard = async (cid: string) => {
    loading.value = true;
    error.value = '';
    try {
      rows.value = await getContestScoreboard(cid);
    } catch (cause) {
      rows.value = [];
      error.value = cause instanceof Error ? cause.message : '获取排行榜失败';
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    rows,
    error,
    fetchScoreboard,
  };
}
