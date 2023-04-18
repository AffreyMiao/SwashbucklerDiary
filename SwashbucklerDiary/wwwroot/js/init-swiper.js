import '/npm/swiper/7.4.1/swiper-bundle.min.js';
export function swiperInit(dotNetCallbackRef, callbackMethod, id, index) {
    let className = "." + id;
    window[id] = new Swiper(className, {
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        //autoHeight: true,//�Զ��߶�
        simulateTouch: false,//��ֹ���ģ��
        initialSlide: index,//�趨��ʼ��ʱslide������
        resistanceRatio: 0.7,
        on: {
            slideChangeTransitionStart: function () {
                dotNetCallbackRef.invokeMethodAsync(callbackMethod, this.activeIndex);
            },
        }
    });
}
