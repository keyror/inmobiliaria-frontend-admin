<template>
    <div class="page-body">
        <CommonBreadcrumb title="Add agent wizard" page="Agents"/>
        <div class="container-fluid property-wizard horizontal-wizard">
            <div class="row wizard-box">
                <div class="col-lg-12">
                    <div class="card"> 
                        <div class="card-body admin-wizard">
                            <ClientOnly>
                            <form-wizard  step-size="xs">
                                <tab-content title="Get started">
                                  <UserFormwizardFirsttab/>
                                </tab-content>
                                <tab-content title="Login details" >
                                  <UserFormwizardSecondtab/>
                                </tab-content>
                                <tab-content title="Upload files" >
                                 <UserFormwizardThirdtab/>
                                </tab-content>
                            </form-wizard>
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {FormWizard,TabContent} from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css'
</script>

<style scoped>

</style>