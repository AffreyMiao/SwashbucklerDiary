import '/js/swiper-bundle.min.js';
export function swiperInit(dotNetCallbackRef, callbackMethod, id, index) {
    console.log('Entered initSwiper!');
    let className = "." + id;
    window[id] = new Swiper(className, {
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        autoHeight: true,//�Զ��߶�
        simulateTouch: false,//��ֹ���ģ��
        initialSlide: index,//�趨��ʼ��ʱslide������
        on: {
            slideChangeTransitionEnd: function () {
                dotNetCallbackRef.invokeMethodAsync(callbackMethod, this.activeIndex);
            },
        }
    });
}
