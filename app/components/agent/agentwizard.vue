<template>
  <div class="page-body">
    <CommonBreadcrumb title="Add agent wizard" page="Agents" />
    <div class="container-fluid property-wizard horizontal-wizard">
      <div class="row wizard-box">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body admin-wizard">
              <ClientOnly>
                <form @submit.prevent="onSubmit">
                  <div class="wizard-tabs">
                    <button
                      v-for="step in totalSteps"
                      :key="step"
                      type="button"
                      :class="['wizard-tab', { active: currentStep === step }]"
                      @click="goToStep(step)"
                    >
                      <span class="step-number">{{ step }}</span>
                      <span class="step-title">{{ stepTitles[step - 1] }}</span>
                    </button>
                  </div>

                  <div v-if="currentStep === 1" class="wizard-step">
                    <UserFormwizardFirsttab v-model="form.started" />
                    <div class="mt-5">
                      <button
                        type="button"
                        class="btn btn-next"
                        @click="nextStep"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div v-if="currentStep === 2" class="wizard-step">
                    <UserFormwizardSecondtab v-model="form.login" />
                    <div class="mt-5">
                      <button
                        type="button"
                        class="btn btn-back me-2"
                        @click="prevStep"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        class="btn btn-next"
                        @click="nextStep"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div v-if="currentStep === 3" class="wizard-step">
                    <UserFormwizardThirdtab v-model="form.upload" />
                    <div class="mt-5">
                      <button
                        type="button"
                        class="btn btn-back me-2"
                        @click="prevStep"
                      >
                        Back
                      </button>
                      <button type="submit" class="btn btn-submit">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useForm } from "vee-validate";
import * as yup from "yup";

const currentStep = ref<number>(1);
const totalSteps = 3;
const stepTitles = ["Get started", "Login details", "Upload files"];
const formSubmitted = ref(false);

const { handleSubmit, values: form } = useForm({
  initialValues: {
    started: {},
    login: {},
    upload: [],
  },
  validationSchema: yup.object({
    started: yup.object().required(),
    login: yup.object().required(),
    upload: yup.array().min(1, "At least 1 image required"),
  }),
});

const nextStep = () => {
  if (currentStep.value < totalSteps) currentStep.value++;
};
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};
const goToStep = (step: number) => {
  if (step >= 1 && step <= totalSteps) currentStep.value = step;
};

const onSubmit = handleSubmit((formValues) => {
  formSubmitted.value = true;

  currentStep.value = 1;
});
</script>

<style scoped></style>
