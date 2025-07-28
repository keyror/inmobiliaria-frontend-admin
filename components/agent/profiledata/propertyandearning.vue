<template>
   <UserProfilePropertyandlearning/>
   <div class="col-xl-3 xl-6 col-md-12">
    <div class="row">
        <div class="buyer-chart col-xl-12 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="title-about">
                        <h5>Total users</h5>
                    </div>
                    <div class="total-container">
                        <div id="userchart">
                            <CommonChartUsers/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-12 col-md-6">
            <div class="card timeline-card timeline-agent">
                <div class="card-body">
                   <div class="partner-info">
                       <div class="title-about">
                           <h5>Monthly installment</h5>
                       </div>
                       <div class="timeline-pay">
                           <ul>
                               <li class="pay">
                                   <div>
                                       <i class="fas fa-check-circle"></i>
                                       <span>Oct 18</span>
                                   </div>
                               </li>
                               <li>
                                   <div>
                                       <i class="fas fa-check-circle"></i>
                                       <span>Sep 25</span>
                                   </div>
                               </li>
                               <li>
                                   <div>
                                       <i class="fas fa-check-circle"></i>
                                       <span>Aug 10</span>
                                   </div>
                               </li>
                           </ul>
                           <div class="timeline-right">
                               <h5 class="mb-0">$4.500</h5>
                               <nuxt-link to="/agent/invoice">
                                   View Details
                               </nuxt-link>
                           </div>
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