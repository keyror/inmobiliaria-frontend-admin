// services/LoadingService.ts
import { ref } from 'vue'

class LoadingService {
    private _isLoading = ref(false)

    get isLoading() {
        return this._isLoading.value
    }

    get state() {
        return this._isLoading
    }

    show() {
        console.log('hola')
        this._isLoading.value = true
    }

    hide() {
        this._isLoading.value = false
    }
}

export default new LoadingService()
