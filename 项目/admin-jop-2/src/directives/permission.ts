import { DirectiveOptions } from 'vue';
import router from '@/router';

export const permission: DirectiveOptions = {
  bind(htmlElement, directiveBinding) {
    const { meta } = router.currentRoute;
    const { arg } = directiveBinding;

    if (arg) {
      const canAccess = meta.feature[arg];

      if (!canAccess) {
        htmlElement.style.opacity = '0.3';
        htmlElement.style.pointerEvents = 'none';
        htmlElement.style.cursor = 'not-allowed';
      }
    }
  }
}
