class Poller {
  isPolling: boolean;
  pollingTimeout: number;
  pollingInterval: number;

  constructor(): void {
    this.isPolling = false;
    this.pollingInterval = 100;
    this.pollingTimeout = 0;
  }

  poll(): number {
    return setTimeout(function() {
      this.poll();
    }.bind(this), this.pollingInterval);
  }

  startPolling(interval: number = 0): void {
    if (interval >= 100) {
      this.pollingInterval = interval;
    } else if (interval !== 0 && interval < 100) {
      throw new Error('Interval must be equal to or greater than 100');
    }
    this.pollingTimeout = this.poll();
    this.isPolling = true;
  }

  stopPolling(): void {
    clearTimeout(this.pollingTimeout);
    this.pollingTimeout = 0;
    this.isPolling = false;
  }
}

export default Poller;
