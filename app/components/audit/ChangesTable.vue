<template>
  <template v-if="hasOld">
    <div class="table-responsive audit-changes-table">
      <table class="table table-sm table-bordered mb-0">
        <thead>
          <tr>
            <th>Campo</th>
            <th class="text-danger">Antes</th>
            <th class="text-success">Después</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(oldVal, key) in props.log.properties?.old"
            :key="String(key)"
          >
            <td>{{ labelField(String(key)) }}</td>
            <td class="text-danger font-monospace small">
              {{ formatValue(oldVal) }}
            </td>
            <td class="text-success font-monospace small">
              {{ formatValue(props.log.properties?.attributes?.[key]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <template v-else-if="hasAttributes">
    <div class="table-responsive audit-changes-table">
      <table class="table table-sm table-bordered mb-0">
        <thead>
          <tr>
            <th>Campo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(val, key) in props.log.properties?.attributes"
            :key="String(key)"
          >
            <td>{{ labelField(String(key)) }}</td>
            <td class="font-monospace small">{{ formatValue(val) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <template v-else>
    <p class="text-muted small mb-0">Sin cambios registrados.</p>
  </template>
</template>

<script setup lang="ts">
import { labelField } from "~/constants/AuditFieldLabels";

import type { IAuditLog } from "~/interfaces/IAuditLog";

interface Props {
  log: IAuditLog;
}

const props = defineProps<Props>();

const hasOld = computed(
  () =>
    !!props.log.properties?.old &&
    Object.keys(props.log.properties.old).length > 0,
);

const hasAttributes = computed(
  () =>
    !!props.log.properties?.attributes &&
    Object.keys(props.log.properties.attributes).length > 0,
);

const formatValue = (val: unknown): string => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
};
</script>

<style>
.audit-changes-table table {
  font-size: 0.82rem;
}

body.dark-layout .audit-changes-table table {
  color: rgba(255, 255, 255, 0.82);
  border-color: #383434;
}

body.dark-layout .audit-changes-table table th {
  background-color: #2a2a2a;
  color: rgba(255, 255, 255, 0.9);
  border-color: #383434;
}

body.dark-layout .audit-changes-table table td {
  background-color: #232323;
  color: rgba(255, 255, 255, 0.78);
  border-color: #383434;
}

body.dark-layout .audit-changes-table table tr:nth-child(even) td {
  background-color: #1e1e1e;
}
</style>
