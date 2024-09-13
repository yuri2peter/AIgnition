import { saveAs } from 'file-saver';

export function uploadFileFromBrowser(
  multiple: false,
  accept?: string
): Promise<File>;
export function uploadFileFromBrowser(
  multiple: true,
  accept?: string
): Promise<File[]>;
export function uploadFileFromBrowser(
  multiple = false,
  accept = '*'
): Promise<File | File[]> {
  return new Promise((resolve, reject) => {
    let fileCancle = true;
    // Create a hidden input element and open the file picker dialog
    const elInput = document.createElement('input');
    elInput.type = 'file';
    elInput.accept = accept;
    elInput.multiple = multiple;
    elInput.style.display = 'none';
    document.body.append(elInput); // For iOS compatibility, must be mounted to body
    // Listen for cancel actions
    window.addEventListener(
      'focus',
      () => {
        setTimeout(() => {
          if (fileCancle) {
            // Cancel handing logic
            reject('cancelled upload');
          }
        }, 1000);
      },
      { once: true }
    );
    elInput.onchange = () => {
      fileCancle = false;
      const file = elInput?.files?.[0];
      if (file) {
        if (multiple) {
          resolve(Array.from(elInput.files!));
        } else {
          resolve(file);
        }
      } else {
        reject('cancelled upload');
      }
      setTimeout(() => {
        document.body.removeChild(elInput);
      }, 0);
    };
    elInput.click();
  });
}

export function saveJsonDataToBrowser(data: any, fileName = 'export.json') {
  const file = new File([JSON.stringify(data, null, 2)], fileName, {
    type: 'text/plain;charset=utf-8',
  });
  saveAs(file);
}
