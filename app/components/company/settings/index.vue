<template>
  <form class="admin-form row g-3">
    <!-- Transformación de texto -->
    <CommonInputfieldsSelectfield
      v-model="textCaseMode"
      :data="TEXT_CASE_MODE_OPTIONS"
      label="Transformación de texto"
      name="text_case_mode"
      classes="col-md-6"
      show="Sin transformación"
    />

    <div class="col-12">
      <div class="alert alert-info d-flex align-items-center gap-2">
        <i class="fa fa-info-circle"></i>
        <span>
          Esta configuración transforma automáticamente el texto ingresado en
          los formularios (nombres, títulos, descripciones). No aplica a correos
          electrónicos, contraseñas.
        </span>
      </div>
    </div>

    <!-- Separador -->
    <div class="col-12">
      <hr />
    </div>

    <!-- Servidor de correo -->
    <div class="col-12">
      <CommonInputfieldsCheckbox
        v-model="hasCustomSmtp"
        label="Cuenta con servidor de correo propio"
        name="has_custom_smtp"
      />
    </div>

    <template v-if="hasCustomSmtp">
      <div class="col-12">
        <div class="alert alert-warning d-flex align-items-center gap-2">
          <i class="fa fa-exclamation-triangle"></i>
          <span>
            Los correos se enviarán usando este servidor. Asegúrate de que las
            credenciales sean correctas antes de guardar.
          </span>
        </div>
      </div>

      <!-- Correo remitente -->
      <CommonInputfieldsSelectfield
        v-model="smtpFromEmail"
        :data="contactEmailOptions"
        :error="errors.smtp_from_email"
        label="Correo remitente"
        name="smtp_from_email"
        classes="col-md-6"
        show="Seleccione un correo"
        star="*"
      />

      <div class="col-md-auto d-flex flex-column justify-content-end">
        <button
          class="btn btn-pill btn-gradient color-4"
          type="button"
          @click="emit('go-to-contacts')"
        >
          <i class="fa fa-plus me-1" />
          Agregar correo
        </button>
      </div>

      <!-- Host y puerto -->
      <CommonInputfieldsTextfield
        v-model="smtpHost"
        :error="errors.smtp_host"
        label="Host SMTP"
        name="smtp_host"
        classes="col-md-6"
        placeholder="smtp.ejemplo.com"
        star="*"
      />

      <CommonInputfieldsNumberfield
        v-model="smtpPort"
        :error="errors.smtp_port"
        label="Puerto"
        name="smtp_port"
        classes="col-md-3"
        placeholder="587"
        star="*"
      />

      <CommonInputfieldsSelectfield
        v-model="smtpEncryption"
        :data="ENCRYPTION_OPTIONS"
        :error="errors.smtp_encryption"
        label="Encriptación"
        name="smtp_encryption"
        classes="col-md-3"
        show="Seleccione"
        star="*"
      />

      <!-- Usuario y contraseña -->
      <CommonInputfieldsTextfield
        v-model="smtpUsername"
        :error="errors.smtp_username"
        label="Usuario"
        name="smtp_username"
        classes="col-md-6"
        placeholder="correo@ejemplo.com"
        star="*"
      />

      <CommonInputfieldsTextfield
        v-model="smtpPasswordInput"
        :error="errors.smtp_password"
        :placeholder="hasExistingPassword ? '••••••••' : 'Contraseña'"
        label="Contraseña"
        name="smtp_password"
        classes="col-md-6"
        type="password"
        @input="passwordChanged = true"
      />
    </template>
  </form>
</template>

<script setup lang="ts">
import type { ICompanySetting } from "~/interfaces/ICompanySetting";
import type { IContact } from "~/interfaces/IContact";
import type { ILookup } from "~/interfaces/ILookup";

interface Props {
  data?: ICompanySetting | null;
  contacts?: IContact[];
  isEditing?: boolean;
}

const emit = defineEmits<{ (e: "go-to-contacts"): void }>();

const props = withDefaults(defineProps<Props>(), {
  data: null,
  contacts: () => [],
  isEditing: false,
});

const NONE_SENTINEL = "none";

