export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API failed, using fallback', err);
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const selected = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.select();
    textarea.setSelectionRange(0, 99999);

    const success = document.execCommand('copy');

    document.body.removeChild(textarea);

    if (selected && selection) {
      selection.removeAllRanges();
      selection.addRange(selected);
    }

    return success;
  } catch (err) {
    console.error('Copy fallback failed:', err);
    return false;
  }
}
