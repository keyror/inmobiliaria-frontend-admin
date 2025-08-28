<template>
  <div class="page-body">
    <CommonBreadcrumb title="Crear Tenant" page="Administrar Tenant"/>
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header pb-0">
              <h5>Agregar información</h5>
            </div>
            <div class="card-body admin-form">
              <form class="row gx-3" @submit.prevent="createTenant">

                <CommonInputfieldsTextfield
                    label="Nombre del tenant"
                    placeholder="Ingrese el nombre del tenant"
                    classes="col-md-6 col-sm-6"
                    v-model="form.name"
                    star="*"
                />

                <CommonInputfieldsTextfield
                    label="Correo electrónico"
                    placeholder="Ingrese el correo del tenant"
                    classes="col-md-6 col-sm-6"
                    v-model="form.email"
                    :clean="true"
                    star="*"
                />

                <CommonInputfieldsTextfield
                    label="Dominio"
                    placeholder="Ingrese el dominio del tenant"
                    classes="col-md-6 col-sm-6"
                    v-model="form.domain"
                    :clean="true"
                    star="*"
                />

                <CommonInputfieldsStatusfield
                    label="Plan"
                    show="Seleccione un plan"
                    classes="col-md-6 col-sm-6"
                    :data="plans"
                    v-model="form.plan"
                    star="*"
                />

                <CommonInputfieldsStatusfield
                    label="Estado"
                    show="Seleccione un estado"
                    classes="col-md-6 col-sm-6"
                    :data="statuses"
                    v-model="form.status"
                    star="*"
                />


                <div class="col-md-6 col-sm-6">
                  <label>Suscripción válida hasta <span class="font-danger">*</span></label>
                  <VueDatePicker
                      v-model="form.subscription_ends_at" format="yyyy-MM-dd"
                      :model-type="'yyyy-MM-dd HH:mm:ss'"
                  />
                </div>

                <div class="form-btn mt-3">
                  <button type="submit" class="btn btn-pill btn-gradient color-4">Guardar</button>
                  <button type="button" class="btn btn-pill btn-dashed color-4" @click="resetForm">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import TenantService from "~/services/TenantService";
import AlertaService from "~/services/AlertService";
import LoadingService from "~/services/LoadingService";
import {getEstatus, getPlans} from "~/constants/Estatus";

const initialForm = {
  name: "",
  email: "",
  domain: "",
  plan: "",
  status: "",
  subscription_ends_at: null
}

const form = ref({ ...initialForm })
const plans: string[] = getPlans();
const statuses: string[] = getEstatus();

const createTenant = async () => {
  LoadingService.show()

  const body = ref({
    name: form.value.name,
    email: form.value.email,
    domain: form.value.domain,
    plan: form.value.plan,
    status: form.value.status,
    subscription_ends_at: form.value.subscription_ends_at
  })

  TenantService.createTenant(body.value)
      .then((response) => {
        LoadingService.hide()
        AlertaService.showSuccess('Operación exitosa', response.message)
        resetForm()
      }).catch((error) => {
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}

const resetForm = () => {
  form.value = { ...initialForm }
}
</script>
