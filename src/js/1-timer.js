import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const dataTimePicker = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]'),
  dataDays = document.querySelector('span[data-days]'),
  dataHours = document.querySelector('span[data-hours]'),
  dataMinutes = document.querySelector('span[data-minutes]'),
  dataSeconds = document.querySelector('span[data-seconds]');

let userSelectedDate;

disableBtn();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] > new Date()) {
      userSelectedDate = selectedDates[0];
      activeBtn();
      iziToast.show({
        icon: 'icon-true',
        backgroundColor: '#82C43C',
        message: 'You can start the countdown',
        messageColor: '#FAFAFB',
        messageSize: '16px',
        position: 'topCenter',
        close: false,
      });
    } else {
      iziToast.show({
        icon: 'icon-false',
        backgroundColor: '#EF4040',
        message: 'Please choose a date in the future',
        messageColor: '#FFBEBE',
        messageSize: '16px',
        position: 'topCenter',
        close: false,
      });
      disableBtn();
    }
  },
};

startBtn.addEventListener('click', event => {
  event.preventDefault();

  const backReferenceTimer = setInterval(() => {
    disableBtn();
    const backReference = userSelectedDate - Date.now();
    const convertDate = convertMs(backReference);
    if (backReference > 0) {
      dataDays.textContent = addLeadingZero(convertDate.days);
      dataHours.textContent = addLeadingZero(convertDate.hours);
      dataMinutes.textContent = addLeadingZero(convertDate.minutes);
      dataSeconds.textContent = addLeadingZero(convertDate.seconds);
    } else {
      clearInterval(backReferenceTimer);
      iziToast.show({
        icon: 'icon-true',
        backgroundColor: '#82C43C',
        message: 'Date came, timer  has stopped',
        messageColor: '#FAFAFB',
        messageSize: '16px',
        position: 'topCenter',
        close: false,
      });
    }
  }, 1000);
});

function disableBtn() {
  startBtn.disable = true;
  startBtn.style.background = '#cfcfcf';
  startBtn.style.color = '#989898';
}

function activeBtn() {
  startBtn.disable = false;
  startBtn.style.background = '#4e75ff';
  startBtn.style.color = '#fff';
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

flatpickr(dataTimePicker, options);
