<template>
  <div class="requests-table">
    <div
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <!-- eslint-disable max-len -->
            <th :title="'create-sale-requests.sale-name-header' | globalize">
              {{ 'create-sale-requests.sale-name-header' | globalize }}
            </th>
            <th :title="'create-sale-requests.asset-code-header' | globalize">
              {{ 'create-sale-requests.asset-code-header' | globalize }}
            </th>
            <th :title="'create-sale-requests.request-state-header' | globalize">
              {{ 'create-sale-requests.request-state-header' | globalize }}
            </th>
            <th :title="'create-sale-requests.created-header' | globalize">
              {{ 'create-sale-requests.created-header' | globalize }}
            </th>
            <th :title="'create-sale-requests.last-updated-header' | globalize">
              {{ 'create-sale-requests.last-updated-header' | globalize }}
            </th>
            <!-- eslint-enable max-len -->
          </tr>
        </thead>

        <tbody
          v-if="requests.length"
        >
          <tr
            v-for="request in requests"
            :key="request.id"
          >
            <td :title="request.name">
              {{ request.name }}
            </td>

            <td :title="request.baseAsset">
              {{ request.baseAsset }}
            </td>

            <td>
              <request-state-viewer :request="request" />
            </td>

            <td :title="request.createdAt | formatCalendar">
              {{ request.createdAt | formatCalendar }}
            </td>

            <td :title="request.updatedAt | formatCalendar">
              {{ request.updatedAt | formatCalendar }}
            </td>

            <td>
              <a
                class="requests-table__details-btn"
                @click="$emit(EVENTS.select, request)"
              >
                {{ 'create-sale-requests.details-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
        <empty-tbody-placeholder
          v-else
          :colspan="6"
          :message="'create-sale-requests.no-request-history-desc' | globalize"
        />
      </table>
    </div>
  </div>
</template>

<script>
import RequestStateViewer from '../../shared/components/request-state-viewer'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'requests-table',
  components: {
    RequestStateViewer,
    EmptyTbodyPlaceholder,
  },

  props: {
    requests: {
      type: Array,
      required: true,
    },
  },

  data: _ => ({
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.requests-table tr td:last-child {
  width: 3rem;
  text-align: right;
}

.requests-table__details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}
</style>
