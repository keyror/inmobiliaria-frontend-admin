<template>
    <div class="table-responsive invoice-table custom-scrollbar">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Decription</th>
                    <th>Deposit</th>
                    <th>Rate</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        Residences can be classified in residence.
                    </td>
                    <td>
                        $400
                    </td>
                    <td>
                        $580
                    </td>
                    <td>
                        $800.00
                    </td>
                </tr>
                <tr>
                    <td>
                        Residences can be classified in residence.
                    </td>
                    <td>
                        $300
                    </td>
                    <td>
                        $450
                    </td>
                    <td>
                        $900.00
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>
                        <h6 class="mb-0">Total</h6>
                    </td>
                    <td>
                        <h6 class="mb-0">$1800.00</h6>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="row invoice-note">
        <div class="col-md-4">
            <div>
                <img src="/image/signature/3.png" class="img-fluid" alt="">
            </div>
        </div>
        <div class="col-md-8 text-md-end">
            <p class="legal"><strong>Thank you for your business!</strong>&nbsp; Payment is expected within 31 days; please process this invoice within that time. There will be a 5% interest charge per month on late invoices.</p>
        </div>
        <div class="col-sm-12 text-center mt-3">
            <button type="button" class="btn btn-pill btn-gradient color-4" @click="getprint()">Print</button>
            <button type="button" class="btn btn-pill btn-dashed color-4 ms-2">cancel</button>
        </div>
    </div>
</template>

<script setup lang="ts">
function getprint(){
    window.print();
}
</script>

<style scoped>

</style>