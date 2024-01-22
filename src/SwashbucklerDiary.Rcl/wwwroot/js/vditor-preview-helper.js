export function previewVditor(dotNetCallbackRef, element, text, options) {
    let VditorOptions = {
        ...options,
        after: () => {
            fixLink(element);
            fixCopyDisolaySoftKeyboard(element);
            dotNetCallbackRef.invokeMethodAsync('After');
        }
    }
    Vditor.preview(element, text, VditorOptions);
}

export function copy(dotNetCallbackRef, callbackMethod, parent) {
    var elements = parent.querySelectorAll('.vditor-copy');
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            dotNetCallbackRef.invokeMethodAsync(callbackMethod);
        });
    }
}

export function previewImage(dotNetCallbackRef, callbackMethod, parent) {
    var elements = parent.querySelectorAll("img");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            dotNetCallbackRef.invokeMethodAsync(callbackMethod, this.getAttribute('src'));
        });
    }
}

//�޸�������ӵ�һЩ����
function fixLink(element) {
    var links = element.querySelectorAll("a"); // ��ȡ����a��ǩ
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href');
        if (href && !href.includes(':')) {
            href = "https://" + href;
            links[i].setAttribute("href", href); // �޸�ÿ��a��ǩ��href����
        }

    }
}

function fixCopyDisolaySoftKeyboard(element) {
    var textareas = element.querySelectorAll("textarea"); // ��ȡ����textarea��ǩ
    for (var i = 0; i < textareas.length; i++) {
        textareas[i].readOnly = true;
    }
}
