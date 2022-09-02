/* eslint-disable no-console */
import { onMessage, sendMessage } from 'webext-bridge';
import { createApp } from 'vue';

import App from './views/App.vue';
import { bindEvent, addStyles, unbindEvent, copyToClip } from '~/utils';
import {
  CLICK_EXT_TRANS_MENU,
  EXT_BIND_EVENT,
  EXT_UNBIND_EVENT,
} from '~/utils/keys';

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  document.documentElement.style.fontSize = '16px';
  console.info('[vitesse-webext] Hello world from content script');

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`);
  });

  onMessage(CLICK_EXT_TRANS_MENU, async () => {
    const dom = document.querySelector('.md-to-html__selected');
    if (dom) {
      sendMessage('EXT_FETCH_HTML', { a: '1' });
      // const url = window.location.href;
      // const sitdown = new Sitdown();
      // const markdown = sitdown.HTMLToMD(dom.innerHTML);
      // copyToClip(markdown);
    }
  });

  onMessage(EXT_BIND_EVENT, () => {
    bindEvent();
  });

  onMessage(EXT_UNBIND_EVENT, () => {
    unbindEvent();
  });

  // mount component to context window
  const container = document.createElement('div');
  const root = document.createElement('div');
  const styleEl = document.createElement('link');
  const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) ||
    container;
  styleEl.setAttribute('rel', 'stylesheet');
  styleEl.setAttribute(
    'href',
    browser.runtime.getURL('dist/contentScripts/style.css')
  );
  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(root);
  document.body.appendChild(container);
  createApp(App).mount(root);
  addStyles();
})();
