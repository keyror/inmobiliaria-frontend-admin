<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Direcciones</h5>
      <button type="button" class="btn btn-pill btn-gradient color-4" @click="addAddress">
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Dirección
      </button>
    </div>

    <div v-if="addressesList.length === 0" class="alert alert-info">
      No hay direcciones registradas. Haz clic en "Agregar Dirección" para añadir una.
    </div>

    <div v-for="(address, index) in addressesList" :key="index" class="card mb-3 border">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Dirección #{{ index + 1 }}</h6>
          <button
            type="button"
            class="btn btn-dashed color-4"
            @click="removeAddress(index)"
            :disabled="addressesList.length === 1"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <!-- Construcción de dirección -->
          <div class="col-12 mb-3">
            <label class="form-label fw-bold">Construir Dirección</label>
            <div class="row gx-2">
              <CommonInputfieldsSelectfield
                v-model="address.addressParts.viaType"
                classes="col-md-2 col-sm-4"
                label="Tipo de vía"
                :data="addressTypes"
                :labelField="'name'"
                star="*"
                :name="`via_type_${index}`"
                @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                v-model="address.addressParts.viaNumber"
                type="text"
                classes="col-md-2 col-sm-4"
                label="Número"
                placeholder="10"
                star="*"
                :name="`via_number_${index}`"
                @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                v-model="address.addressParts.letra1"
                classes="col-md-1 col-sm-4"
                label="Letra"
                :data="letters"
                :labelField="'name'"
                :name="`letra1_${index}`"
                @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                v-model="address.addressParts.orientation1"
                classes="col-md-1 col-sm-4"
                label="Orient."
                :data="orientations"
                :labelField="'name'"
                :name="`orientation1_${index}`"
                @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                v-model="address.addressParts.number2"
                type="text"
                classes="col-md-2 col-sm-4"
                label="# Cruce"
                placeholder="20"
                star="*"
                :name="`number2_${index}`"
                @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                v-model="address.addressParts.letra2"
                classes="col-md-1 col-sm-4"
                label="Letra"
                :data="letters"
                :labelField="'name'"
                :name="`letra2_${index}`"
                @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                v-model="address.addressParts.orientation2"
                classes="col-md-1 col-sm-4"
                label="Orient."
                :data="orientations"
                :labelField="'name'"
                :name="`orientation2_${index}`"
                @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                v-model="address.addressParts.number3"
                type="text"
                classes="col-md-2 col-sm-4"
                label="# Placa"
                placeholder="30"
                star="*"
                :name="`number3_${index}`"
                @update:modelValue="buildAddress(index)"
              />
            </div>

            <!-- Dirección generada -->
            <div class="mt-3">
              <label class="form-label fw-bold">Dirección Generada:</label>
              <div class="alert alert-secondary mb-0">
                {{ address.address || 'Completa los campos para generar la dirección' }}
              </div>
            </div>
          </div>

          <CommonInputfieldsTextfield
            v-model="address.complement"
            type="text"
            classes="col-md-6 col-sm-6"
            label="Complemento"
            placeholder="Ej: Apartamento 301, Torre 2"
            :name="`complement_${index}`"
          />

          <CommonInputfieldsSelectfield
            v-model="address.country"
            classes="col-md-6 col-sm-6"
            label="País"
            :data="lookups.countries"
            :labelField="'name'"
            :searchable="true"
            star="*"
            :rules="addressSchema.country"
            :name="`country_${index}`"
          />

          <CommonInputfieldsSelectfield
            v-model="address.department"
            classes="col-md-6 col-sm-6"
            label="Departamento"
            :data="lookups.departments"
            :labelField="'name'"
            :searchable="true"
            star="*"
            :rules="addressSchema.department"
            :name="`department_${index}`"
          />

          <CommonInputfieldsSelectfield
            v-model="address.city"
            classes="col-md-6 col-sm-6"
            label="Ciudad"
            :data="lookups.cities"
            :labelField="'name'"
            :searchable="true"
            star="*"
            :rules="addressSchema.city"
            :name="`city_${index}`"
          />

          <CommonInputfieldsTextfield
            v-model="address.zip_code"
            type="text"
            classes="col-md-4 col-sm-6"
            label="Código Postal"
            placeholder="110111"
            :name="`zip_code_${index}`"
          />

          <CommonInputfieldsTextfield
            v-model="address.sector"
            type="text"
            classes="col-md-4 col-sm-6"
            label="Sector/Barrio"
            placeholder="Ej: Chapinero"
            :name="`sector_${index}`"
          />

          <CommonInputfieldsSelectfield
            v-model="address.stratum"
            classes="col-md-4 col-sm-6"
            label="Estrato"
            :data="stratums"
            :labelField="'name'"
            :name="`stratum_${index}`"
          />

          <div class="col-md-12 col-sm-12">
            <div class="form-check">
              <input
                v-model="address.is_principal"
                class="form-check-input"
                type="checkbox"
                :id="`is_principal_${index}`"
                @change="setPrincipal(index)"
              />
              <label class="form-check-label" :for="`is_principal_${index}`">
                Dirección Principal
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ILookup } from "~/interfaces/ILookup";
import type { IAddress } from "~/interfaces/IAddress";
import { useValidator } from "@/composables/useValidator";
import { addressSchema } from "@/utils/validations/address.schema";
import {accountBankSchema} from "~/utils/validations/accountBank.schema";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IAddress[],
  lookups: {
    countries: ILookup[],
    departments: ILookup[],
    cities: ILookup[]
  },
  isEditing?: boolean
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: IAddress[]): void;
  (e: "formInvalid", payload: boolean): void;
}>();

