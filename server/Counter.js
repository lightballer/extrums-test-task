class Counter {
  constructor(value = 0) {
    this.value = value;
  }

  get getValue() {
    return this.value;
  }

  set setValue(value) {
    this.value = value;
  }

  increase() {
    this.value++;
  }

  decrease() {
    this.value--;
  }
}

module.exports = new Counter();
