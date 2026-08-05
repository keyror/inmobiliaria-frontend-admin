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
                    <h6 class="mb-3 text-muted">Acceso a sucursales</h6>
                  </div>
                  <div class="col-12">
                    <div class="row gx-2">
                      <div
                        v-for="branch in branchStore.branches"
                        :key="branch.id"
                        class="col-md-6 col-lg-4 mb-2"
                      >
                        <div
                          class="branch-access-card"
                          :class="{ 'is-selected': selectedBranchIds.includes(branch.id) }"
                        >
                          <label :for="`branch-${branch.id}`" class="branch-check-row">
                            <input
                              :id="`branch-${branch.id}`"
                              type="checkbox"
                              class="checkbox_animated color-4"
                              :value="branch.id"
                              v-model="selectedBranchIds"
                            />
                            <span class="branch-check-info">
                              <span class="branch-check-name">{{ branch.company_name }}</span>
                              <span class="branch-check-badges">
                                <span v-if="branch.is_headquarters" class="badge-hq">HQ</span>
                                <span v-if="!branch.is_active" class="badge-inactive">Inactiva</span>
                              </span>
                            </span>
                          </label>
                          <label
                            v-if="selectedBranchIds.includes(branch.id)"
                            :for="`default-${branch.id}`"
                            class="branch-default-row"
                          >
                            <input
                              :id="`default-${branch.id}`"
                              type="radio"
                              class="branch-default-radio"
                              :value="branch.id"
                              v-model="defaultBranchId"
                            />
                            <span class="branch-default-text">Sucursal por defecto</span>
                          </label>
                        </div>
                      </div>
                    </div>
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

onMounted(() => {
  if (branchStore.branchesEnabled || !branchStore.loaded) {
    branchStore.load(true);
  }
});

getRoles({ page: 1, perPage: 1000 });
getUser();
</script>

<style scoped>
/* ── Branch access card ── */
.branch-access-card {
  border: 1px solid rgba(88, 97, 103, 0.15);
  border-radius: 8px;
  background: transparent;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.branch-access-card.is-selected {
  border-color: color-mix(in srgb, var(--theme-default7) 35%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-default7) 6%, transparent);
}

/* ── Checkbox row ── */
.branch-check-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
  margin: 0;
  transition: background-color 0.12s;
}

.branch-check-row:hover {
  background-color: color-mix(in srgb, var(--theme-default7) 6%, transparent);
}

.branch-check-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
}

.branch-check-name {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.branch-check-badges {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}

/* ── Default row ── */
.branch-default-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.85rem 0.4rem 2.5rem;
  cursor: pointer;
  margin: 0;
  border-top: 1px solid rgba(88, 97, 103, 0.08);
  background: color-mix(in srgb, var(--theme-default7) 4%, transparent);
  transition: background-color 0.12s;
}

.branch-default-row:hover {
  background-color: color-mix(in srgb, var(--theme-default7) 9%, transparent);
}

.branch-default-text {
  font-size: 0.775rem;
  color: #6c757d;
}

/* ── Custom radio ── */
.branch-default-radio {
  appearance: none;
  -webkit-appearance: none;
  width: 13px;
  height: 13px;
  border: 2px solid rgba(88, 97, 103, 0.3);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  transition: border-color 0.15s, background 0.15s;
}

.branch-default-radio:checked {
  border-color: var(--theme-default7);
  background: var(--theme-default7);
}

.branch-default-radio:checked::after {
  content: "";
  position: absolute;
  width: 5px;
  height: 5px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* ── Badges ── */
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

/* ── Dark mode ── */
:global(body.dark-layout) .branch-access-card {
  border-color: rgba(255, 255, 255, 0.1);
}

:global(body.dark-layout) .branch-access-card.is-selected {
  border-color: color-mix(in srgb, var(--theme-default7) 45%, transparent);
}

:global(body.dark-layout) .branch-default-row {
  border-top-color: rgba(255, 255, 255, 0.07);
  background: color-mix(in srgb, var(--theme-default7) 7%, rgba(0, 0, 0, 0.12));
}

:global(body.dark-layout) .branch-check-name {
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .branch-default-text {
  color: rgba(255, 255, 255, 0.45);
}

:global(body.dark-layout) .branch-default-radio {
  border-color: rgba(255, 255, 255, 0.2);
}
</style>
