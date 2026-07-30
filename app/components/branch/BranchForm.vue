<template>
  <CommonModal v-model:show="show" :title="isEdit ? 'Editar sucursal' : 'Nueva sucursal'" size="md" @close="close">
    <form class="admin-form row gx-3">
      <CommonInputfieldsTextfield
        v-model="form.branch.company_name"
        label="Nombre"
        name="company_name"
        classes="col-md-12"
        :error="errors['branch.company_name']"
        star
      />
      <CommonInputfieldsTextfield
        v-model="form.branch.tradename"
        label="Nombre comercial"
        name="tradename"
        classes="col-md-12"
        :error="errors['branch.tradename']"
      />
      <CommonInputfieldsTextfield
        v-model="form.branch.nit"
        label="NIT"
        name="nit"
        classes="col-md-6"
        :error="errors['branch.nit']"
      />
      <CommonInputfieldsTextfield
        v-model="form.branch.branch_code"
        label="Código de sucursal"
        name="branch_code"
        classes="col-md-6"
        :error="errors['branch.branch_code']"
      />
      <div v-if="isEdit" class="col-md-12 mt-1">
        <CommonInputfieldsCheckbox
          v-model="form.branch.is_active"
          label="Sucursal activa"
          name="is_active"
        />
      </div>
    </form>

    <template #actions>
      <button type="button" class="btn btn-pill btn-gradient color-4" @click="submit">
        {{ isEdit ? "Actualizar" : "Crear" }}
      </button>
    </template>
  </CommonModal>
</template>

<script setup lang="ts">
import BranchService from "~/services/BranchService";
import type { IBranch, IStoreBranch } from "~/interfaces/IBranch";

interface Props {
  show: boolean;
  branch?: IBranch | null;
}

const props = withDefaults(defineProps<Props>(), { branch: null });

const emit = defineEmits<{
  (e: "update:show", v: boolean): void;
  (e: "saved"): void;
}>();

const { run } = useApiHandler();
const errors = ref<Record<string, string>>({});

const isEdit = computed(() => !!props.branch?.id);

const show = computed({
  get: () => props.show,
  set: (v) => emit("update:show", v),
});

const defaultForm = (): IStoreBranch => ({
  branch: {
    company_name: "",
    tradename: null,
    nit: null,
    branch_code: null,
    is_active: true,
  },
});

const form = ref<IStoreBranch>(defaultForm());

watch(
  () => props.branch,
  (b) => {
    if (b) {
      form.value = {
        branch: {
          company_name: b.company_name,
          tradename: b.tradename,
          nit: b.nit,
          branch_code: b.branch_code,
          is_active: b.is_active,
        },
      };
    } else {
      form.value = defaultForm();
    }
    errors.value = {};
  },
  { immediate: true },
);

const close = () => {
  emit("update:show", false);
};

const submit = async () => {
  errors.value = {};

  const isEditMode = isEdit.value;
  const promise = isEditMode
    ? BranchService.update(props.branch!.id, form.value)
    : BranchService.create(form.value);

  const result = await run(promise, {
    showSuccess: true,
    successMessage: isEditMode ? "Sucursal actualizada" : "Sucursal creada",
    setErrors: (errs) => {
      errors.value = errs;
    },
  });

  if (result) {
    close();
    emit("saved");
  }
};
</script>
