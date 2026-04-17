import * as yup from "yup";

export const permissionSchema = yup.object({
  name: yup.string().required("El nombre del permiso es obligatorio"),
});

export const roleSchema = yup.object({
  name: yup.string().required("El nombre del rol es obligatorio"),
});
