export const useImageOptimizer = () => {

    const optimizeImage = (
        file: File,
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.8,
        outputType: string = 'image/webp'
    ): Promise<File> => {

        return new Promise((resolve) => {
            const img = new Image()
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!

            img.onload = () => {
                let { width, height } = img

                // resize proporcional
                if (width > maxWidth) {
                    height *= maxWidth / width
                    width = maxWidth
                }

                if (height > maxHeight) {
                    width *= maxHeight / height
                    height = maxHeight
                }

                canvas.width = width
                canvas.height = height

                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob((blob) => {
                    const optimizedFile = new File(
                        [blob!],
                        file.name.replace(/\.\w+$/, '.webp'),
                        { type: outputType }
                    )

                    resolve(optimizedFile)
                }, outputType, quality)
            }

            img.src = URL.createObjectURL(file)
        })
    }

    return { optimizeImage }
}
