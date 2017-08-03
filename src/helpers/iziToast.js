import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

export const initIziToast = () => {
  iziToast.settings({
      position: 'topRight',
      timeout: 4000,
      transitionIn: 'fadeInDown',
      transitionOut: 'fadeOut',
      progressBar: false,
      animateInside: false,
      backgroundColor: '#f2f2f2',
  })
}

export const Toast = {
  success: (text) => iziToast.show({ iconColor: '#2ecc71', icon: 'icon icon-checkmark2',    title: text }),
  warning: (text) => iziToast.show({ iconColor: '#f39c12', icon: 'icon icon-warning',       title: text }),
  info:    (text) => iziToast.show({ iconColor: '#3498db', icon: 'icon icon-info',          title: text }),
  error:   (text) => iziToast.show({ iconColor: '#e74c3c', icon: 'icon icon-cancel-circle', title: text }),
}
