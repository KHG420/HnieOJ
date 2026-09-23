<template>
  <BoardCard title="Top 贡献" class="top-contribution-card">
    <template #icon>
      <n-icon size="22"><RibbonOutline /></n-icon>
    </template>

    <n-spin :show="loading">
      <n-alert v-if="error" type="error">{{ error }}</n-alert>
      <n-empty v-else-if="!rows.length" description="暂无社区贡献" style="padding: 40px 0" />
      <n-data-table v-else :columns="columns" :data="rows" :pagination="false" />
    </n-spin>

    <div class="card-footer">
      <div></div>
      <n-button text class="blue-link" @click="$router.push('/rank')">
        View all ->
      </n-button>
    </div>
  </BoardCard>
</template>

<script setup lang="ts">
import { RibbonOutline } from '@vicons/ionicons5';
import { onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import BoardCard from '@/components/BoardCard.vue';
import { getContributionRankings, type ContributionRankVo } from '@/utils/api';

const rows = ref<ContributionRankVo[]>([]);
const loading = ref(false);
const error = ref('');
const columns: DataTableColumns<ContributionRankVo> = [
  { title: '#', key: 'rank', width: 50 },
  { title: '用户', key: 'username' },
  { title: '贡献', key: 'contribution', width: 80 },
];
onMounted(async () => {
  loading.value = true;
  try { rows.value = (await getContributionRankings()).slice(0, 10); }
  catch (cause) { error.value = cause instanceof Error ? cause.message : '获取贡献榜失败'; }
  finally { loading.value = false; }
});
</script>

<style scoped lang="less">
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #fff;

  .blue-link {
    color: #2080f0;
    font-size: 13px;
    font-weight: 500;
    &:hover { text-decoration: underline; }
  }
}
</style>
