<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Cuentas Bancarias</h5>
      <button type="button" class="btn btn-pill btn-gradient color-4" @click="addAccount">
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Cuenta
      </button>
    </div>

    <div v-if="accountsList.length === 0" class="alert alert-info">
      No hay cuentas bancarias registradas. Haz clic en "Agregar Cuenta" para añadir una.
    </div>

    <div v-for="(account, index) in accountsList" :key="index" class="card mb-3 border">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Cuenta #{{ index + 1 }}</h6>
          <button
              type="button"
              class="btn btn-dashed color-4"
              @click="removeAccount(index)"
              :disabled="accountsList.length === 1"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <CommonInputfieldsSelectfield
              v-model="account.bank_id"
              classes="col-md-4 col-sm-6"
              label="Banco"
              :data="lookups.banks"
              :labelField="'name'"
              :searchable="true"
              star="*"
              :rules="accountBankSchema.bank_id"
              :name="`bank_id_${index}`"
          />

          <CommonInputfieldsSelectfield
              v-model="account.account_type_id"
              classes="col-md-4 col-sm-6"
              label="Tipo de Cuenta"
              :data="lookups.typeAccountBank"
              :labelField="'name'"
              star="*"
              :rules="accountBankSchema.account_type_id"
              :name="`account_type_id_${index}`"
          />

          <CommonInputfieldsTextfield
              v-model="account.account_number"
              type="text"
              classes="col-md-4 col-sm-6"
              label="Número de Cuenta"
              placeholder="Ej: 1234567890"
              star="*"
              :rules="accountBankSchema.account_number"
              :name="`account_number_${index}`"
          />
          <CommonInputfieldsCheckbox
              v-model="account.is_principal"
              classes="col-md-12"
              label="Cuenta Principal"
              :name="`is_principal_${index}`"
              @change="setPrincipal(index)"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILookup } from "~/interfaces/ILookup";
import type { IAccountBank } from "~/interfaces/IAccountBank";
import { useValidator } from "@/composables/useValidator";
import { accountBankSchema } from "@/utils/validations/accountBank.schema";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IAccountBank[],
  lookups: {
    banks: ILookup[],
    typeAccountBank: ILookup[]
  },
  isEditing?: boolean
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: IAccountBank[]): void;
  (e: "formInvalid", payload: boolean): void;
}>();

const emptyAccount: IAccountBank = {
  bank_id: "",
  account_type_id: "",
  account_number: "",
  is_principal: false
};

const accountsList = ref<IAccountBank[]>([{ ...emptyAccount }]);
const accountsListOriginal = ref<IAccountBank[]>([{ ...emptyAccount }]);

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    accountsList.value = newData.map(account => ({ ...account }));
    accountsListOriginal.value = newData.map(account => ({ ...account }));
  }
}, { immediate: true });

const addAccount = () => {
  accountsList.value.push({ ...emptyAccount });
};

const removeAccount = (index: number) => {
  if (accountsList.value.length > 1) {
    accountsList.value.splice(index, 1);
    // Limpiar errores del item eliminado
    resetErrors();
  }
};

const setPrincipal = (index: number) => {
  if (accountsList.value[index].is_principal) {
    accountsList.value.forEach((account, i) => {
      if (i !== index) {
        account.is_principal = false;
      }
    });
  }
};

const sendForm = () => {
  // validateForm detecta automáticamente que es un array y valida como dinámico
  const isValid = validateForm(accountsList.value, accountBankSchema, true);

  if (isValid) {
    emit("sendForm", accountsList.value);
  } else {
    emit("formInvalid", true);
  }
};

const reset = () => {
  accountsList.value = accountsListOriginal.value.map(account => ({ ...account }));
  resetErrors();
};

defineExpose({
  sendForm,
  reset
});
</script>

<style scoped>
.card {
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
