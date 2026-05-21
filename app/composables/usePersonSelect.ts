import type { MaybeRef } from "vue";
import type { IParamsTable } from "~/interfaces/IParamsTable";
import type { IPersonOption } from "~/interfaces/IPersonOption";
import PersonService from "~/services/PersonService";

type ApiRun = <T>(promise: Promise<T>) => Promise<T | null>;

export const usePersonSelect = (
  run: ApiRun,
  selectedIds: MaybeRef<Array<string | null | undefined>>,
) => {
  const persons = ref<IPersonOption[]>([]);
  const paramsTable = ref<IParamsTable>({
    page: 1,
    perPage: 99999,
    sortBy: "created_at",
    sortType: "desc",
    search: "",
  });

  const personLabel = (person: any): string => {
    const name = person?.full_name ?? person?.company_name ?? "";
    const document = [
      person?.document_type_alias,
      person?.document_number,
    ].filter(Boolean);

    return document.length ? `${name} - ${document.join(" ")}` : name;
  };

  const toPersonOption = (person: any): IPersonOption | null => {
    if (!person?.id) return null;

    return {
      id: person.id,
      name: personLabel(person),
      raw: person,
    };
  };

  const uniquePersonOptions = (options: IPersonOption[]): IPersonOption[] => {
    return options.filter(
      (person, index, self) =>
        index === self.findIndex((item) => item.id === person.id),
    );
  };

  const setInitialPeople = (people: any[] = []) => {
    const initialOptions = people
      .map((person) => toPersonOption(person))
      .filter(Boolean) as IPersonOption[];

    persons.value = uniquePersonOptions([...persons.value, ...initialOptions]);
  };

  const searchPeople = async (term: string) => {
    paramsTable.value.search = term;

    const response = await run(PersonService.getPeople(paramsTable.value));
    if (!response) return;

    const foundPeople = response.data.data
      .map((person: any) => toPersonOption(person))
      .filter(Boolean) as IPersonOption[];

    const currentIds = new Set(unref(selectedIds).filter(Boolean));
    const alreadySelected = persons.value.filter((person) =>
      currentIds.has(person.id),
    );

    persons.value = uniquePersonOptions([...alreadySelected, ...foundPeople]);
  };

  return {
    persons,
    personLabel,
    toPersonOption,
    uniquePersonOptions,
    setInitialPeople,
    searchPeople,
  };
};
