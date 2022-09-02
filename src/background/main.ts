import { onMessage, sendMessage } from 'webext-bridge';
import type { Tabs } from 'webextension-polyfill';
import { putUserWorkFlows } from '~/fetch';

import {
  CLICK_EXT_TRANS_MENU,
  START_HTML_TO_MD,
  STOP_HTML_TO_MD,
  TRANS_HTML_TO_MD,
  EXT_BIND_EVENT,
  EXT_UNBIND_EVENT,
} from '~/utils/keys';

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client');
  // load latest content script
  import('./contentScriptHMR');
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed');
});

let previousTabId = 0;

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId;
    return;
  }

  let tab: Tabs.Tab;

  try {
    tab = await browser.tabs.get(previousTabId);
    previousTabId = tabId;
  } catch {
    return;
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab);
  sendMessage(
    'tab-prev',
    { title: tab.title },
    { context: 'content-script', tabId }
  );
});

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId);
    return {
      title: tab?.title,
    };
  } catch {
    return {
      title: undefined,
    };
  }
});

onMessage('EXT_FETCH_HTML', async (data: any) => {
  console.log('====================================');
  console.log(data);
  console.log('====================================');
  putUserWorkFlows(data);
});

injectStartMenu();

// 注册一个menu
function injectStartMenu() {
  browser.contextMenus.create({
    title: '启动html-to-md',
    id: START_HTML_TO_MD,
  });
}

function injectStopMenu() {
  browser.contextMenus.create({
    title: '停用html-to-md',
    id: STOP_HTML_TO_MD,
  });
}

// 解析按钮
function injectTransMenu() {
  browser.contextMenus.create({
    title: '解析html-to-md',
    id: TRANS_HTML_TO_MD,
  });
}

browser.contextMenus.onClicked.addListener(async e => {
  if (e.menuItemId === START_HTML_TO_MD) {
    injectStopMenu();
    injectTransMenu();
    browser.contextMenus.remove(START_HTML_TO_MD);
    // 绑定事件
    sendMessage(
      EXT_BIND_EVENT,
      {},
      { context: 'content-script', tabId: previousTabId }
    );
  } else if (e.menuItemId === STOP_HTML_TO_MD) {
    browser.contextMenus.remove(TRANS_HTML_TO_MD);
    browser.contextMenus.remove(STOP_HTML_TO_MD);
    injectStartMenu();
    // 取消绑定事件
    sendMessage(
      EXT_UNBIND_EVENT,
      {},
      { context: 'content-script', tabId: previousTabId }
    );
  } else if (e.menuItemId === TRANS_HTML_TO_MD) {
    // 发送消息获取选中的 html
    const resp = await sendMessage(
      CLICK_EXT_TRANS_MENU,
      {},
      { context: 'content-script', tabId: previousTabId }
    );
    console.log(resp);
  }
});
