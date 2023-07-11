export class ArrayQueue<T> {

  private readonly queue: T[] = [];

  constructor() { }

  public prepend(item: T): void { this.queue.unshift(item); }

  public enqueue(item: T): void { this.queue.push(item); }

  public dequeue(): T | undefined { return this.queue.shift(); }
}
