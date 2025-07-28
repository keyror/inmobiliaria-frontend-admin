<template>
  <div class="page-body">
    <CommonBreadcrumb title="Payments" page="Payments" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header pb-0">
              <h5>Payment lists</h5>
            </div>
            <div class="card-body payment-table">
              <div id="batchDelete" class="transactions table-responsive custom-scrollbar">
                <table class="table table-bordered table-striped text-center table-hover cursor-pointer">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Property Name</th>
                      <th>Rates</th>
                      <th>Deposit</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in tabledata" :key="index">
                      <td>{{ item.id }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.Rates }}</td>
                      <td>{{ item.Deposit }}</td>
                      <td>{{ item.Type }}</td>
                      <td>{{ item.Date }}</td>
                      <td class="jsgrid-cell">
                        <span>
                          {{ item.Status }}
                        </span>
                      </td>
                      <td>{{ item.Amount }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface table {
  id: string;
  name: string;
  Date: string;
  Rates: string;
  Deposit: string;
  Type: string;
  Status: string;
  Amount: string;
}
const tabledata = ref<table[]>([]);
const { data } = await useFetch(baseUrl + "/data/payment.json");
watchEffect(() => {
  if (data.value) {
    tabledata.value = data.value.paymentdata || [];
  }
});
</script>

<style scoped></style>
