import { IQueue } from "../domain/common-interfaces";

/**
 * Use for small collections.
 */
export class ArrayQueue<T> implements IQueue<T> {

  private readonly arr: T[] = [];

  public empty(): boolean { return this.arr.length === 0; }

  public prepend(item: T): void { this.arr.unshift(item); }

  public enqueue(item: T): void { this.arr.push(item); }

  public dequeue(): T | undefined { return this.arr.shift(); }
}

type LinkedListItem<T> = {
  item: T;
  next: LinkedListItem<T> | undefined;
}

/**
 * Use for potentially large collections.
 */
export class LinkedListQueue<T> implements IQueue<T> {

  private count = 0;
  private head: LinkedListItem<T> | undefined = undefined;
  private tail: LinkedListItem<T> | undefined = undefined;

  public empty(): boolean { return this.count === 0; }

  public prepend(item: T): void {
    const llitem = { item: item, next: this.head };

    this.head = llitem;
    this.tail = (!this.tail) ? llitem : this.tail;
    
    ++this.count;
  }

  public enqueue(item: T): void {
    const llitem = { item: item, next: undefined };

    this.head = this.head ?? llitem;

    if (this.tail) { this.tail.next = llitem; }
    this.tail = llitem;

    ++this.count;
  }

  public dequeue(): T | undefined {
    const llitem = this.head;
    this.head = this.head?.next;

    this.tail = (this.tail !== llitem) ? this.tail : undefined;

    this.count = this.count - (llitem ? 1 : 0);
    return llitem?.item;
  }
}
