import * as yup from "yup";

export const passwordSchema = yup
  .string()
  .min(8, "Mínimo 8 caracteres")
  .matches(/[A-Za-z]/, "Debe tener letras")
  .matches(/[0-9]/, "Debe tener números")
  .required("La contraseña es obligatoria");

export const emailSchema = yup
  .string()
  .email("Email inválido")
  .required("El email es obligatorio");
