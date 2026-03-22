<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5> {{ props.single ? 'Dirección' : 'Direcciones' }}</h5>
      <button
          v-if="!single"
          type="button"
          class="btn btn-pill btn-gradient color-4"
          @click="addAddress"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Dirección
      </button>
    </div>

    <div v-if="addressesList.length === 0" class="alert alert-info">
      No hay direcciones registradas.
    </div>

    <div
        v-for="(address, index) in addressesList"
        :key="index"
        class="card mb-3 border"
    >
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Dirección #{{ index + 1 }}</h6>
          <button
              v-if="!single"
              type="button"
              class="btn btn-dashed color-4"
              @click="removeAddress(index)"
              :disabled="addressesList.length === 1"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <!-- Construcción dirección -->
          <div class="col-12 mb-3">
            <label class="form-label fw-bold">Construir Dirección</label>

            <div class="row gx-2">
              <CommonInputfieldsSelectfield
                  v-model="address.via_type_id"
                  classes="col-md-2 col-sm-4"
                  label="Tipo vía"
                  :data="lookups.roadTypes"
                  labelField="name"
                  star="*"
                  :rules="addressSchema.via_type_id"
                  :name="`via_type_id_${index}`"
                  @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                  v-model="address.via_number"
                  classes="col-md-2 col-sm-4"
                  label="Número"
                  star="*"
                  :rules="addressSchema.via_number"
                  :name="`via_number_${index}`"
                  @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                  v-model="address.letra1_id"
                  classes="col-md-1 col-sm-4"
                  label="Letra"
                  :data="lookups.letters"
                  labelField="name"
                  :name="`letra1_${index}`"
                  :rules="addressSchema.letra1_id"
                  @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                  v-model="address.orientation1_id"
                  classes="col-md-1 col-sm-4"
                  label="Orient."
                  :data="lookups.orientations"
                  labelField="name"
                  :name="`orientation1_${index}`"
                  :rules="addressSchema.orientation1_id"
                  @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                  v-model="address.number2"
                  classes="col-md-2 col-sm-4"
                  label="# Cruce"
                  star="*"
                  :rules="addressSchema.number2"
                  :name="`number2_${index}`"
                  @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                  v-model="address.letra2_id"
                  classes="col-md-1 col-sm-4"
                  label="Letra"
                  :data="lookups.letters"
                  labelField="name"
                  :name="`letra2_${index}`"
                  :rules="addressSchema.letra2_id"
                  @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsSelectfield
                  v-model="address.orientation2_id"
                  classes="col-md-1 col-sm-4"
                  label="Orient."
                  :data="lookups.orientations"
                  labelField="name"
                  :name="`orientation2_${index}`"
                  :rules="addressSchema.orientation2_id"
                  @update:modelValue="buildAddress(index)"
              />

              <CommonInputfieldsTextfield
                  v-model="address.number3"
                  classes="col-md-2 col-sm-4"
                  label="# Placa"
                  star="*"
                  :rules="addressSchema.number3"
                  :name="`number3_${index}`"
                  @update:modelValue="buildAddress(index)"
              />
            </div>

            <div class="mt-3">
              <label class="form-label fw-bold">Dirección generada</label>
              <div class="alert alert-secondary mb-0">
                {{ address.address || 'Completa los campos' }}
              </div>
            </div>
          </div>

          <CommonInputfieldsTextfield
              v-model="address.complement"
              classes="col-md-6 col-sm-6"
              label="Complemento"
              :name="`complement_${index}`"
              :rules="addressSchema.complement"
          />

          <CommonInputfieldsSelectfield
              v-model="address.country_id"
              classes="col-md-6 col-sm-6"
              label="País"
              :data="lookups.country"
              labelField="name"
              star="*"
              searchable
              :rules="addressSchema.country_id"
              :name="`country_id_${index}`"
          />

          <CommonInputfieldsSelectfield
              v-model="address.department_id"
              classes="col-md-6 col-sm-6"
              label="Departamento"
              :data="lookups.departments"
              labelField="name"
              star="*"
              searchable
              :rules="addressSchema.department_id"
              :name="`department_id_${index}`"
              @update:modelValue="onDepartmentChange(index)"
          />

          <CommonInputfieldsSelectfield
              v-model="address.city_id"
              classes="col-md-6 col-sm-6"
              label="Ciudad"
              :data="getFilteredCities(index)"
              labelField="name"
              star="*"
              searchable
              :rules="addressSchema.city_id"
              :name="`city_id_${index}`"
          />

          <CommonInputfieldsTextfield
              v-model="address.zip_code"
              classes="col-md-4 col-sm-6"
              label="Código postal"
              :name="`zip_${index}`"
              :rules="addressSchema.zip_code"
          />

          <CommonInputfieldsTextfield
              v-model="address.sector"
              classes="col-md-4 col-sm-6"
              label="Sector"
              :name="`sector_${index}`"
              :rules="addressSchema.sector"
          />

          <CommonInputfieldsSelectfield
              v-model="address.stratum_id"
              classes="col-md-4 col-sm-6"
              label="Estrato"
              :data="lookups.strata"
              labelField="name"
              :name="`stratum_${index}`"
              :rules="addressSchema.stratum_id"
          />

          <CommonInputfieldsCheckbox
              v-model="address.is_principal"
              classes="col-md-12"
              label="Dirección principal"
              :name="`is_principal_${index}`"
              :rules="addressSchema.is_principal"
              @change="setPrincipal(index)"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILookup } from "~/interfaces/ILookup";
