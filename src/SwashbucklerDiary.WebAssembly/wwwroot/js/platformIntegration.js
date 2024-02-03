export async function checkCameraPermission() {
    try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' });
        return permissionStatus.state === 'granted';
    } catch (error) {
        console.error('�޷��������ͷȨ��', error);
        return false;
    }
}

export function isCaptureSupported() {
    return false;
}

export async function tryCameraPermission() {
    try {
        // ʹ�� await �ȴ� Promise ����
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // ����ͷȨ�������裬���Թرջ���stream
        stream.getTracks().forEach(track => track.stop());
        return true; // ���� true ��ʾȨ��������
    } catch (error) {
        // ����ͷȨ�ޱ��ܾ�����ִ���
        console.error('����ͷȨ���������:', error);
        return false; // ���� false ��ʾȨ��δ��������
    }
}

export function openUri(uri, blank) {
    return new Promise((resolve, reject) => {
        // ���ҳ��״̬�ı�־
        let pageHiddenOrBlurred = false;

        // ����ҳ��״̬�仯���¼�
        function handlePageChange() {
            pageHiddenOrBlurred = true;
            cleanup();
            // ҳ��״̬�仯����Ϊ���ӱ�����
            resolve(true);
        }

        // �Ƴ��¼�����������
        function cleanup() {
            window.removeEventListener('blur', handlePageChange);
            window.removeEventListener('pagehide', handlePageChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }

        // ����ҳ��ɼ��Ա仯���¼�
        function handleVisibilityChange() {
            if (document.hidden) {
                handlePageChange();
            }
        }

        // ����ҳ��״̬�仯���¼�
        window.addEventListener('blur', handlePageChange);
        window.addEventListener('pagehide', handlePageChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // ���������<a>Ԫ���Գ��Դ�����
        const a = document.createElement("a");
        a.href = uri;
        if (blank) {
            a.target = "_blank";
        }
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();

        // ���ó�ʱ���
        setTimeout(() => {
            cleanup();
            if (!pageHiddenOrBlurred) {
                // ���ָ��ʱ����ҳ��״̬û�б仯����Ϊ����û�б���
                reject(false);
            }
        }, 1000);
    });
};

export function capturePhotoAsync() {
    return '';
}

export function setClipboard(text) {
    if (navigator.clipboard) {
        try {
            navigator.clipboard.writeText(text)
        } catch (e) {
            execCommand()
        }
    } else {
        execCommand()
    }

    function execCommand() {
        let input = document.createElement('input');
        input.type = 'text';
        input.readOnly = true;
        input.value = text; 

        document.body.appendChild(input);
        input.focus();
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy')
        }
        input.blur();
        input.remove();
    }
}

export async function shareTextAsync(title, text) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text
            })
            console.log('Thanks for sharing!');
        } catch (e) {
            console.error(e);
        }
    }
}

export async function shareFileAsync(title, path) {
    if (navigator.share) {
        try {
            if (Module.FS.analyzePath(path).exists) {
                const fileName = path.split('/').pop();
                const data = Module.FS.readFile(path);
                const file = new File([data], fileName, { type: 'image/png' });
                await navigator.share({
                    title: title,
                    files: [file]
                })
                console.log('Thanks for sharing!');
            }

        } catch (e) {
            console.error(e);
        }
    } 
}

export function saveFileAsync(fileName, filePath) {
    const path = `/${filePath}`;
    const fileData = Module.FS.readFile(path);
    var blob = new Blob([fileData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export function pickFileAsync(accept, suffix) {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.style.display = 'none';

        function handleSelectedFile() {
            const file = input.files[0];
            if (file) {
                if (suffix && !file.name.endsWith(suffix)) {
                    resolve("");
                }
                else {
                    // wasmģʽ��C#����md5�Ƚ��ѣ�������js�м���
                    calculateMD5(file)
                        .then((md5) => {
                            var newFileName = `${md5}${file.name.substring(file.name.lastIndexOf("."))}`;
                            var newFile = new File([file], newFileName);
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                // ��ȡ�ļ�����
                                var contents = event.target.result;

                                // д�� Emscripten �ļ�ϵͳ
                                var filePath = `cache/${newFile.name}`;
                                Module.FS.writeFile(filePath, new Uint8Array(contents), { encoding: 'binary' });
                                resolve(filePath);
                            };
                            reader.readAsArrayBuffer(newFile);
                        })
                        .catch(() => {
                            resolve("");
                        });
                }
            } else {
                resolve("");
            }
            input.remove();
        }

        function afterChooseFile() {
            setTimeout(() => {
                handleSelectedFile();
                // �Ƴ��¼���������ȷ������ִֻ��һ��
                window.removeEventListener("focus", afterChooseFile);
                document.removeEventListener("touchstart", afterChooseFile);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
                input.removeEventListener("change", afterChooseFile);
                input.remove();
            }, 200);

        }

        function handleVisibilityChange() {
            if (document.visibilityState === "visible") {
                afterChooseFile();
            }
        }

        window.addEventListener("focus", afterChooseFile, { once: true });
        document.addEventListener("touchstart", afterChooseFile, { once: true });
        document.addEventListener("visibilitychange", handleVisibilityChange);
        input.addEventListener("change", afterChooseFile, { once: true });

        input.click();
    });
}

function calculateMD5(pickfile) {
    return new Promise((resolve, reject) => {
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            file = pickfile,
            chunkSize = 2097152,                             // Read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        fileReader.onload = function (e) {
            console.log('read chunk nr', currentChunk + 1, 'of', chunks);
            spark.append(e.target.result);                   // Append array buffer
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                resolve(spark.end());
            }
        };

        fileReader.onerror = function (event) {
            reject("FileReader error: " + event.target.errorCode);
        };

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext();
    });
}
