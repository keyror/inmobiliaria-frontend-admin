<template>
  <li class="sidebar-item">
    <nuxt-link
        :class="{
                active: isActive,
                'only-link': item.link && !item.children,
            }"
        :to="item.link || 'javascript:void(0)'"
        class="sidebar-link"
        @click="handleClick"
    >
      <Icon :class="level > 0 ? 'fs-6' : 'fs-3'" :name="item.icon"/>
      <span>{{ item.title }}</span>
      <span v-if="item.label" class="label label-shadow ms-2">{{ item.label }}</span>
      <div v-if="item.children && level === 0" class="according-menu">
        <i :class="isExpanded ? 'fa-angle-down' : 'fa-angle-right'" class="fa"></i>
      </div>
    </nuxt-link>

    <ul
        v-if="item.children"
        :class="isExpanded ? 'd-block' : 'd-none'"
        class="nav-submenu menu-content"
    >
      <LayoutSidebarItem
          v-for="(child, index) in item.children"
          :key="index"
          :active-menu="activeMenu"
          :item="child"
          :level="level + 1"
          :parent-path="currentPath"
          :route="route"
          @toggle-menu="$emit('toggle-menu', $event)"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
interface MenuItem {
  link?: string;
  icon: string;
  title: string;
  titlePage?: string;
  collapse?: boolean;
  active?: boolean;
  label?: string;
  children?: MenuItem[];
}

interface Props {
  item: MenuItem;
  route: any;
  activeMenu: string[];
  parentPath?: string[];
  level?: number;
}

const props = withDefaults(defineProps<Props>(), {
  parentPath: () => [],
  level: 0
});

const emit = defineEmits<{
  (e: 'toggle-menu', path: string[]): void;
}>();

const currentPath = computed(() => {
  const index = props.parentPath.length > 0
      ? props.item.title
      : props.item.title;
  return [...props.parentPath, index];
});

const pathString = computed(() => currentPath.value.join('.'));

const isExpanded = computed(() => {
  return props.activeMenu.includes(pathString.value);
});

const isActive = computed(() => {
  if (props.item.link === props.route.path) {
    return true;
  }

  // Verificar si algún hijo está activo
  if (props.item.children) {
    return hasActiveChild(props.item.children);
  }

  return false;
});

function hasActiveChild(children: MenuItem[]): boolean {
  for (const child of children) {
    if (child.link === props.route.path) {
      return true;
    }
    if (child.children && hasActiveChild(child.children)) {
      return true;
    }
  }
  return false;
}

function handleClick(event: Event) {
  if (props.item.children) {
    event.preventDefault();
    emit('toggle-menu', currentPath.value);
  }
}
</script>

<style scoped>
.nav-submenu {
  transition: all 0.3s ease;
}

.according-menu {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
