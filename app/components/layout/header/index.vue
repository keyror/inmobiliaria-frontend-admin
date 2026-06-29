<template>
  <div class="page-main-header row" id="main-page">
    <div
      id="sidebar-toggle"
      class="toggle-sidebar col-auto"
      @click="sidebartoggle()"
    >
      <Icon name="mdi:chevron-double-left" size="20" />
    </div>
    <div class="nav-right col p-0">
      <ul class="header-menu">
        <LayoutHeaderGlobalSearch />
        <li>
          <a href="#!" @click="toggleFullScreen()">
            <Icon name="humbleicons:maximize" size="20" />
          </a>
        </li>
        <!--
        <ClientOnly>
          <LayoutHeaderAttachment />
          <LayoutHeaderNotification />
          <LayoutHeaderMessage />
        </ClientOnly>
        -->
        <li class="profile-avatar onhover-dropdown">
          <div>
            <img src="/image/avatar/3.jpg" class="img-fluid" alt="" />
          </div>
          <ul class="profile-dropdown onhover-show-div">
            <!--
            <li>
              <nuxt-link to="/users/profile"
                ><span>Account </span
                ><Icon name="mdi:account-outline" size="20"
              /></nuxt-link>
            </li>
            <li>
              <nuxt-link to="/myproperties/propertylist"
                ><span>Listing</span
                ><Icon name="mdi:file-document-outline" size="20"
              /></nuxt-link>
            </li>
            -->
            <li>
              <nuxt-link @click="submitForm"
                ><span>Salir</span><Icon name="mdi:logout" size="20"
              /></nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { run } = useApiHandler();
const auth = useAuthStore();

const submitForm = async () => {
  const response = await run(auth.logout(), {
    showSuccess: true,
    successMessage: "Sesión cerrada correctamente",
  });

  if (response) {
    navigateTo("/authentication/login");
  }
};

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

const sidebartoggles = ref<boolean>(false);
function sidebartoggle() {
  sidebartoggles.value = !sidebartoggles.value;
  if (window.screen.width > 991) {
    if (sidebartoggles.value == true) {
      document.getElementById("main-page")?.classList.add("close_icon");
      document.getElementById("sidebar")?.classList.add("close_icon");
    } else {
      document.getElementById("main-page")?.classList.remove("close_icon");
      document.getElementById("sidebar")?.classList.remove("close_icon");
    }
  } else {
    document.getElementById("main-page")?.classList.remove("close_icon");
    document.getElementById("sidebar")?.classList.remove("close_icon");
  }
}
</script>

<style scoped>
.profile-dropdown a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
</style>
