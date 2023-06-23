import { Constants } from "../constants/Constants";

export const formatErrorBody = (error: Error, lang: string) => {

  const bodyToSend = {title: 'Error', message: error.message, type: 'ok' };
  const message = error.message.split('!!!');

  if (message && message.length && message.length >= 3) {

    const english = message[1];
    const spanish = message[2];

    if (lang === Constants.SPANISH.id) {
      bodyToSend.message = spanish;
    } else {
      bodyToSend.message = english;
    }

  }

  return bodyToSend;
};