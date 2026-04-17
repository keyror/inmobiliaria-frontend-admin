declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export default component;
}

declare module "bootstrap/dist/js/bootstrap.bundle" {
  import * as bootstrap from "bootstrap";

  export default bootstrap;
}

declare module "vue3-form-wizard" {
  import type { DefineComponent } from "vue";

  export const FormWizard: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export const TabContent: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
}

declare module "dropzone-vue";
declare module "vue-datamaps";
