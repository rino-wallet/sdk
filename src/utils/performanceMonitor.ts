import {
  performance,
  PerformanceObserver,
  PerformanceMeasure,
} from "perf_hooks";

export class PerformanceMonitor {
  constructor() {
    const perfObserver = new PerformanceObserver((_) => {
      // items.getEntries().forEach((entry) => {});
    });

    perfObserver.observe({ entryTypes: ["measure"], buffered: true });
  }

  mark(eventName: string, type: PerformanceMarkType) {
    performance.mark(`${eventName}-${type}`);
  }

  markStart(eventName) {
    this.mark(eventName, PerformanceMarkType.START);
  }

  markEnd(eventName) {
    this.mark(eventName, PerformanceMarkType.END);
  }

  measure(eventName: string): PerformanceMeasure {
    return performance.measure(
      eventName,
      `${eventName}-${PerformanceMarkType.START}`,
      `${eventName}-${PerformanceMarkType.END}`,
    );
  }

  duration(eventName: string): number {
    return Math.round(this.measure(eventName).duration);
  }
}

export enum PerformanceMarkType {
  START = "start",
  END = "end",
}
