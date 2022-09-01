export function bindEvent() {
  if (window?.addEventListener) {
    window.addEventListener('load', () => {
      window.addEventListener('mouseout', evt => {
        (evt.target as Element).classList.remove('md-to-html__highline');
      });
      window.addEventListener('mouseover', evt => {
        (evt.target as Element).classList.add('md-to-html__highline');
      });
      window.addEventListener(
        'click',
        evt => {
          const target = evt.target as Element;
          if (target) {
            const selectElements = document.querySelectorAll(
              '.md-to-html__selected'
            );
            if (selectElements.length) {
              for (let index = 0; index < selectElements.length; index++) {
                const element = selectElements[index] as Element;
                element.classList.remove('md-to-html__selected');
              }
            }
            const hoverActive = target.classList.contains(
              'md-to-html__highline'
            );
            if (hoverActive) {
              target.classList.add('md-to-html__selected');
              evt?.preventDefault();
            }
          }
        },
        true
      );
    });
  }
}

export function addStyles() {
  window.addEventListener('load', () => {
    const style = document.createElement('style');
    style.innerHTML = `.md-to-html__highline {
      outline: rgb(237, 73, 95) solid 2px !important;
      outline-offset: -1px !important;
      box-shadow: rgb(0 0 0 / 80%) 0px 2px 8px !important;
    }
    .md-to-html__selected {
      outline: rgb(73, 196, 237) solid 2px !important;
      outline-offset: -1px !important;
      box-shadow: rgb(0 0 0 / 80%) 0px 2px 8px !important;
    }`;

    document.head.appendChild(style);
  });
}