import type { IAddress } from "~/interfaces/IAddress";
import { useValidator } from "~/composables/useValidator";
import { addressSchema } from "~/utils/validations/address.schema";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IAddress[];
  single?: boolean;
  lookups: {
    roadTypes: ILookup[];
    letters: ILookup[];
    orientations: ILookup[];
    strata: ILookup[];
    country: ILookup[];
    cities: ILookup[];
    departments: ILookup[];
  };
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: IAddress[]): void;
  (e: "formInvalid", payload: boolean): void;
}>();

const emptyAddress: IAddress = {
  address: "",
  complement: "",
  country_id: "",
  department_id: "",
  city_id: "",
  zip_code: "",
  sector: "",
  stratum_id: "",
  is_principal: false,
  via_type_id: "",
  via_number: "",
  letra1_id: "",
  orientation1_id: "",
  number2: "",
  letra2_id: "",
  orientation2_id: "",
  number3: ""
};

const addressesList = ref<IAddress[]>(
    props.single
        ? [{ ...emptyAddress }]
        : [{ ...emptyAddress }]
);

const original = ref<IAddress[]>([{ ...emptyAddress }]);

watch(
    () => props.data, (val) => {
      if (val && val.length > 0) {
        addressesList.value = val.map(address => ({ ...address }));
        original.value = val.map(address => ({ ...address }));
      }
    },
    { immediate: true }
);

const getLookupName = (arr: ILookup[], id: string) =>
    arr.find(i => i.id === id)?.name ?? "";

const buildAddress = (index: number) => {
  const a = addressesList.value[index];
  let result = "";

  if (a.via_type_id) result += getLookupName(props.lookups.roadTypes, a.via_type_id);
  if (a.via_number) result += ` ${a.via_number}`;
  if (a.letra1_id) result += getLookupName(props.lookups.letters, a.letra1_id);
  if (a.orientation1_id) result += ` ${getLookupName(props.lookups.orientations, a.orientation1_id)}`;
  if (a.number2) result += ` # ${a.number2}`;
  if (a.letra2_id) result += getLookupName(props.lookups.letters, a.letra2_id);
  if (a.orientation2_id) result += ` ${getLookupName(props.lookups.orientations, a.orientation2_id)}`;
  if (a.number3) result += ` - ${a.number3}`;

  a.address = result.trim();
};

const addAddress = () => addressesList.value.push({ ...emptyAddress });

const removeAddress = (index: number) => {
  if (addressesList.value.length > 1) {
    addressesList.value.splice(index, 1);
    resetErrors();
  }
};

const setPrincipal = (index: number) => {
  if (addressesList.value[index].is_principal) {
    addressesList.value.forEach((a, i) => {
      if (i !== index) a.is_principal = false;
    });
  }
};

const onDepartmentChange = (index: number) => {
  addressesList.value[index].city_id = "";
};

const getFilteredCities = (index: number) => {
  // 🔒 Guards de seguridad
  if (
      !props.lookups ||
      !props.lookups.departments ||
      !props.lookups.cities
  ) {
    return [];
  }

  const departmentId = addressesList.value[index]?.department_id;
  if (!departmentId) return [];

  const selectedDepartment = props.lookups.departments.find(
      d => d.id === departmentId
  );

  if (!selectedDepartment?.alias) return [];

  const alias = selectedDepartment.alias.toUpperCase();

  return props.lookups.cities.filter(
      c => c.code?.toUpperCase() === alias
  );
};


const sendForm = () => {
  const valid = validateForm(addressesList.value, addressSchema, true);
  valid ? emit("sendForm", addressesList.value) : emit("formInvalid", true);
};

const reset = () => {
  addressesList.value = original.value.map(a => ({ ...a }));
  resetErrors();
};

defineExpose({ sendForm, reset });
</script>

<style scoped>
</style>
