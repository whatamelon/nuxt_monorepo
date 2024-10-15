export default defineNuxtPlugin((nuxtApp) => {
    // intersect observer 로 lazy loading 구현 준비!
    // 24.04.08 현재는 사용하지 않음.
    nuxtApp.vueApp.directive('image-lazy-load', {
        mounted(element) {
            const loadImage = () => {

                if (element) {

                    element.src = element.dataset.src || '';
                }
            };

            let observer = new IntersectionObserver(
                loadImage(), 
                {
                    root: element,
                    rootMargin: '0px',
                    threshold: 0,
                }
            );

            observer.observe();
        }
    })
});