interface Param {
  message: string;
}

export default function appMessage(param: Param | string) {
  const body = document.body;
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('app-message');
  if (typeof param === 'string') {
    messageContainer.textContent = param;
  } else {
    if (param) {
      messageContainer.textContent = param.message;
    }
  }

  const bodyInnerMessage = document.querySelectorAll('body > .app-message');
  for (const iterator of bodyInnerMessage) {
    body.removeChild(iterator);
  }

  body.append(messageContainer);
  setTimeout(() => {
    const bodyInnerMessage = document.querySelectorAll('body > .app-message');
    for (const iterator of bodyInnerMessage) {
      body.removeChild(iterator);
    }
  }, 2000);
}
