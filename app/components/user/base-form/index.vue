<template>
  <div class="page-body">
    <CommonBreadcrumb
      :title="props.isEditing ? 'Editar' : 'Crear'"
      page="Administrar Usuario"
    />
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <h5>
                {{ props.isEditing ? "Editar Usuario " : "Crear Usuario" }}
              </h5>
            </div>
            <div class="card-body admin-form">
              <form
                autocomplete="off"
                class="row gx-3"
                @submit.prevent="sendForm"
                novalidate
              >
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

                <!-- Sucursales -->
                <template v-if="branchStore.branchesEnabled">
                  <div class="col-12 mt-2">
                    <hr class="my-2" />
                    <h6 class="mb-2 text-muted">Acceso a sucursales</h6>
                  </div>
                  <div class="col-12">
                    <div class="row gx-3">
                      <div
                        v-for="branch in branchStore.branches"
                        :key="branch.id"
                        class="col-md-6 col-lg-4 mb-2"
                      >
                        <div class="branch-card">
                          <input
                            :id="`branch-${branch.id}`"
                            type="checkbox"
                            class="form-check-input mt-1 flex-shrink-0"
                            :value="branch.id"
                            v-model="selectedBranchIds"
                          />
                          <label :for="`branch-${branch.id}`" class="flex-grow-1 mb-0" style="cursor:pointer">
                            <span class="d-block fw-medium">{{ branch.company_name }}</span>
                            <span v-if="branch.is_headquarters" class="badge-hq me-1">HQ</span>
                            <span v-if="!branch.is_active" class="badge-inactive">Inactiva</span>
                          </label>
                          <input
                            v-if="selectedBranchIds.includes(branch.id)"
                            :id="`default-${branch.id}`"
                            type="radio"
                            class="form-check-input flex-shrink-0"
                            :value="branch.id"
                            v-model="defaultBranchId"
                            title="Sucursal por defecto"
                          />
                        </div>
                      </div>
                    </div>
                    <small class="text-muted">Marca el círculo para definir la sucursal por defecto del usuario.</small>
                  </div>
                </template>

                <div class="form-btn mt-3">
                  <button
                    class="btn btn-pill btn-gradient color-4"
                    type="submit"
                  >
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
import { useApiHandler } from "~/composables/useApiHandler";
import { Constants } from "~/constants/Constants";
import RolePermissionService from "~/services/RolePermissionService";
import UserService from "~/services/UserService";
import { useBranchStore } from "~/store/branchStore";

import type { IParamsTable } from "~/interfaces/IParamsTable";

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const { lookups } = useLookups([Constants.STATUS]);

const { run } = useApiHandler();
const { useUserCreateForm, useUserUpdateForm } = useUserForms();
const branchStore = useBranchStore();

const form = props.isEditing ? useUserUpdateForm() : useUserCreateForm();

const { handleSubmit, errors, defineField, resetForm, setErrors } = form;

const [email] = defineField("email");
const [password] = defineField("password");
const [password_confirmation] = defineField("password_confirmation");
const [status_type_id] = defineField("status_type_id");
const [roles] = defineField("roles");

const selectedBranchIds = ref<string[]>([]);
const defaultBranchId = ref<string | null>(null);

watch(selectedBranchIds, (ids) => {
  if (defaultBranchId.value && !ids.includes(defaultBranchId.value)) {
    defaultBranchId.value = ids[0] ?? null;
  }
});

const route = useRoute();
const idUser = route.params.id as string;
const rolesData = ref([]);

const sendForm = handleSubmit(async (values) => {
  const payload: Record<string, any> = { ...values };

  if (branchStore.branchesEnabled) {
    payload.branch_ids = selectedBranchIds.value;
    payload.default_branch_id = defaultBranchId.value;
  }

  const promise = props.isEditing
    ? UserService.updateUser(idUser, payload)
    : UserService.createUser(payload);

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

  const response = await run(UserService.getUser(idUser), {
    setErrors,
  });

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

    if (data.companies?.length) {
      selectedBranchIds.value = data.companies.map((c: any) => c.id);
      defaultBranchId.value =
        data.companies.find((c: any) => c.pivot?.is_default)?.id ?? null;
    }
  }
};

const getRoles = async (params: IParamsTable) => {
  const response = await run(RolePermissionService.getRoles(params));
  if (response) {
    rolesData.value = response.data.data;
  }
};

getRoles({ page: 1, perPage: 1000 });
getUser();
</script>

<style scoped>
.branch-card {
  border: 1px solid rgba(88, 97, 103, 0.15);
  border-radius: 6px;
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  transition: background 0.12s;
}

.branch-card:hover {
  background: rgba(88, 97, 103, 0.04);
}

.badge-hq {
  font-size: 10px;
  font-weight: 700;
  background: rgba(var(--theme-color-rgb), 0.1);
  color: var(--theme-color);
  padding: 1px 6px;
  border-radius: 3px;
  letter-spacing: 0.3px;
}

.badge-inactive {
  font-size: 10px;
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 1px 6px;
  border-radius: 3px;
}

:global(body.dark-layout) .branch-card {
  border-color: #383434;
}

:global(body.dark-layout) .branch-card:hover {
  background: rgba(255, 255, 255, 0.04);
}

:global(body.dark-layout) .branch-card .fw-medium {
  color: rgba(255, 255, 255, 0.82);
}
</style>
