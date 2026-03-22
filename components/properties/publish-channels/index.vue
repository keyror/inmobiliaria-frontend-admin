<template>
  <div>
    <div class="card-header ps-0 d-flex justify-content-between align-items-center">
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

    <div v-if="channelsList.length === 0" class="alert alert-info">
      No hay canales registrados.
    </div>

    <div
        v-for="(channel, index) in channelsList"
        :key="index"
        class="card mb-3 border"
    >
      <div class="card-body">

        <div class="d-flex justify-content-between align-items-start mb-3">
          <h6 class="mb-0">Canal #{{ index + 1 }}</h6>
          <button
              type="button"
              class="btn btn-dashed color-4"
              @click="removeChannel(index)"
              :disabled="channelsList.length === 1"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <form class="row gx-3">

          <CommonInputfieldsSelectfield
              v-model="channel.channel_id"
              classes="col-md-4"
              label="Canal"
              labelField="name"
              :data="lookups.publishChannels"
              :rules="publishChannelSchema.channel_id"
              :name="`channel_id_${index}`"
          />

          <CommonInputfieldsTextfield
              v-model="channel.external_link"
              classes="col-md-4"
              label="Enlace Externo"
              :rules="publishChannelSchema.external_link"
              :name="`external_link_${index}`"
          />

          <CommonInputfieldsSelectfield
              v-model="channel.status_id"
              classes="col-md-4"
              label="estado"
              labelField="name"
              :data="lookups.status"
              :rules="publishChannelSchema.status_id"
              :name="`is_published_${index}`"
          />

          <CommonInputfieldsTextfield
              v-model="channel.published_at"
              classes="col-md-4"
              label="Publicado el"
              type="date"
              :name="`published_at_${index}`"
              :rules="publishChannelSchema.published_at"
          />

          <CommonInputfieldsTextfield
              v-model="channel.unpublished_at"
              classes="col-md-4"
              label="Despublicado el"
              type="date"
              :name="`unpublished_at_${index}`"
              :rules="publishChannelSchema.unpublished_at"
          />

        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IPublishChannel } from "~/interfaces/IPublishChannel";
import type { ILookup } from "~/interfaces/ILookup";
import { useValidator } from "~/composables/useValidator";
import { publishChannelSchema } from "~/utils/validations/publishChannel.schema";

const { validateForm, resetErrors } = useValidator();

const props = defineProps<{
  data?: IPublishChannel[],
  lookups: {
    publishChannels: ILookup[],
    status: ILookup[]
  }
}>();

const emit = defineEmits<{
  (e: "sendForm", payload: IPublishChannel[]): void;
  (e: "formInvalid", payload: boolean): void;
}>();

const emptyChannel: IPublishChannel = {
  channel_id: null,
  external_link: null,
  status_id: null,
  published_at: null,
  unpublished_at: null
};

const channelsList = ref<IPublishChannel[]>([{ ...emptyChannel }]);
const channelsListOriginal = ref<IPublishChannel[]>([{ ...emptyChannel }]);

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    channelsList.value = newData.map(c => ({ ...c }));
    channelsListOriginal.value = newData.map(c => ({ ...c }));
  }
}, { immediate: true });

const addChannel = () => {
  channelsList.value.push({ ...emptyChannel });
};

const removeChannel = (index: number) => {
  if (channelsList.value.length > 1) {
    channelsList.value.splice(index, 1);
    resetErrors();
  }
};

const sendForm = () => {
  const isValid = validateForm(channelsList.value, publishChannelSchema, true);

  if (isValid) {
    emit("sendForm", channelsList.value);
  } else {
    emit("formInvalid", true);
  }
};

const reset = () => {
  channelsList.value = channelsListOriginal.value.map(c => ({ ...c }));
  resetErrors();
};

defineExpose({
  sendForm,
  reset
});
</script>

<style scoped>

</style>
