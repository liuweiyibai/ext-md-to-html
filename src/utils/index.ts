function onMouseout(evt: Event) {
  (evt.target as Element).classList.remove('md-to-html__highline');
}

function onMouseover(evt: Event) {
  (evt.target as Element).classList.add('md-to-html__highline');
}

function onClick(evt: Event) {
  const target = evt.target as Element;
  if (target) {
    const selectElements = document.querySelectorAll('.md-to-html__selected');
    if (selectElements.length) {
      for (let index = 0; index < selectElements.length; index++) {
        const element = selectElements[index] as Element;
        element.classList.remove('md-to-html__selected');
      }
    }
    const hoverActive = target.classList.contains('md-to-html__highline');
    if (hoverActive) {
      target.classList.add('md-to-html__selected');
      evt?.preventDefault();
    }
  }
}

export function bindEvent() {
  window.addEventListener('mouseout', onMouseout);
  window.addEventListener('mouseover', onMouseover);
  window.addEventListener('click', onClick, true);
}

export function unbindEvent() {
  window.removeEventListener('mouseout', onMouseout);
  window.removeEventListener('mouseover', onMouseover);
  window.removeEventListener('click', onClick, true);

  // 移除所有样式
  const selectElements = document.querySelectorAll('.md-to-html__selected');
  if (selectElements.length) {
    for (let index = 0; index < selectElements.length; index++) {
      const element = selectElements[index] as Element;
      element.classList.remove('md-to-html__selected');
      element.classList.remove('md-to-html__highline');
    }
  }
}

export const styles = `.md-to-html__highline {
  outline: rgb(237, 73, 95) solid 2px !important;
  outline-offset: -1px !important;
  box-shadow: rgb(0 0 0 / 80%) 0px 2px 8px !important;
}
.md-to-html__selected {
  outline: rgb(73, 196, 237) solid 2px !important;
  outline-offset: -1px !important;
  box-shadow: rgb(0 0 0 / 80%) 0px 2px 8px !important;
}`;

export function addStyles() {
  window.addEventListener('load', () => {
    const style = document.createElement('style');
    style.innerHTML = styles;
    document.head.appendChild(style);
  });
}

/**
 * 复制单行内容到粘贴板
 * content : 需要复制的内容
 * message : 复制完后的提示，不传则默认提示"复制成功"
 */
export function copyToClip(content: string, message?: string) {
  var aux = document.createElement('input');
  aux.setAttribute('value', content);
  document.body.appendChild(aux);
  aux.select();
  document?.execCommand('copy');
  document.body.removeChild(aux);
  if (!message) {
    alert('复制成功');
  } else {
    alert(message);
  }
}
