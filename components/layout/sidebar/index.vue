<template>
  <div id="sidebar" class="page-sidebar">
    <div class="logo-wrap">
      <nuxt-link href="/">
        <img alt="" class="img-fluid for-light" src="/image/logo/4.png">
        <img alt="" class="img-fluid for-dark" src="/image/logo/9.png">
      </nuxt-link>
      <div class="back-btn d-lg-none d-inline-block" @click="removesidebar()">
        <Icon class="fs-3" name="mdi:chevron-double-left"/>
      </div>
    </div>
    <div class="main-sidebar">
      <div class="user-profile">
        <div class="media">
          <div class="change-pic">
            <img alt="" class="img-fluid" src="/image/avatar/3.jpg">
          </div>
          <div class="media-body">
            <nuxt-link to="/users/profile"><h6>Zack Lee</h6></nuxt-link>
            <span class="font-roboto">zackle@gmail.com</span>
          </div>
        </div>
      </div>
      <div id="mainsidebar">
        <ul class="sidebar-menu custom-scrollbar">
          <LayoutSidebarItem
              v-for="(item, index) in alldata"
              :key="index"
              :active-menu="activeMenu"
              :item="item"
              :route="route"
              @toggle-menu="toggleMenu"
          />
          <li>
            <div class="upgrade-box">
              <img alt="" class="img-fluid" src="/image/svg/1.svg">
              <h6>Need Help</h6>
              <a class="p-0 m-0" href="https://support.pixelstrap.com/" target="_blank">
                <span class="d-block">Raise ticket at "support@pixelstrap.com"</span>
              </a>
              <button class="btn btn-pill btn-gradient color-4 btn-sm mt-2 fw-bold"
                      onclick="window.open('https://themeforest.net/user/pixelstrap/portfolio', '_blank');"
                      type="button">Buy Now
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import sidebar from '@/public/data/sidebar.json';

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

const route = useRoute();
const alldata = ref<MenuItem[]>([]);

const data = ref(sidebar);
const activeMenu = ref<string[]>([]);

function toggleMenu(path: string[]) {
  const pathString = path.join('.');
  const index = activeMenu.value.indexOf(pathString);

  if (index > -1) {
    activeMenu.value.splice(index, 1);
  } else {
    activeMenu.value.push(pathString);
  }
}

function removesidebar() {
  document.getElementById('main-page')?.classList.add('close_icon');
  document.getElementById('sidebar')?.classList.add('close_icon');
}

// Función recursiva para encontrar el menú activo basado en la ruta
function findActiveMenuPath(items: MenuItem[], currentPath: string[] = []): string[] | null {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const newPath = [...currentPath, i.toString()];

    if (item.link === route.path) {
      return newPath;
    }

    if (item.children) {
      const result = findActiveMenuPath(item.children, newPath);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

watchEffect(() => {
  if (data.value) {
    alldata.value = data.value?.sidebar || [];
  }
});

watchEffect(() => {
  const activePath = findActiveMenuPath(alldata.value);
  if (activePath) {
    // Expandir todos los padres del item activo
    const expandedPaths: string[] = [];
    for (let i = 1; i < activePath.length; i++) {
      expandedPaths.push(activePath.slice(0, i).join('.'));
    }
    activeMenu.value = expandedPaths;
  }
});
</script>
