<template>
  <div class="page-body">
    <CommonBreadcrumb :title=" props.isEditing ? 'Editar Tenant' : 'Crear Tenant'" page="Administrar Tenant"/>
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body admin-form">
              <div class="card-header ps-0">
                <h5> {{ props.isEditing ? 'Editar Tenant' : 'Crear Tenant' }}</h5>
              </div>
              <form class="row gx-3" @submit.prevent="sendForm" novalidate>

                <CommonInputfieldsTextfield
                    label="Nombre del tenant"
                    v-model="name"
                    :error="errors.name"
                    star="*"
                />

                <CommonInputfieldsTextfield
                    label="Correo electrónico"
                    v-model="email"
                    :error="errors.email"
                    star="*"
                />

                <CommonInputfieldsTextfield
                    label="Dominio"
                    v-model="domain"
                    :error="errors.domain"
                    star="*"
                />

                <CommonInputfieldsSelectfield
                    label="Plan"
                    :data="lookups[Constants.PLAN] || []"
                    v-model="plan_id"
                    :error="errors.plan_id"
                    star="*"
                />

                <CommonInputfieldsSelectfield
                    label="Estado"
                    :data="lookups[Constants.STATUS] || []"
                    v-model="status_id"
                    :error="errors.status_id"
                    star="*"
                />


                <div class="col-md-6 col-sm-6">
                  <label>Suscripción válida hasta <span class="font-danger">*</span></label>
                  <VueDatePicker
                      v-model="subscription_ends_at"
                      format="yyyy-MM-dd"
                      :model-type="'yyyy-MM-dd HH:mm:ss'"
                      :class="{ 'is-invalid': errors.subscription_ends_at }"
                      @closed="validateField('subscription_ends_at')"
                      :state="errors.subscription_ends_at ? false : null"
                  />
                  <small class="text-danger" v-if="errors.subscription_ends_at">
                    {{ errors.subscription_ends_at }}
                  </small>
                </div>

                <div class="form-btn mt-3">
                  <button type="submit" class="btn btn-pill btn-gradient color-4">Guardar</button>
                  <button type="button" class="btn btn-pill btn-dashed color-4" @click="resetForm()">Cancelar</button>
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
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import TenantService from "~/services/TenantService";
import { useApiHandler } from '~/composables/useApiHandler'
import { useTenantForm } from '~/composables/forms/useTenantForm'

import { getEstatus, getPlans } from "~/constants/Estatus";
import type {ILookup, ILookupsResponse} from "~/interfaces/ILookup";
import LookupService from "~/services/LookupService";
import type {IIndexLookupsRequest} from "~/interfaces/IIndexLookupsRequest";
import {Constants} from "~/constants/Constants";

const props = defineProps<{
  isEditing?: Boolean
}>()

const { run } = useApiHandler()

const route = useRoute()
const idTenant = route.params.id as string;
const lookups = ref<ILookupsResponse>({});

const categories = ref<IIndexLookupsRequest>({
  categories: [
    Constants.STATUS,
    Constants.PLAN,
  ]
});

const {
  handleSubmit,
  errors,
  defineField,
  resetForm,
  setErrors,
  validateField
} = useTenantForm()

const [name] = defineField('name');
const [email] = defineField('email');
const [domain] = defineField('domain');
const [plan_id] = defineField('plan_id');
const [status_id] = defineField('status_id');
const [subscription_ends_at] = defineField('subscription_ends_at');

const sendForm = handleSubmit(async (values) => {
  const promise = props.isEditing
      ? TenantService.updateTenant(idTenant, values)
      : TenantService.createTenant(values)

  const response = await run(promise, {
    setErrors,
    showSuccess: true,
    successMessage: props.isEditing
        ? 'Tenant actualizado correctamente'
        : 'Tenant creado correctamente'
  })

  if (response) {
    props.isEditing ? await getTenant() : resetForm()
  }
});

const getTenant = async () => {
  if (!props.isEditing) return;

  const response = await run(TenantService.showTenant(idTenant), {
    setErrors
  });

  if (response) {
    const data = response.data;

    resetForm({
      values: {
        name: data.name,
        email: data.email,
        domain: data.domain,
        plan_id: data.plan_id,
        status_id: data.status_id,
        subscription_ends_at: data.subscription_ends_at
      }
    });
  }
}

const getLookups = async () => {
  const response = await run( LookupService.getLookups(categories.value), {
    setErrors
  });

  if (response) {
    lookups.value = response.data;
  }
}

getLookups()
getTenant()
</script>
<style scoped>

</style>
