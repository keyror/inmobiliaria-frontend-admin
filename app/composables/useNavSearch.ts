import sidebarData from "@/../public/data/sidebar.json";
import { useAuthStore } from "@/store/authStore";

interface NavItem {
  title: string;
  link: string;
  icon: string;
  permission?: string | string[];
}

interface RawMenuItem {
  link?: string;
  icon?: string;
  title: string;
  permission?: string | string[];
  children?: RawMenuItem[];
}

function flattenMenu(
  items: RawMenuItem[],
  parentTitle = "",
  parentIcon = ""
): NavItem[] {
  const result: NavItem[] = [];

  for (const item of items) {
    const icon = item.icon || parentIcon;
    const breadcrumb = parentTitle ? `${parentTitle} › ${item.title}` : item.title;

    if (item.link) {
      result.push({
        title: breadcrumb,
        link: item.link,
        icon,
        permission: item.permission,
      });
    }

    if (item.children?.length) {
      result.push(...flattenMenu(item.children, item.title || parentTitle, icon));
    }
  }

  return result;
}

const ALL_NAV_ITEMS: NavItem[] = flattenMenu(
  (sidebarData as { sidebar: RawMenuItem[] }).sidebar
);

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n');
}

export function useNavSearch() {
  const auth = useAuthStore();

  const search = (query: string): NavItem[] => {
    const q = normalize(query.trim());
    if (q.length < 3) return [];

    return ALL_NAV_ITEMS.filter((item) => {
      if (item.permission) {
        const perms = Array.isArray(item.permission) ? item.permission : [item.permission];
        if (!perms.some((p) => auth.hasPermission(p))) return false;
      }
      return normalize(item.title).includes(q);
    });
  };

  return { search };
}
