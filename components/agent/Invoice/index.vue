<template>
    <div class="page-body">
        <CommonBreadcrumb title="Invoice" page="Agents"/>
        <div class="container-lg">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="invoice">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="invoice-logo">
                                            <img src="/image/logo/4.png" class="img-fluid for-light" alt="">
                                            <img src="/image/logo/9.png" class="img-fluid for-dark" alt="">
                                           <span class="d-block mt-1">hello@sheltos.in</span>
                                           <span class="d-block">289-335-6503</span>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="text-md-end">
                                            <h3>Invoice #5170</h3>
                                            <p class="mb-0">Issued: May<span class="digits"> 18, 2023</span><br>
                                                Payment Due: July <span class="digits">20, 2023</span></p>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="address-invoice">
                                    <div class="light-box row m-0">
                                        <div class="col-md-6">
                                            <div>
                                                <h6 class="light-font">Invoice for</h6>
                                                <h5>Bob Frapples</h5>
                                                <p class="mb-0 light-font">Mina Road, Dubai, United Arab Emirates</p>
                                                <p class="mb-0 light-font">Mobile no: +61 052145008</p>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div>
                                                <h6 class="light-font">Invoice from</h6>
                                                <h5>Zack Lee</h5>
                                                <p class="mb-0 light-font">Mina Road, Dubai, United Arab Emirates</p>
                                                <p class="mb-0 light-font">Mobile no: +61 84521410</p>
                                            </div>
                                        </div>
                                    </div>                                    
                                </div>
                                <AgentInvoiceDetails/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>