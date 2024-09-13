export class HistoryManager<State> {
  ignore = false;
  cur = 0;
  states: State[] = [];
  push(state: State) {
    if (this.ignore) {
      this.ignore = false;
      return;
    }
    this.states = this.states.slice(0, this.cur + 1);
    this.states.push(state);
    this.cur = this.states.length - 1;
  }

  ignoreNextPush() {
    this.ignore = true;
  }
  cancelIgnore() {
    this.ignore = false;
  }

  undo() {
    if (this.cur > 0) {
      this.cur--;
    }
    return this.getState();
  }

  redo() {
    if (this.cur < this.states.length - 1) {
      this.cur++;
    }
    return this.getState();
  }

  getState(): State | undefined {
    return this.states[this.cur];
  }

  reset() {
    this.cur = 0;
    this.states = [];
    return this.getState();
  }
}
