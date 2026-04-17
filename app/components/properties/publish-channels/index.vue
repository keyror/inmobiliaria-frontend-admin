<template>
  <div>
    <div
      class="card-header ps-0 d-flex justify-content-between align-items-center"
    >
      <h5>Redes Sociales / Canales</h5>
      <button
        type="button"
        class="btn btn-pill btn-gradient color-4"
        @click="addChannel"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Agregar Canal
      </button>
    </div>

    <div v-if="fields.length === 0" class="alert alert-info">
      No hay canales registrados.
    </div>

    <!-- error general -->
    <div
      v-if="hasTriedSubmit && errors.publish_channels"
      class="alert alert-danger p-2 small"
    >
      {{ errors.publish_channels }}
    </div>

    <div
      v-for="(field, index) in fields"
      :key="field.key"
      class="card mb-3 border"
    >
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Canal #{{ index + 1 }}</h6>

          <button
            type="button"
            class="btn btn-dashed color-4"
            :disabled="fields.length === 1"
            @click="removeChannel(index)"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">
          <CommonInputfieldsSelectfield
            v-model="field.value.channel_id"
            classes="col-md-4"
            label="Canal"
            labelField="name"
            :data="lookups.publishChannels"
            star="*"
            :error="getFieldError(index, 'channel_id')"
          />

          <CommonInputfieldsTextfield
            v-model="field.value.external_link"
            classes="col-md-4"
            label="Enlace Externo"
            :error="getFieldError(index, 'external_link')"
          />

          <CommonInputfieldsSelectfield
            v-model="field.value.status_id"
            classes="col-md-4"
            label="Estado"
            labelField="name"
            :data="lookups.status"
            star="*"
            :error="getFieldError(index, 'status_id')"
          />

          <div class="col-md-4 col-sm-6">
            <label>{{
              field.value.published_at ? "Publicado el" : "Publicar"
            }}</label>

            <VueDatePicker
              v-model="field.value.published_at"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              :class="{
                'is-invalid': getFieldError(index, 'published_at'),
              }"
              :state="getFieldError(index, 'published_at') ? false : null"
              :disabled="!!field.value.unpublished_at"
            />

            <small class="text-danger">
              {{ getFieldError(index, "published_at") }}
            </small>
          </div>

          <div class="col-md-4 col-sm-6">
            <label>{{
              field.value.unpublished_at ? "Despublicado el" : "Despublicar"
            }}</label>

            <VueDatePicker
              v-model="field.value.unpublished_at"
              format="yyyy-MM-dd"
              model-type="yyyy-MM-dd"
              :class="{
                'is-invalid': getFieldError(index, 'unpublished_at'),
              }"
              :state="getFieldError(index, 'unpublished_at') ? false : null"
              :disabled="!!field.value.published_at"
            />

            <small class="text-danger">
              {{ getFieldError(index, "unpublished_at") }}
            </small>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import { useFieldArray } from "vee-validate";

import { usePublishChannelForm } from "~/composables/forms/usePublishChannelForm";

import type { ILookup } from "~/interfaces/ILookup";
import type { IPublishChannel } from "~/interfaces/IPublishChannel";

const props = defineProps<{
  data?: IPublishChannel[];
  lookups: {
    publishChannels: ILookup[];
    status: ILookup[];
  };
  isEditing?: boolean;
}>();

const { validate, values, resetForm, errors, setErrors } =
  usePublishChannelForm();

const { remove, push, fields } =
  useFieldArray<IPublishChannel>("publish_channels");

const hasTriedSubmit = ref(false);

const getFieldError = (index: number, field: string): string => {
  if (!hasTriedSubmit.value) return "";
  const errorsMap = errors.value as Record<string, string>;

  return (
    errorsMap[`publish_channels[${index}].${field}`] ||
    errorsMap[`publish_channels.${index}.${field}`] ||
    ""
  );
};

const emptyChannel = (): IPublishChannel => ({
  channel_id: "",
  external_link: "",
  status_id: "",
  published_at: "",
  unpublished_at: "",
});

watch(
  () => props.data,
  (newData) => {
    hasTriedSubmit.value = false;

    if (newData && newData.length > 0) {
      resetForm({
        values: {
          publish_channels: newData.map((c) => ({
            channel_id: c.channel_id ?? "",
            external_link: c.external_link ?? "",
            status_id: c.status_id ?? "",
            published_at: c.published_at ?? "",
            unpublished_at: c.unpublished_at ?? "",
          })),
        },
      });
    } else {
      resetForm({
        values: {
          publish_channels: [{ ...emptyChannel() }],
        },
      });
    }
  },
  { immediate: true },
);

watch(
  () => values.publish_channels,
  (channels) => {
    channels?.forEach((channel, index) => {
      if (channel.published_at) {
        values.publish_channels[index].unpublished_at = "";
      }

      if (channel.unpublished_at) {
        values.publish_channels[index].published_at = "";
      }
    });
  },
  { deep: true },
);

const addChannel = () => {
  push(emptyChannel());
};

const removeChannel = (index: number) => {
  if (fields.value.length > 1) {
    remove(index);
  }
};

defineExpose({
  async validateForm() {
    hasTriedSubmit.value = true;
    const result = await validate();
    return result.valid;
  },

  getValues(): IPublishChannel[] | undefined {
    return values.publish_channels as IPublishChannel[];
  },

  reset() {
    hasTriedSubmit.value = false;
    resetForm();
  },

  setBackendErrors(backendErrors: Record<string, string>) {
    hasTriedSubmit.value = true;
    setErrors(backendErrors);
  },
});
</script>

<style scoped></style>
