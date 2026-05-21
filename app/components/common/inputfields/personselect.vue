<template>
  <CommonInputfieldsSelectfield
    v-model="model"
    :classes="classes"
    :data="availablePersons"
    :error="error"
    labelField="name"
    :label="label"
    :onSearch="searchPerson"
    :show="show"
    searchable
    :star="star"
  />
</template>

<script setup lang="ts">
import { useApiHandler } from "~/composables/useApiHandler";
import { useDebounce } from "~/composables/useDebounce";
import { usePersonSelect } from "~/composables/usePersonSelect";

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    classes?: string;
    error?: string;
    excludeIds?: Array<string | null | undefined>;
    initialPeople?: any[];
    label?: string;
    show?: string;
    star?: string;
  }>(),
  {
    classes: "",
    error: "",
    excludeIds: () => [],
    initialPeople: () => [],
    label: "Persona",
    show: "Selecciona una persona...",
    star: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const { run } = useApiHandler();

const model = computed({
  get: () => props.modelValue ?? "",
  set: (value: string) => emit("update:modelValue", value),
});

const selectedIds = computed(() => [
  props.modelValue,
  ...props.excludeIds,
]);

const { persons, setInitialPeople, searchPeople } = usePersonSelect(
  run,
  selectedIds,
);

const availablePersons = computed(() => {
  const excluded = new Set(props.excludeIds.filter(Boolean));

  return persons.value.filter(
    (person) => !excluded.has(person.id) || person.id === props.modelValue,
  );
});

const debouncedSearch = useDebounce(searchPeople, 700);

const searchPerson = (term: string) => {
  if (!term || term.length < 3) return;
  debouncedSearch(term);
};

watch(
  () => props.initialPeople,
  (people) => setInitialPeople(people),
  { immediate: true, deep: true },
);
</script>