// Opciones para construcción de dirección
const addressTypes = [
  { id: 'Calle', name: 'Calle' },
  { id: 'Carrera', name: 'Carrera' },
  { id: 'Avenida', name: 'Avenida' },
  { id: 'Diagonal', name: 'Diagonal' },
  { id: 'Transversal', name: 'Transversal' },
  { id: 'Circular', name: 'Circular' }
];

const letters = [
  { id: '', name: '-' },
  { id: 'A', name: 'A' },
  { id: 'B', name: 'B' },
  { id: 'C', name: 'C' },
  { id: 'D', name: 'D' },
  { id: 'E', name: 'E' },
  { id: 'F', name: 'F' }
];

const orientations = [
  { id: '', name: '-' },
  { id: 'Norte', name: 'Norte' },
  { id: 'Sur', name: 'Sur' },
  { id: 'Este', name: 'Este' },
  { id: 'Oeste', name: 'Oeste' }
];

const stratums = [
  { id: '1', name: 'Estrato 1' },
  { id: '2', name: 'Estrato 2' },
  { id: '3', name: 'Estrato 3' },
  { id: '4', name: 'Estrato 4' },
  { id: '5', name: 'Estrato 5' },
  { id: '6', name: 'Estrato 6' }
];

const emptyAddress: IAddress = {
  address: "",
  city: "",
  department: "",
  country: "",
  zip_code: "",
  sector: "",
  stratum: "",
  complement: "",
  is_principal: false,
  addressParts: {
    viaType: "",
    viaNumber: "",
    letra1: "",
    orientation1: "",
    number2: "",
    letra2: "",
    orientation2: "",
    number3: ""
  }
};

const addressesList = ref<IAddress[]>([{ ...emptyAddress }]);
const addressesListOriginal = ref<IAddress[]>([{ ...emptyAddress }]);

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    addressesList.value = newData.map(address => ({ ...address }));
    addressesListOriginal.value = newData.map(address => ({ ...address }));
  }
}, { immediate: true });

const buildAddress = (index: number) => {
  const parts = addressesList.value[index].addressParts;
  let address = '';

  if (parts.viaType) address += parts.viaType;
  if (parts.viaNumber) address += ' ' + parts.viaNumber;
  if (parts.letra1) address += parts.letra1;
  if (parts.orientation1) address += ' ' + parts.orientation1;
  if (parts.number2) address += ' # ' + parts.number2;
  if (parts.letra2) address += parts.letra2;
  if (parts.orientation2) address += ' ' + parts.orientation2;
  if (parts.number3) address += ' - ' + parts.number3;

  addressesList.value[index].address = address.trim();
};

const addAddress = () => {
  addressesList.value.push({ ...emptyAddress, addressParts: { ...emptyAddress.addressParts } });
};

const removeAddress = (index: number) => {
  if (addressesList.value.length > 1) {
    addressesList.value.splice(index, 1);
    resetErrors();
  }
};

const setPrincipal = (index: number) => {
  if (addressesList.value[index].is_principal) {
    addressesList.value.forEach((address, i) => {
      if (i !== index) {
        address.is_principal = false;
      }
    });
  }
};

const sendForm = () => {
  const isValid = validateForm(addressesList.value, addressSchema);

  if (!isValid) {
    emit("formInvalid", true);
    return;
  }

  emit("sendForm", addressesList.value);
};

const reset = () => {
  addressesList.value = addressesListOriginal.value.map(address => ({ ...address }));
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
