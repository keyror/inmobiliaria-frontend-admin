<template>
<div class="page-body">
    <CommonBreadcrumb title="Reports" page="Reports" />
    <div class="container-fluid">
        <div class="row report-summary">
            <div class="col-xl-8 xl-12">
                <div class="card sales-details">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="sales-status">
                                    <h5 class="light-font">Sales summary</h5>
                                    <div class="status-price">
                                        <h3> $16,230/- </h3>
                                        <span> last week
                                            <span class="font-success"> + 10%
                                                <Icon name="icon-park:trending-up" />
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div class="chart-legends">
                                    <ul>
                                        <li>
                                            <div class="bg-primary circle-label"></div>
                                            <span>Last week</span>
                                        </li>
                                        <li class="mt-1">
                                            <div class="bg-secondary circle-label"></div>
                                            <span>Running week</span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="last-updated light-box">
                                    <span>Last updated</span>
                                    <h5>Dec 26, 2023</h5>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <div class="monthly-sales">
                                    <div class="icon-box">
                                        <i class="fas fa-chevron-left light-font"></i>
                                    </div>
                                    <h6>Octobar, 2023</h6>
                                    <div class="icon-box">
                                        <i class="fas fa-chevron-right light-font"></i>
                                    </div>
                                </div>
                                <div class="bar-sales">
                                    <CommonChartBarchart />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ReportRevenue />
            <ReportSales/>
            <ReportTranaction/>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
