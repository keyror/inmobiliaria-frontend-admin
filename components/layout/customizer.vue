<template>
    <div class="customizer-wrap" :class="open ? 'open' : ''">
        <div class="customizer-links" @click="open = true">
            <Icon name="material-symbols:settings-outline" />
        </div>
        <div class="customizer-contain custom-scrollbar">
            <div class="setting-back">
                <Icon name="ic:round-close" @click="open = false" />
            </div>
            <div class="layouts-settings">
                <div class="customizer-title">
                    <h6 class="color-1">Layout type</h6>
                </div>
                <div class="option-setting">
                    <span>Light</span>
                    <label class="switch">
                        <input type="checkbox" name="chk1" value="option" @input="check()" class="setting-check"><span
                            class="switch-state"></span>
                    </label>
                    <span>Dark</span>
                </div>
            </div>
            <div class="layouts-settings">
                <div class="customizer-title">
                    <h6 class="color-1">Layout Direction</h6>
                </div>
                <div class="option-setting">
                    <span>LTR</span>
                    <label class="switch">
                        <input type="checkbox" name="chk2" value="option" @input="layout()" class="setting-check1"><span
                            class="switch-state"></span>
                    </label>
                    <span>RTL</span>
                </div>
            </div>
            <div class="layouts-settings">
                <div class="customizer-title">
                    <h6 class="color-1">Unlimited Color</h6>
                </div>
                <div class="option-setting unlimited-color-layout">
                    <div class="form-group">
                        <label for="ColorPicker1">color 1</label>
                        <input id="ColorPicker1" v-model="primary" @change="setcolor()" type="color" name="Default">
                    </div>
                    <div class="form-group">
                        <label for="ColorPicker2">color 2</label>
                        <input id="ColorPicker2" v-model="secondary" type="color" @change="setcolor()" name="Default">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { usecustomizerStore } from '~/store/costomizer'
interface Color {
    primary: string;
    secondary: string;
}
let primary = ref<string>('#f35d43');
let secondary = ref<string>('#f34451');
let open = ref<boolean>(false)
let dark = ref<boolean>(false)
let dir = ref<boolean>(false)
let store = usecustomizerStore();
onMounted(() => {
    if (process.client) {
        primary.value = localStorage.getItem('primary') || '#f35d43';
        secondary.value = localStorage.getItem('secondary') || '#f34451';
    }
});
function setcolor() {
    if (process.client) {
    localStorage.setItem('primary', primary.value);
    localStorage.setItem('secondary', secondary.value);
    }
    store.setcolor({ primary: primary.value, secondary: secondary.value });
}
function check() {
    dark.value = !dark.value
    if (dark.value == true) {
        document.body.classList.add('dark-layout')
    }
    else {
        document.body.classList.remove('dark-layout')
    }
}
function layout() {
    dir.value = !dir.value
    if (dir.value == true) {
        document.body.classList.add('rtl')
        document.documentElement.dir = "rtl"
    }
    else {
        document.body.classList.remove('rtl')
        document.documentElement.dir = "ltr"
    }
}

</script>

<style lang="scss" scoped></style>