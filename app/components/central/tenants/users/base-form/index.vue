<template>
  <div class="page-body">
    <CommonBreadcrumb
      :title="props.isEditing ? 'Editar' : 'Crear'"
      page="Usuarios del Tenant"
    />
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5>{{ props.isEditing ? "Editar Usuario" : "Crear Usuario" }}</h5>
              <button
                class="btn btn-pill btn-dashed color-4"
                type="button"
                @click="navigateTo(`/central/tenants/${tenantId}/users/all`)"
              >
                <i class="fa fa-arrow-left me-1"></i> Volver
              </button>
            </div>
            <div class="card-body admin-form">
              <form autocomplete="off" class="row gx-3" @submit.prevent="sendForm" novalidate>
                <CommonInputfieldsTextfield
                  autocomplete="off"
                  v-model="email"
                  :error="errors.email"
                  classes="col-md-6 col-sm-6"
                  label="Email"
                  placeholder="Ingrese el email"
                  type="email"
                  star="*"
                />
                <CommonInputfieldsTextfield
                  autocomplete="off"
                  v-model="password"
                  :error="errors.password"
                  classes="col-md-6 col-sm-6"
                  label="Contraseña"
                  placeholder="Ingrese la contraseña"
                  type="password"
                  :required="!props.isEditing"
                  :star="props.isEditing ? '' : '*'"
                />
                <CommonInputfieldsTextfield
                  autocomplete="off"
                  v-model="password_confirmation"
                  :error="errors.password_confirmation"
                  classes="col-md-6 col-sm-6"
                  label="Confirmar Contraseña"
                  placeholder="Confirme la contraseña"
                  type="password"
                  :required="!props.isEditing"
                  :star="props.isEditing ? '' : '*'"
                />
                <CommonInputfieldsSelectfield
                  v-model="status_type_id"
                  :error="errors.status_type_id"
                  classes="col-md-6 col-sm-6"
                  label="Estado"
                  :data="lookups[Constants.STATUS]"
                  star="*"
                />
                <CommonInputfieldsSelectfield
                  v-model="roles"
                  :error="errors.roles"
                  classes="col-md-6 col-sm-6"
                  label="Rol"
                  :data="rolesData"
                  :labelField="'name'"
                  :multiple="true"
                  star="*"
                />

                <div class="form-btn mt-3">
                  <button class="btn btn-pill btn-gradient color-4" type="submit">
                    {{ props.isEditing ? "Actualizar" : "Crear" }}
                  </button>
                  <button
                    class="btn btn-pill btn-dashed color-4"
                    type="button"
                    @click="resetForm()"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserForms } from "~/composables/forms/useUserForm";
import TenantUserService from "~/services/TenantUserService";
import { Constants } from "~/constants/Constants";

interface Props {
  isEditing?: boolean;
}
const props = withDefaults(defineProps<Props>(), { isEditing: false });

const { run } = useApiHandler();
const { lookups } = useLookups([Constants.STATUS]);
const { useUserCreateForm, useUserUpdateForm } = useUserForms();

const form = props.isEditing ? useUserUpdateForm() : useUserCreateForm();
const { handleSubmit, errors, defineField, resetForm, setErrors } = form;

const [email] = defineField("email");
const [password] = defineField("password");
const [password_confirmation] = defineField("password_confirmation");
const [status_type_id] = defineField("status_type_id");
const [roles] = defineField("roles");

const route = useRoute();
const tenantId = route.params.tenantId as string;
const userId = route.params.id as string;
const rolesData = ref<any[]>([]);

const sendForm = handleSubmit(async (values) => {
  const promise = props.isEditing
    ? TenantUserService.updateUser(tenantId, userId, values)
    : TenantUserService.createUser(tenantId, values);

  const response = await run(promise, {
    setErrors,
    showSuccess: true,
    successMessage: props.isEditing
      ? "Usuario actualizado correctamente"
      : "Usuario creado correctamente",
  });

  if (response) {
    props.isEditing ? await getUser() : resetForm();
  }
});

const getUser = async () => {
  if (!props.isEditing) return;

  const response = await run(TenantUserService.getUser(tenantId, userId), { setErrors });
  if (response) {
    const data = response.data;
    resetForm({
      values: {
        email: data.email,
        password: "",
        password_confirmation: "",
        status_type_id: data.status_type_id,
        roles: data.roles.map((role: any) => role.id),
      },
    });
  }
};

const getRoles = async () => {
  const response = await run(TenantUserService.getRoles(tenantId));
  if (response) {
    rolesData.value = response.data;
  }
};

getRoles();
getUser();
</script>

<style scoped></style>
