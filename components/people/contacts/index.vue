<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
      <h5>Contactos</h5>
      <button type="button" class="btn btn-pill btn-gradient color-4" @click="addContact">
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Contacto
      </button>
    </div>

    <div v-if="contactsList.length === 0" class="alert alert-info">
      No hay contactos registrados. Haz clic en "Agregar Contacto" para añadir uno.
    </div>

    <div v-for="(contact, index) in contactsList" :key="index" class="card mb-3 border">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Contacto #{{ index + 1 }}</h6>
          <button
            type="button"
            class="btn btn-dashed color-4"
            @click="removeContact(index)"
            :disabled="contactsList.length === 1"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <CommonInputfieldsTextfield
            v-model="contact.phone"
            type="text"
            classes="col-md-4 col-sm-6"
            label="Teléfono Fijo"
            placeholder="Ej: 6012345678"
            :name="`phone_${index}`"
          />

          <CommonInputfieldsTextfield
            v-model="contact.mobile"
            type="text"
            classes="col-md-4 col-sm-6"
            label="Teléfono Móvil"
            placeholder="Ej: 3001234567"
            star="*"
            :rules="contactSchema.mobile"
            :name="`mobile_${index}`"
          />

          <CommonInputfieldsTextfield
            v-model="contact.email"
            type="email"
            classes="col-md-4 col-sm-6"
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            star="*"
            :rules="contactSchema.email"
            :name="`email_${index}`"
          />

          <div class="col-md-12 col-sm-12">
            <div class="form-check">
              <input
                v-model="contact.is_principal"
                class="form-check-input"
                type="checkbox"
                :id="`is_principal_contact_${index}`"
                @change="setPrincipal(index)"
              />
              <label class="form-check-label" :for="`is_principal_contact_${index}`">
                Contacto Principal
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IContact } from "~/interfaces/IContact";
import { useValidator } from "@/composables/useValidator";
import { contactSchema } from "@/utils/validations/contact.schema";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IContact[],
  isEditing?: boolean
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: IContact[]): void;
  (e: "formInvalid", payload: boolean): void;
}>();

const emptyContact: IContact = {
  phone: "",
  mobile: "",
  email: "",
  is_principal: false
};

const contactsList = ref<IContact[]>([{ ...emptyContact }]);
const contactsListOriginal = ref<IContact[]>([{ ...emptyContact }]);

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    contactsList.value = newData.map(contact => ({ ...contact }));
    contactsListOriginal.value = newData.map(contact => ({ ...contact }));
  }
}, { immediate: true });

const addContact = () => {
  contactsList.value.push({ ...emptyContact });
};

const removeContact = (index: number) => {
  if (contactsList.value.length > 1) {
    contactsList.value.splice(index, 1);
    resetErrors();
  }
};

const setPrincipal = (index: number) => {
  if (contactsList.value[index].is_principal) {
    contactsList.value.forEach((contact, i) => {
      if (i !== index) {
        contact.is_principal = false;
      }
    });
  }
};

const sendForm = () => {
  let allValid = true;

  const isValid = validateForm(contactsList.value, contactSchema);
  if (!isValid) {
    emit("formInvalid", true);
    return;
  }

  emit("sendForm", contactsList.value);
};

const reset = () => {
  contactsList.value = contactsListOriginal.value.map(contact => ({ ...contact }));
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
