<template>
  <div id="sidebar" class="page-sidebar">
    <div class="logo-wrap">
      <nuxt-link to="/">
        <img
          :alt="logoAlt"
          :src="lightLogoUrl"
          class="img-fluid for-light"
          @error="setFallbackImage($event, defaultLightLogoUrl)"
        />
        <img
          :alt="logoAlt"
          :src="darkLogoUrl"
          class="img-fluid for-dark"
          @error="setFallbackImage($event, defaultDarkLogoUrl)"
        />
      </nuxt-link>
      <div class="back-btn d-lg-none d-inline-block" @click="removesidebar()">
        <Icon class="fs-3" name="mdi:chevron-double-left" />
      </div>
    </div>
    <div class="main-sidebar">
      <div class="user-profile">
        <div class="media">
          <div class="change-pic">
            <img
              :alt="userName"
              :src="userAvatarUrl"
              class="img-fluid"
              @error="setFallbackImage($event, defaultAvatarUrl)"
            />
          </div>
          <div class="media-body">
            <nuxt-link to="/users/profile">
              <h6 :title="userName">{{ userName }}</h6>
            </nuxt-link>
            <span :title="userEmail" class="font-roboto">{{ userEmail }}</span>
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
              <img alt="" class="img-fluid" src="/image/svg/1.svg" />
              <h6>Need Help</h6>
              <a
                class="p-0 m-0"
                href="https://support.pixelstrap.com/"
                target="_blank"
              >
                <span class="d-block"
                  >Raise ticket at "support@pixelstrap.com"</span
                >
              </a>
              <button
                class="btn btn-pill btn-gradient color-4 btn-sm mt-2 fw-bold"
                onclick="window.open('https://themeforest.net/user/pixelstrap/portfolio', '_blank');"
                type="button"
              >
                Buy Now
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import sidebar from "@/../public/data/sidebar.json";
import { useAuthStore } from "@/store/authStore";
import { usePublicCompanyStore } from "@/store/publicCompany";

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
const authStore = useAuthStore();
const publicCompanyStore = usePublicCompanyStore();
const { user } = storeToRefs(authStore);
const alldata = ref<MenuItem[]>([]);

const data = ref(sidebar);
const activeMenu = ref<string[]>([]);
const defaultLightLogoUrl = "/image/logo/4.png";
const defaultDarkLogoUrl = "/image/logo/9.png";
const defaultAvatarUrl = "/image/avatar/3.jpg";

const companyLogoUrl = computed(() => publicCompanyStore.logoUrl);
const lightLogoUrl = computed(
  () => companyLogoUrl.value || defaultLightLogoUrl,
);
const darkLogoUrl = computed(() => companyLogoUrl.value || defaultDarkLogoUrl);
const logoAlt = computed(
  () => publicCompanyStore.displayName || "Logo de la empresa",
);

const userEmail = computed(() => {
  const currentUser = user.value ?? {};
  const profile = currentUser.person ?? currentUser.profile ?? {};

  return getText(currentUser.email) || getText(profile.email) || "Sin correo";
});

const userName = computed(() => {
  const currentUser = user.value ?? {};
  const profile = currentUser.person ?? currentUser.profile ?? {};
  const fullName =
    getText(currentUser.name) ||
    getText(currentUser.full_name) ||
    getText(profile.name) ||
    getText(profile.full_name) ||
    [currentUser.first_name, currentUser.last_name]
      .map(getText)
      .join(" ")
      .trim() ||
    [profile.first_name, profile.last_name].map(getText).join(" ").trim() ||
    getText(currentUser.username);

  return fullName || userEmail.value || "Usuario";
});

const userAvatarUrl = computed(() => {
  const currentUser = user.value ?? {};
  const profile = currentUser.person ?? currentUser.profile ?? {};

  return (
    getText(currentUser.avatar?.url) ||
    getText(currentUser.avatar) ||
    getText(currentUser.photo?.url) ||
    getText(currentUser.photo) ||
    getText(currentUser.image?.url) ||
    getText(currentUser.image) ||
    getText(currentUser.profile_photo_url) ||
    getText(currentUser.avatar_url) ||
    getText(profile.avatar?.url) ||
    getText(profile.avatar) ||
    getText(profile.photo?.url) ||
    getText(profile.photo) ||
    getText(profile.image?.url) ||
    getText(profile.image) ||
    defaultAvatarUrl
  );
});

onMounted(() => {
  void publicCompanyStore.fetchCompany();
});

function getText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function setFallbackImage(event: Event, fallbackUrl: string) {
  const image = event.target as HTMLImageElement | null;
  if (!image || image.src.endsWith(fallbackUrl)) return;

  image.src = fallbackUrl;
}

function toggleMenu(path: string[]) {
  const pathString = path.join(".");
  const index = activeMenu.value.indexOf(pathString);

  if (index > -1) {
    activeMenu.value.splice(index, 1);
  } else {
    activeMenu.value.push(pathString);
  }
}

function removesidebar() {
  document.getElementById("main-page")?.classList.add("close_icon");
  document.getElementById("sidebar")?.classList.add("close_icon");
}

// Función recursiva para encontrar el menú activo basado en la ruta
function findActiveMenuPath(
  items: MenuItem[],
  currentPath: string[] = [],
): string[] | null {
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
      expandedPaths.push(activePath.slice(0, i).join("."));
    }
    activeMenu.value = expandedPaths;
  }
});
</script>