const TEXT_CASE_MODE_OPTIONS: ILookup[] = [
  { id: NONE_SENTINEL, category: "", name: "Sin transformación", alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "upper", category: "", name: "MAYÚSCULAS", alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "lower", category: "", name: "minúsculas", alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "capitalize", category: "", name: "Primera Letra Mayúscula", alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "sentence", category: "", name: "Primera letra mayúscula", alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
];

const ENCRYPTION_OPTIONS: ILookup[] = [
  { id: "tls", category: "", name: "TLS", alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
  { id: "ssl", category: "", name: "SSL", alias: null, value: null, code: null, icon: null, is_active: true, lang: "es" },
];

const contactEmailOptions = computed<ILookup[]>(() =>
  props.contacts
    .filter((c) => !!c.email)
    .map((c) => ({
      id: c.email,
      category: "",
      name: c.email,
      alias: null,
      value: null,
      code: null,
      icon: null,
      is_active: true,
      lang: "es",
    })),
);

const textCaseMode = ref<string>(NONE_SENTINEL);
const hasCustomSmtp = ref<boolean>(false);
const smtpFromEmail = ref<string | null>(null);
const smtpHost = ref<string | null>(null);
const smtpPort = ref<number | null>(null);
const smtpEncryption = ref<string | null>(null);
const smtpUsername = ref<string | null>(null);
const smtpPasswordInput = ref<string>("");
const passwordChanged = ref<boolean>(false);
const hasExistingPassword = ref<boolean>(false);
const errors = ref<Record<string, string>>({});

watch(
  () => props.data,
  (newData) => {
    textCaseMode.value = newData?.text_case_mode ?? NONE_SENTINEL;
    hasCustomSmtp.value = newData?.has_custom_smtp ?? false;
    smtpFromEmail.value = newData?.smtp_from_email ?? null;
    smtpHost.value = newData?.smtp_host ?? null;
    smtpPort.value = newData?.smtp_port ?? null;
    smtpEncryption.value = newData?.smtp_encryption ?? null;
    smtpUsername.value = newData?.smtp_username ?? null;
    smtpPasswordInput.value = "";
    passwordChanged.value = false;
    hasExistingPassword.value = !!newData?.smtp_password;
  },
  { immediate: true },
);

function getValues(): ICompanySetting {
  const base: ICompanySetting = {
    text_case_mode: textCaseMode.value === NONE_SENTINEL ? null : textCaseMode.value,
    has_custom_smtp: hasCustomSmtp.value,
  };

  if (!hasCustomSmtp.value) {
    return base;
  }

  return {
    ...base,
    smtp_from_email: smtpFromEmail.value,
    smtp_host: smtpHost.value,
    smtp_port: smtpPort.value,
    smtp_encryption: smtpEncryption.value,
    smtp_username: smtpUsername.value,
    ...(passwordChanged.value ? { smtp_password: smtpPasswordInput.value || null } : {}),
  };
}

function validateForm(): boolean {
  errors.value = {};

  if (!hasCustomSmtp.value) return true;

  let valid = true;

  if (!smtpFromEmail.value) {
    errors.value.smtp_from_email = "El correo remitente es requerido";
    valid = false;
  }
  if (!smtpHost.value) {
    errors.value.smtp_host = "El host SMTP es requerido";
    valid = false;
  }
  if (!smtpPort.value) {
    errors.value.smtp_port = "El puerto es requerido";
    valid = false;
  }
  if (!smtpEncryption.value) {
    errors.value.smtp_encryption = "La encriptación es requerida";
    valid = false;
  }
  if (!smtpUsername.value) {
    errors.value.smtp_username = "El usuario es requerido";
    valid = false;
  }
  if (!hasExistingPassword.value && !smtpPasswordInput.value) {
    errors.value.smtp_password = "La contraseña es requerida";
    valid = false;
  }

  return valid;
}

function reset() {
  textCaseMode.value = props.data?.text_case_mode ?? NONE_SENTINEL;
  hasCustomSmtp.value = props.data?.has_custom_smtp ?? false;
  smtpFromEmail.value = props.data?.smtp_from_email ?? null;
  smtpHost.value = props.data?.smtp_host ?? null;
  smtpPort.value = props.data?.smtp_port ?? null;
  smtpEncryption.value = props.data?.smtp_encryption ?? null;
  smtpUsername.value = props.data?.smtp_username ?? null;
  smtpPasswordInput.value = "";
  passwordChanged.value = false;
  hasExistingPassword.value = !!props.data?.smtp_password;
  errors.value = {};
}

defineExpose({ getValues, validateForm, reset });
</script>
