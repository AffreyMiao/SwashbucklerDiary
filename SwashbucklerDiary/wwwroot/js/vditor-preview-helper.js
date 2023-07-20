export function PreviewVditor(dotNetCallbackRef, element, text, options) {
    let VditorOptions = {
        ...options,
        after: () => {
            dotNetCallbackRef.invokeMethodAsync('After');
        }
    }
    Vditor.preview(element, text, VditorOptions);
}

export function Copy(dotNetCallbackRef, callbackMethod) {
    var elements = document.querySelectorAll('.vditor-copy');
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            dotNetCallbackRef.invokeMethodAsync(callbackMethod);
        });
    }
}

export function FixLink(element) {
    var links = element.querySelectorAll("a"); // ��ȡ����a��ǩ
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href');
        if (href && !href.includes(':')) {
            href = "https://" + href;
            links[i].setAttribute("href", href); // �޸�ÿ��a��ǩ��href����
        }

    }
}
